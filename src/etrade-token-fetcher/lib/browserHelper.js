const puppeteer = require("puppeteer");
const debug = require("debug")("etradeTokenFetcher");
const fs = require("fs");
const path = require("path");
const exceptions = require("./exceptions");

async function Login(webUsername, webPassword, headless) {
  const browser = await puppeteer.launch({
    headless: headless
  });
  const page = await browser.newPage();

  const preloadFile = fs.readFileSync(
    path.join(__dirname, "../preload.js"),
    "utf8"
  );

  await page.evaluateOnNewDocument(preloadFile);

  // Pass the User-Agent Test.
  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64)" +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";

  await page.setUserAgent(userAgent);

  await page.goto("https://us.etrade.com/e/t/user/login");

  // Enter login creds
  await page.focus("#user_orig");
  await page.keyboard.type(webUsername);
  await page.focus("input[name='PASSWORD']");
  await page.keyboard.type(webPassword);

  // Login
  const loginButtonElement = await page.$("#logon_button");
  await loginButtonElement.click();

  try {

    let logoutButtonAwaitTimeoutSeconds = 7000;

    debug(
      "Determining if logged in; Timeout in " +
       logoutButtonAwaitTimeoutSeconds / 1000 +
       " seconds."
    );

    // Try and looked for the logout button (login success)
    await page.waitFor(".logout", { timeout: logoutButtonAwaitTimeoutSeconds });

    debug("Login successful.");

    return {
      page,
      browser
    };
  } catch {

    debug("Login unsuccessful, trying to determine why.");

    await page
      .waitForFunction(
        'document.querySelector(".universal-message-content > .vertical-offset-xs").innerText.indexOf("942") > -1',
        { timeout: 1000 }
      )
      .then(
        () => {
          debug("Detected 942 error, throwing.");
          throw new exceptions.HeadlessBrowserDetectedException(
            `It is possible the browser has been detected as a bot. Please run login command in non-headless mode to visually debug.`
          );
        },
        () => false
      );

    await page
      .waitForFunction(
        'document.querySelector(".universal-message-content > .universal-message-heading").innerText.indexOf("password you entered") > -1',
        { timeout: 1000 }
      )
      .then(
        () => {
          debug("Detected password related error, throwing.");
          throw new exceptions.InvalidUsernamePasswordException(
            `Invalid userID or password detected. Please run login command in non-headless mode to visually debug.`
          );
        },
        () => false
      );

    await page
      .waitForFunction(
        'document.querySelector(".universal-message-content > .universal-message-heading").innerText.indexOf("account has been locked due to repeated unsuccessful log on attempts") > -1',
        { timeout: 1000 }
      )
      .then(
        () => {
          debug("Detected account locked related error, throwing.");
          throw new exceptions.AccountLockedException(
            `The account has been locked, probably due to too many invalid login attempts. Please run login command in non-headless mode to visually debug.`
          );
        },
        () => false
      );

    debug("Unable to determine what the error is, throwing generic.");
    throw new exceptions.UnexpectedLoginBrowserException(
      "Unknown login exception. Please run login command in non-headless mode to visually debug."
    );
  }
}

async function GetValidationCode(page, finalAuthURL) {
  // Goto final auth URL
  await page.goto(finalAuthURL);

  // Accept authorization
  const acceptButtonElement = await page.$("input[value='Accept']");
  await acceptButtonElement.click();

  await page.waitForNavigation();

  const accessCodeElement = await page.$("input");
  const validationCode = await page.evaluate(
    element => element.value,
    accessCodeElement
  );

  return validationCode;
}

const browserApi = {
  login: Login,
  getValidationCode: GetValidationCode
};

module.exports = browserApi;
