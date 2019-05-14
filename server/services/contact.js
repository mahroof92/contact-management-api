/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const AppError = require('../errors/appError');
const errorConstant = require('../constants/errorConstant');
const utils = require('../utils/appUtils');

/**
 * To validate the phone input list before creating and updating a contact
 * 1. Checks whether a minimum of one phone number exists
 * 2. If new contact, _id should not be there in the input
 * 3. Checks for phone number key in all the entire list
 * 4. Check if the tag key is present in the list
 * 5. Checks if contacts has duplicate pair of phone number and tag combined
 * 6. Validate whether the given phone number is a valid phone number
 */
const validatePhoneInput = async (input) => {
  try {
    if (!input.phone || !input.phone.length) {
      throw new AppError(errorConstant.ERRORS.PHONE_NUMBER_MANDATORY);
    }
    const phoneNumberIdList = input.phone.filter(p => !p._id);
    if (!input._id && phoneNumberIdList.length !== input.phone.length) {
      throw new AppError(errorConstant.ERRORS.INVALID_ID_KEY_PHONE);
    }
    let phoneNumberList = input.phone.map(p => p.number);
    if (input.phone.length !== phoneNumberList.length) {
      throw new AppError(errorConstant.ERRORS.MISSING_PHONE_NUMBER);
    }
    // If tag is made mandatory
    const phoneNumberTagList = input.phone.map(p => p.tag);
    if (input.phone.length !== phoneNumberTagList.length) {
      throw new AppError(errorConstant.ERRORS.MISSING_PHONE_TAG);
    }
    const inputPhoneList = await utils.filterPhoneKeysFromList(input.phone);
    // If phone number and tag has duplicate entries in the list
    if (inputPhoneList.length !== input.phone.length) {
      throw new AppError(errorConstant.ERRORS.DUPLICATE_ENTRY_PHONE);
    }
    phoneNumberList = inputPhoneList.map(p => p.number);
    const isPhoneNumberValid = await utils.validatePhoneNumber(phoneNumberList);
    if (!isPhoneNumberValid) {
      throw new AppError(errorConstant.ERRORS.INVALID_PHONE_NUMBER);
    }
    return inputPhoneList;
  } catch (error) {
    throw error;
  }
};

/**
 * To validate the email input list before creating and updating a contact
 * 1. Checks if email id exists in the list
 * 2. If new contact, _id should not be there in the input
 * 3. Checks for email id key in all the entire list
 * 4. Check if the tag key is present in the list
 * 5. Checks if contacts has duplicate pair of email id and tag combined
 * 6. Validate whether the given email is a valid email id
 */
const validateEmailInput = async (input) => {
  try {
    if (input.email && input.email.length) {
      const emailIdList = input.email.filter(e => !e._id);
      if (!input._id && emailIdList.length !== input.email.length) {
        throw new AppError(errorConstant.ERRORS.INVALID_ID_KEY_EMAIL);
      }
      let emailList = input.email.map(e => e.id);
      if (input.email.length !== emailList.length) {
        throw new AppError(errorConstant.ERRORS.MISSING_EMAIL_ID);
      }
      // If tag is made mandatory
      const emailTagList = input.email.map(e => e.tag);
      if (input.email.length !== emailTagList.length) {
        throw new AppError(errorConstant.ERRORS.MISSING_EMAIL_TAG);
      }
      const inputEmailList = await utils.filterEmailKeysFromList(input.email);
      // If Email id and tag has duplicate entries
      if (inputEmailList.length !== input.email.length) {
        throw new AppError(errorConstant.ERRORS.DUPLICATE_ENTRY_EMAIL);
      }
      emailList = inputEmailList.map(e => e.id);
      const isEmailValid = await utils.validateEmail(emailList);
      if (!isEmailValid) {
        throw new AppError(errorConstant.ERRORS.INVALID_EMAIL_ID);
      }
      return inputEmailList;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Validating create contact input
 */
const validateContactInput = async (input) => {
  try {
    if (input.length) {
      throw new AppError(errorConstant.ERRORS.BAD_INPUT_REQUEST);
    }
    if (input._id) {
      throw new AppError(errorConstant.ERRORS.INVALID_ID_KEY);
    }
    if (!input.name) {
      throw new AppError(errorConstant.ERRORS.NAME_MANDATORY);
    }
    const [phoneList, emailList] = [await validatePhoneInput(input),
      await validateEmailInput(input)];
    input.phone = phoneList;
    input.email = emailList;
    return input;
  } catch (error) {
    throw error;
  }
};

/**
 * Validating the input request for updating a contact
 */
const validateUpdateInput = async (id, input) => {
  try {
    if (input.length) {
      throw new AppError(errorConstant.ERRORS.BAD_INPUT_REQUEST);
    }
    if (input && !input._id) {
      throw new AppError(errorConstant.ERRORS.MISSING_CONTACT_ID);
    }
    if (id !== input._id) {
      throw new AppError(errorConstant.ERRORS.REQUEST_ID_MISMATCH);
    }
    if (!input.name) {
      throw new AppError(errorConstant.ERRORS.NAME_MANDATORY);
    }
    const [phoneList, emailList] = [await validatePhoneInput(input),
      await validateEmailInput(input)];
    input.phone = phoneList;
    input.email = emailList;
    return input;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validatePhoneInput,
  validateEmailInput,
  validateContactInput,
  validateUpdateInput,
};
