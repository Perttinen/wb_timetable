import { User, Userlevel } from "../../database/models";

import { IJsonUserFromDb } from "../../types";

export const userlevelsToArray = (user: User) => {
  const jsonUser: IJsonUserFromDb = user.toJSON();
  console.log(jsonUser);

  const returnUser = {
    ...jsonUser,
    userlevels: jsonUser.userlevels.map((ul) => ul.userlevel),
  };
  return returnUser;
};

// User getter common parameters
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

// export default {
//   addUserlevels,
//   userlevelsToArray,
// };
