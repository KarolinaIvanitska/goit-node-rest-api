import Contact from "../models/Contact.js";

export const listContacts = () => {
  Contact.find();
};

export const getContactById = (_id) => {
  Contact.findOne({ _id });
};

export const removeContact = (_id) => {
  Contact.findOneAndDelete(filter);
};

export const addContact = (data) => {
  Contact.create(data);
};

export const updateContact = (_id, data) => {
  Contact.findOneAndUpdate(_id, data);
};

export const updateContactByStatus = (_id, data) => {
  Contact.findOneAndUpdate({ _id: _id }, data);
};
