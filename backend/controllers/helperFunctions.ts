import { Line, User, Userlevel } from "../../database/models";

import { lineTypes, userTypes } from "../../types";

export const userlevelsToArray = (user: User): userTypes.TUser => {
  const jsonUser: userTypes.TUserRaw = user.toJSON();
  const returnUser = {
    ...jsonUser,
    userlevels: jsonUser.userlevels.map((ul) => ul.userlevel),
  };
  return returnUser;
};

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

export const createReturnableLine = (
  line: Line
): lineTypes.TLineReturnable | null => {
  const jsonLine: lineTypes.TLineRaw = line.toJSON();

  if (!jsonLine.docks || !jsonLine.endDock || !jsonLine.startDock) {
    return null;
  }

  const stopDocks = jsonLine.docks
    .map((dock) => ({
      id: dock.id,
      name: dock.name,
      delayFromStart: dock.lineDock.delayFromStart,
    }))
    .sort((a, b) => a.delayFromStart - b.delayFromStart);

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
};
