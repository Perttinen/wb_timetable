interface IUser {
  username: string;
}

export interface IJsonUserFromDb extends IUser {
  password: string;
  id: number;
  disabled: boolean;
  userlevels: { userlevel: string; id: number }[];
  username: string;
}

export interface IJsonSafeUser extends IUser {
  token: string;
  id: number;
  disabled: boolean;
  userlevels: { userlevel: string; id: number }[];
  username: string;
}

export interface IJsonUserFromDbNoLevels extends IUser {
  password: string;
  id: number;
  disabled: boolean;
  username: string;
}

export interface ICreateUserEntry extends IUser {
  password: string;
  userlevel?: string[];
}

export interface IUpdateUserEntry {
  disabled?: boolean;
  id: number;
  password?: string;
  userlevels?: string[];
  username?: string;
}

export interface IJsonUser extends IUser {
  id: number;
  userlevels: [{ userlevel: string }];
  disabled: boolean;
}

export interface IJsonUserPw extends IJsonUser {
  password: string;
}

export interface IUserlevel {
  id: number;
  userlevel: string;
}
