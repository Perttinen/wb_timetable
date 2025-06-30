import Router from "express";

import lines from "../controllers/lineController";
// import { authorizer } from "../util/middleware";

const router = Router();

router.route("/").post(lines.createNewLine);
// router.route("/many").post(lines.createManyLines);
router.route("/").get(lines.getAllLines);
router.route("/:id").get(lines.getLine);
router.route("/:id").delete(lines.deleteLine);
router.route("/").delete(lines.deleteAllLines);
router.route("/").patch(lines.updateLine);

export default router;
