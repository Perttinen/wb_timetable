import Router from "express";

import departures from "../controllers/departureController";
// import { authorizer } from "../util/middleware";

const router = Router();

router.route("/").post(departures.createDeparture);
// router.route("/many").post(docks.createManyDocks);
// router.route("/").get(docks.getAllDocks);
// router.route("/:id").get(docks.getDock);
// router.route("/:id").delete(docks.deleteDock);
// router.route("/").delete(docks.deleteAllDocks);
// router.route("/").patch(docks.updateDock);

export default router;
