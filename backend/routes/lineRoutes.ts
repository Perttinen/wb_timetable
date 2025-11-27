import Router from "express";

import lines from "../controllers/lineController";
import { authorizer } from "../util/middleware";

const router = Router();

router.route("/").post(authorizer("admin"), lines.createNewLine);
router.route("/").get(authorizer("user"), lines.getAllLines);
router.route("/:id").get(authorizer("user"), lines.getLine);
router.route("/:id").delete(authorizer("admin"), lines.deleteLine);
router.route("/:id").patch(authorizer("admin"), lines.updateLine);
// deleteAllLines works but not in use
// router.route("/").delete(authorizer("hal"), lines.deleteAllLines);

export default router;
