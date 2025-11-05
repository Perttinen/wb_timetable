import Router from "express";

import departures from "../controllers/departureController";

import { authorizer } from "../util/middleware";

const router = Router();
router.route("/addone").post(authorizer("user"), departures.createDeparture);
router
  .route("/addmany")
  .post(authorizer("user"), departures.createManyDepartures);
router.route("/").get(authorizer("user"), departures.getAllDepartures);
router
  .route("/deletemany")
  .delete(authorizer("user"), departures.deleteDepartures);
router.route("/timetable/:dockId").get(departures.get20DeparturesByDockName);
router
  .route("/line/:lineId")
  .get(authorizer("user"), departures.getDeparturesByLineId);

export default router;
