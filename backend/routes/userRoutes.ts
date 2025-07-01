import Router from "express";

import users from "../controllers/userController";
import { authorizer } from "../util/middleware";

const router = Router();

router.route("/").post(authorizer("admin"), users.createNewUser);
router.route("/").get(authorizer("user"), users.getAllUsers);
router.route("/:id").get(users.getUser);
router.route("/:id").delete(authorizer("admin"), users.deleteUser);
router.route("/").delete(authorizer("hal"), users.deleteAllUsers);
router.route("/").patch(authorizer("admin"), users.updateUser);

export default router;
