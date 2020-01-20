module.exports = function parseStringAsArray(arrayAsString) {
    if (!arrayAsString) {
        return arrayAsString
    }

    return arrayAsString.split(',').map(tech => tech.trim());
}