const ERRORS = {
  PHONE_NUMBER_MANDATORY: {
    message: 'Bad Input Request - One Phone number is mandatory for a contact',
    status: 422,
  },
  INVALID_ID_KEY_PHONE: {
    message: 'Bad Input Request - Invalid key _id in phone list',
    status: 422,
  },
  MISSING_PHONE_NUMBER: {
    message: 'Bad Input Request - Phone number is missing in one or more phone list',
    status: 422,
  },
  MISSING_PHONE_TAG: {
    message: 'Bad Input Request - Phone number tag is missing in one or more phone list',
    status: 422,
  },
  DUPLICATE_ENTRY_PHONE: {
    message: 'Bad Input Request - Phone number and tag has duplicate entries',
    status: 422,
  },
  INVALID_PHONE_NUMBER: {
    message: 'Bad Input Request - One or more phone number is invalid',
    status: 422,
  },
  INVALID_ID_KEY_EMAIL: {
    message: 'Bad Input Request - Invalid key _id in email list',
    status: 422,
  },
  MISSING_EMAIL_ID: {
    message: 'Bad Input Request - Email Id is missing in one or more email list',
    status: 422,
  },
  MISSING_EMAIL_TAG: {
    message: 'Bad Input Request - Email Id tag is missing in one or more email list',
    status: 422,
  },
  DUPLICATE_ENTRY_EMAIL: {
    message: 'Bad Input Request - Email id and tag has duplicate entries',
    status: 422,
  },
  INVALID_EMAIL_ID: {
    message: 'Bad Input Request - One or more email id is invalid',
    status: 422,
  },
  BAD_INPUT_REQUEST: {
    message: 'Bad Input Request.',
    status: 422,
  },
  INVALID_ID_KEY: {
    message: 'Bad Input Request - Invalid key _id',
    status: 422,
  },
  NAME_MANDATORY: {
    message: 'Bad Input Request - Name is mandatory',
    status: 422,
  },
  NAME_EXISTS: {
    message: 'Bad Input Request - Name already exists',
    status: 409,
  },
  INVALID_ID: {
    message: 'Invalid Id',
    status: 404,
  },
  MISSING_CONTACT_ID: {
    message: 'Contact ID not found in request body',
    status: 400,
  },
  REQUEST_ID_MISMATCH: {
    message: 'Request Param ID did not match with the request body ID',
    status: 400,
  },
  CANNOT_ADD_CONTACT: {
    message: 'Bad Input Request - Contacts cannot be added while creating a group',
    status: 422,
  },
  GROUP_EXISTS: {
    message: 'Group with this name already exists',
    status: 422,
  },
  INVALID_GROUP_ID: {
    message: 'Invalid Contact Group Id',
    status: 422,
  },
  ID_MANDATORY: {
    message: 'Bad request input - _id is mandatory',
    status: 422,
  },
  INVALID_KEY_CONTACTS: {
    message: 'Bad request input - Invalid key contacts',
    status: 422,
  },
  CONTACT_LIST_MANDATORY: {
    message: 'Bad request input - Contacts list is mandatory',
    status: 422,
  },
  DUPLICATE_CONTACT_LIST: {
    message: 'Bad request input - Contacts list has duplicate elements',
    status: 422,
  },
  MAX_CONTACT_EXCEEDS: {
    message: 'Bad request input - Contacts list length exceeds 100',
    status: 422,
  },
  INVALID_CONTACT_IDS: {
    message: 'Bad request input - One or more contact id(s) invalid',
    status: 422,
  },
  INVALID_VALUE_NAME: {
    message: 'Bad request input - Invalid value for name',
    status: 422,
  },
  CONTACT_ID_EXISTS: {
    message: 'Bad request input - Contact Id already exists in the group',
    status: 422,
  },
  NO_SPACE_ALLOWED: {
    message: 'Bad request input - No space allowed for search key',
    status: 422,
  },
};

module.exports = {
  ERRORS,
};
