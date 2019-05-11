
const validateCreateInput = async (input) => {
  let error = null;
  if (input.length) {
    error = 'Bad Input Request.';
  }
  if (!input.name) {
    error = 'Bad Input Request - Name is mandatory';
  }
  if (input.contacts) {
    error = 'Bad Input Request - Contacts cannot be added while creating a group';
  }
  // eslint-disable-next-line no-underscore-dangle
  if (input._id) {
    error = 'Bad Input Request - Invalid key _id';
  }
  return error;
};

module.exports = {
  validateCreateInput,
};
