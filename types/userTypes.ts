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

// export type IJsonUserFlattenedLevels = {
//   username:string
//   id: number;
//   disabled: boolean;
//   userlevels: string[];
// }

// export  TJsonUser = {
//   password: string;
//   id: number;
//   userlevels?: { userlevel: string }[];
//   disabled: boolean;
//   username: string
// }

export type TUpdateUserInput = {
  disabled?: boolean;
  password?: string;
  userlevels?: string[];
  username?: string;
};

export type TJsonUserFromDbNoLevels = {
  password: string;
  id: number;
  disabled: boolean;
  username: string;
};

export type TJsonUserPw = {
  username: string;
  id: number;
  userlevels?: { userlevel: string }[];
  disabled: boolean;
  password: string;
};

export type TUserRaw = {
  password: string;
  id: number;
  disabled: boolean;
  userlevels: { userlevel: string; id: number }[];
  username: string;
};

export type TNewUserRequest = {
  username: string;
  password: string;
  userlevel: string[];
};
