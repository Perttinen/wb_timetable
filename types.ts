export interface IBigLine {
  id: number;
  startDock: {
    name: string;
    id: number;
  };
  endDock: {
    name: string;
    id: number;
  };
  docks: {
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

export interface IDeparture {
  id: number;
  lineId: number;
  start: Date;
}

export interface IFormattedLine {
  lineId: number;
  endDock: string;
  delay: number;
  via: string[];
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
  userlevels: { userlevel: string }[];
  disabled: boolean;
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
