/**
 * Regex Pattern to validate the phone number
 */
const validatePhoneNumber = async (numberList) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/;
  let count = 0;
  numberList.map((p) => {
    if (regex.test(p)) {
      count += 1;
    }
    return null;
  });
  if (count !== numberList.length) {
    return false;
  }
  return true;
};

/**
 * Regex Pattern to validate the email
 */
const validateEmail = async (emailList) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let count = 0;
  emailList.map((p) => {
    if (regex.test(p)) {
      count += 1;
    }
    return null;
  });
  if (count !== emailList.length) {
    return false;
  }
  return true;
};

module.exports = {
  validatePhoneNumber,
  validateEmail,
};
