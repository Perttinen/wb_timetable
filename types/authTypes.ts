import { TUserSafe } from "./userTypes";

export type TCheckPasswordArgs = {
  password: string;
};

export type TLoginArgs = {
  username: string;
  password: string;
};

export type TLoginResponse = {
  user: TUserSafe;
  token: string;
};
export type TLoginRequest = {
  username: string;
  password: string;
};

export type TConfirmedPasswordsType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
