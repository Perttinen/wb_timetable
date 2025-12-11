export type TUser = {
  username: string
  id: number
  disabled: boolean
  userlevels: string[]
  password: string
}

export type TUserSafe = {
  id: number
  disabled: boolean
  userlevels: string[]
  username: string
}

export type TTestUser = {
  user: TUserSafe
  token?: string
}

export type TUpdateUserRequest = {
  disabled?: boolean
  password?: string
  userlevels?: string[]
  username?: string
}

export type TNewUserRequest = {
  username: string
  password: string
  userlevel: string[]
}
