interface IUser {
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
