const NE = require("node-exceptions");

class InvalidUsernamePasswordException extends NE.LogicalException {}
class HeadlessBrowserDetectedException extends NE.LogicalException {}
class UnexpectedLoginBrowserException extends NE.LogicalException {}
class AccountLockedException extends NE.LogicalException {}

module.exports = {
  InvalidUsernamePasswordException,
  HeadlessBrowserDetectedException,
  UnexpectedLoginBrowserException,
  AccountLockedException,
};