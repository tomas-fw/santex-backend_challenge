/* eslint-disable no-useless-escape */
class Utils {
  static capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  static capitalizeEach = (text) =>
    text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

module.exports = Utils;
