import Router from "express";

import auth from "../controllers/authController";
import { authorizer } from "../util/middleware";

const router = Router();

router.route("/login").post(auth.login);
router.route("/me").get(authorizer("admin/user"), auth.me);
router.route("/checkpw").post(authorizer("admin/user"), auth.checkPassword);
router.route("/refresh").get(auth.refresh);

export default router;
