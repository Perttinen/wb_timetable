import Router from "express";

import departures from "../controllers/departureController";

import { authorizer } from "../util/middleware";

const router = Router();
router.route("/").post(authorizer("user"), departures.createDeparture);
router.route("/").get(authorizer("user"), departures.getAllDepartures);
router.route("/:dockId").get(departures.get20DeparturesByDockId);

export default router;
