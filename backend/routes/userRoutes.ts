import Router from "express";

import users from "../controllers/userController";
import { authorizer } from "../util/middleware";

const router = Router();

router.route("/").post(authorizer("admin"), users.createNewUser);
router.route("/").get(authorizer("admin"), users.getAllUsers);
router.route("/:id").get(authorizer("admin"), users.getUser);
router.route("/:id").delete(authorizer("admin"), users.deleteUser);
router.route("/:id").patch(authorizer("admin/user"), users.updateUser);
// deleteAllUsers works but not in use
// router.route("/").delete(authorizer("hal"), users.deleteAllUsers);

export default router;
