const errorConstant = require('../constants/errorConstant');

const validateCreateInput = async (input) => {
  let error = null;
  if (input.length) {
    error = errorConstant.ERRORS.BAD_INPUT_REQUEST;
  } else if (!input.name) {
    error = errorConstant.ERRORS.NAME_MANDATORY;
  } else if (input.contacts) {
    error = errorConstant.ERRORS.CANNOT_ADD_CONTACT;
  // eslint-disable-next-line no-underscore-dangle
  } else if (input._id) {
    error = errorConstant.ERRORS.INVALID_ID_KEY;
  }
  return error;
};

module.exports = {
  validateCreateInput,
};
