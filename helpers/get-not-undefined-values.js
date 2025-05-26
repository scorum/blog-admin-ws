function getNotUndefinedValues(obj) {
  const updateParams = {};

  // eslint-disable-next-line
  Object.entries(obj).forEach(([key, value]) => value !== undefined && (updateParams[key] = value));

  return updateParams;
}

module.exports = getNotUndefinedValues;
