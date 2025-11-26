import Router from "express";

import departures from "../controllers/departureController";

import { authorizer } from "../util/middleware";

const router = Router();
router.route("/addone").post(authorizer("user"), departures.createDeparture);
router
  .route("/addmany")
  .post(authorizer("admin"), departures.createManyDepartures);
router
  .route("/deletemany")
  .delete(authorizer("admin"), departures.deleteDepartures);
router.route("/timetable/:dockId").get(departures.get20DeparturesByDockId);
// getDeparturesByLineId used only in tests
router
  .route("/byline/:lineId")
  .get(authorizer("user"), departures.getDeparturesByLineId);
// getAllDepartures works but not in use
// router.route("/").get(authorizer("user"), departures.getAllDepartures);

export default router;
