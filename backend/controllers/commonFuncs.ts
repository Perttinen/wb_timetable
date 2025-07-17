import { Line, User, Userlevel } from "../../database/models";

import { IBigLine, IJsonUserFromDb, ILineReturnable } from "../../types";

export const userlevelsToArray = (user: User) => {
  const jsonUser: IJsonUserFromDb = user.toJSON();

  const returnUser = {
    ...jsonUser,
    userlevels: jsonUser.userlevels.map((ul) => ul.userlevel),
  };
  return returnUser;
};

// User getter common parameters
export const addUserlevels = {
  include: [
    {
      model: Userlevel,
      attributes: ["userlevel"],
      through: {
        attributes: [],
      },
    },
  ],
};

export const lineIncludes = [
  {
    association: "startDock",
    attributes: ["id", "name"],
  },
  {
    association: "endDock",
    attributes: ["id", "name"],
  },
  {
    association: "docks",
    attributes: ["id", "name"],
    through: {
      attributes: ["delayFromStart"],
    },
  },
];

export const createReturnableLine = (line: Line): ILineReturnable | void => {
  const jsonLine: IBigLine = line.toJSON();
  if (jsonLine.docks && jsonLine.endDock && jsonLine.startDock) {
    const stopDocks = jsonLine.docks.map((dock) => ({
      id: dock.id,
      name: dock.name,
      delayFromStart: dock.lineDock.delayFromStart,
    }));
    return {
      id: jsonLine.id,
      startDock: {
        name: jsonLine.startDock.name,
        id: jsonLine.startDock.id,
      },
      endDock: {
        name: jsonLine.endDock.name,
        id: jsonLine.endDock.id,
      },
      stopDocks,
    };
  }
};

// export default {
//   addUserlevels,
//   userlevelsToArray,
// };
