import Router from "express";

import docks from "../controllers/dockController";
import { authorizer } from "../util/middleware";

const router = Router();

router.route("/").post(authorizer("admin"), docks.createNewDock);
router.route("/").get(docks.getAllDocks);
router.route("/:id").get(docks.getDock);
router.route("/:id").delete(authorizer("admin"), docks.deleteDock);
router.route("/").delete(authorizer("hal"), docks.deleteAllDocks);
router.route("/").patch(authorizer("admin"), docks.updateDock);

export default router;
