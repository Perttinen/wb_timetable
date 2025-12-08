import { TUserSafe } from "./userTypes";

export type TLoginResponse = {
  user: TUserSafe;
  token: string;
};

export type TLoginRequest = {
  username: string;
  password: string;
};
