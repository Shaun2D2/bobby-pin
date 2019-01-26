/**
 * compare object keys to a list of acceptable keys and return an array.
 */
const filterKeys = (obj, filters) => Object.entries(obj).filter(([index]) => filters.includes(index));

/**
 * compare object keys to a list of acceptable keys and reconstruct to an object.
 */
const objectKeyFilter = (obj = {}, filters = []) => filterKeys(obj, filters).reduce((acc, entry) => ({ [entry[0]]: entry[1], ...acc }), {});

module.exports = { filterKeys, objectKeyFilter };