function InsertString(a, b, at)
{
    var position = a.indexOf(at); 
    if (position !== -1)
    {
        return a.substr(0, position) + b + a.substr(position);    
    }  
    throw Error("Substring not found");
}

module.exports = {
    insertString: InsertString
};