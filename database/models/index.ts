import User from "./user";
import UserAndlevel from "./userAndLevel";
import Userlevel from "./userlevel";

User.belongsToMany(Userlevel, { through: UserAndlevel });
Userlevel.belongsToMany(User, { through: UserAndlevel });

export { UserAndlevel, User, Userlevel };
