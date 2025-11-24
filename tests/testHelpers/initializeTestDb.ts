import {
  Departure,
  Dock,
  Line,
  LineDock,
  User,
  UserAndlevel,
} from "../../database/models";
import { IJsonUser } from "../../typesFile";
import { Op } from "@sequelize/core";
import { docks } from "../testHelpers/data/docks";

interface IDock {
  id: number;
  name: string;
}

interface ILine {
  id: number;
  startDockId: number;
  endDockId: number;
}

const create20Docks = async () => {
  // const docks: { name: string }[] = [];
  // for (let i = 1; i < 21; i++) {
  //   docks.push({ name: `dock${i}` });
  // }
  const returnDocks: IDock[] = (await Dock.bulkCreate(docks)).map((d) =>
    d.toJSON()
  );
  return returnDocks;
};

const deleteAllButHal = async () => {
  const hal = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { username: "hal" },
  });
  if (hal) {
    const jsonHal: IJsonUser = hal.toJSON();
    await UserAndlevel.destroy({
      where: { userId: { [Op.not]: jsonHal.id } },
    });
    await User.destroy({ where: { id: { [Op.not]: jsonHal.id } } });
  }
};

const create4Lines = async (docks: IDock[]) => {
  // creates 4 lines with some stop points
  const lines = [
    { startDockId: docks[0].id, endDockId: docks[5].id },
    { startDockId: docks[2].id, endDockId: docks[7].id },
    { startDockId: docks[8].id, endDockId: docks[7].id },
    { startDockId: docks[1].id, endDockId: docks[4].id },
  ];
  const createdLines: ILine[] = (await Line.bulkCreate(lines)).map((l) =>
    l.toJSON()
  );

  const stops = [
    { lineId: createdLines[0].id, dockId: docks[9].id, delayFromStart: 11 },
    { lineId: createdLines[1].id, dockId: docks[0].id, delayFromStart: 22 },
    { lineId: createdLines[1].id, dockId: docks[5].id, delayFromStart: 33 },
    { lineId: createdLines[2].id, dockId: docks[0].id, delayFromStart: 24 },
    { lineId: createdLines[2].id, dockId: docks[5].id, delayFromStart: 42 },
    { lineId: createdLines[2].id, dockId: docks[6].id, delayFromStart: 63 },
  ];
  await LineDock.bulkCreate(stops);
  return createdLines.map((l) => l.id);
};

const create10Departures = async (lineIds: number[]) => {
  const depaerturesToAdd: { lineId: number; start: Date }[] = [];
  for (let i = 1; i < 21; i++) {
    const now = new Date(Date.now());
    const departures = [
      {
        lineId: lineIds[0],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[0],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
      {
        lineId: lineIds[1],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[1],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
      {
        lineId: lineIds[2],
        start: new Date(new Date(Date.now()).setDate(now.getDate() - i)),
      },
      {
        lineId: lineIds[2],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[2],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
      {
        lineId: lineIds[3],
        start: new Date(new Date(Date.now()).setDate(now.getDate() - i)),
      },
      {
        lineId: lineIds[3],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[3],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
    ];
    depaerturesToAdd.push(...departures);
  }

  await Departure.bulkCreate(depaerturesToAdd);
};

const initializeDb = async () => {
  // clear database
  try {
    await Departure.destroy({ where: {} });
    await LineDock.destroy({ where: {} });
    await Line.destroy({ where: {} });
    await Dock.destroy({ where: {} });
    await deleteAllButHal();
    // add initial values
    const docksDb = await create20Docks();
    const lineIdsDb = await create4Lines(docksDb);
    await create10Departures(lineIdsDb);
    return { docksDb, lineIdsDb };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return null;
  }
};

export default initializeDb;
