export interface IBigLine {
  id: number;
  startDock?: {
    name: string;
    id: number;
  };
  endDock?: {
    name: string;
    id: number;
  };
  docks?: {
    name: string;
    id: number;
    lineDock: {
      delayFromStart: number;
    };
  }[];
}

export interface ICreateUserEntry extends IUser {
  password: string;
  userlevel?: string[];
}

export interface IDeleteDeparturesPayload {
  lineId: number;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  weekdays: boolean[];
}

export interface IDeparture {
  id: number;
  lineId: number;
  start: Date;
}

export interface IDepartureForTimetable {
  destination: string;
  startTime: Date;
  via: string[];
}

export interface IDock {
  id: number;
  name: string;
}
export interface IDockname {
  name: string;
}

export interface IFormattedLine {
  lineId: number;
  endDock: string;
  delay: number;
  via: string[];
}

export interface IInputDeparture {
  lineId: number;
  start: Date;
}

export interface IJsonSafeUser extends IUser {
  token: string;
  id: number;
  disabled: boolean;
  userlevels: { userlevel: string; id: number }[];
  username: string;
}

export interface IJsonUser extends IUser {
  id: number;
  userlevels?: { userlevel: string }[];
  disabled: boolean;
}

export interface IJsonUserFlattenedLevels extends IUser {
  id: number;
  disabled: boolean;
  userlevels: string[];
}

export interface IJsonUserFlattenedLevels extends IUser {
  id: number;
  disabled: boolean;
  userlevels: string[];
}

export interface IJsonUserFromDb extends IUser {
  password: string;
  id: number;
  disabled: boolean;
  userlevels: { userlevel: string; id: number }[];
  username: string;
}

export interface IJsonUserFromDbNoLevels extends IUser {
  password: string;
  id: number;
  disabled: boolean;
}

export interface IJsonUserPw extends IJsonUser {
  password: string;
}

export interface ILine {
  id: number;
  startDockId: number;
  endDockId: number;
}

export interface ILineReturnable {
  id: number;
  startDock: {
    name: string;
    id: number;
  };
  endDock: {
    name: string;
    id: number;
  };
  stopDocks: {
    name: string;
    id: number;
    delayFromStart: number;
  }[];
}

export interface ILineToAdd {
  startDockId: number;
  stops: { dockId: number; delayFromStart: number }[];
  endDockId: number;
}

export interface ILineWithStopsArray {
  id: number;
  startDockId: number;
  endDockId: number;
  stops: IStop[];
}

export interface IStop {
  id: number;
  dockId: number;
  delayFromStart: number;
}

interface IUser {
  username: string;
}

export interface IUserlevel {
  id: number;
  userlevel: string;
}
