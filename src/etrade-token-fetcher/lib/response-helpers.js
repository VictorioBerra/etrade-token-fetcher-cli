function ToBody(r) {
    return r.body.toString();
}

function ThrowIfNot200(r) {
    if(r.statusCode !== 200){
        throw new Error(ToBody(r));
    } else {
        return r;
    }
}

module.exports = {
  toBody: ToBody,
  throwIfNot200: ThrowIfNot200
};