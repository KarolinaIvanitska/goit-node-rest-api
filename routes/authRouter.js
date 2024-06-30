import express from "express";
import validateBody from "../helpers/validateBody.js";
import { authSignInSchema, authSignUpSchema } from "../schemas/authSchema.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import authControllers from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignUpSchema),
  authControllers.signup
);

authRouter.post(
  "login",
  isEmptyBody,
  validateBody(authSignInSchema),
  authControllers.login
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);
export default authRouter;
