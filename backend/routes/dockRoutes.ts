import Router from "express";

import docks from "../controllers/dockController";
import { authorizer } from "../util/middleware";

const router = Router();

router.route("/").post(authorizer("admin"), docks.createNewDock);
router.route("/").get(docks.getAllDocks);
router.route("/:id").get(docks.getDock);
router.route("/:id").delete(authorizer("admin"), docks.deleteDock);
router.route("/").patch(authorizer("admin"), docks.updateDock);
// deleteAllDocks works but not in use
// router.route("/").delete(authorizer("hal"), docks.deleteAllDocks);

export default router;
