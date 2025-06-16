import Router from "express";

import users from "../controllers/userController";

const router = Router();

router.route("/").post(users.createNewUser);
router.route("/").get(users.getAllUsers);
router.route("/:id").get(users.getUser);
router.route("/:id").delete(users.deleteUser);
router.route("/").delete(users.deleteAllUsers);
router.route("/").patch(users.updateUser);

export default router;
