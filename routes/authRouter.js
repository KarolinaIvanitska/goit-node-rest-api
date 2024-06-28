import express from "express";
import validateBody from "../helpers/validateBody.js";
import { authSignInSchema, authSignUpSchema } from "../schemas/authSchema.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignUpSchema),
  authControllers.signup
);

export default authRouter;
