import Router from "express";

import auth from "../controllers/authController";

const router = Router();

router.route("/login").post(auth.login);

export default router;
