import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import getFilterWithIdOwner from "../helpers/getFilterwithIdOwner.js";
const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const filter = { owner };
    const result = await contactsService.listContacts({ filter });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const filter = getFilterWithIdOwner(req);
    const result = await contactsService.getContactById(filter);

    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const filter = getFilterWithIdOwner(req);
    const result = await contactsService.removeContact(filter);
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(...req.body, owner);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const filter = getFilterWithIdOwner(req);
    const result = await contactsService.updateContact(filter, req.body);
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
  } catch (error) {
    next(error);
  }
};
export const updateStatusContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateContactByStatus(
      { _id: id },
      req.body
    );
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
