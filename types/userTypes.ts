export type TUser = {
  username: string;
  id: number;
  disabled: boolean;
  userlevels: string[];
  password: string;
};

export type TUserSafe = {
  id: number;
  disabled: boolean;
  userlevels: string[];
  username: string;
};

export type TUserRaw = {
  password: string;
  id: number;
  disabled: boolean;
  userlevels: { userlevel: string; id: number }[];
  username: string;
};
