export const newArray = (length = 0) => {
  const list = new Array(length);
  for (let i = 0, len = list.length; i < len; i++) {
    list[i] = null;
  }
  return list;
};
