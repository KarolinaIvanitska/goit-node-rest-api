import HttpError from "../helpers/HttpError.js";
import * as authServices from "../services/authServices.js";
import bcrypt from "bcrypt";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import path from "path";
import { fs } from "fs/promises";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const { BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");
const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );
  res.json({ message: "Verification successful" });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (user.verify === false) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = { id };

  const token = createToken(payload);
  await authServices.updateUser({ _id: id }, { token });
  res.json({ token });
};

const getCurrent = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });
  res.json({ message: "Logout success" });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  await authServices.setAvatar(_id, avatarURL);
  res.json({ avatarURL });
};

export default {
  signup,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  resendEmail,
};
