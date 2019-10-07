module.exports = function sumAmount(hashOfArray) {
  let result = 0;
  hashOfArray.forEach(item => (result += item.amount));
  return result;
};
