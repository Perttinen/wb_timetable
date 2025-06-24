import User from "./user";
import UserAndlevel from "./userAndLevel";
import Userlevel from "./userlevel";
import Dock from "./dock";
import Line from "./line";
import LineDock from "./lineDock";

User.belongsToMany(Userlevel, { through: UserAndlevel });
Userlevel.belongsToMany(User, { through: UserAndlevel });

Line.belongsToMany(Dock, { through: LineDock });
Dock.belongsToMany(Line, { through: LineDock });

export { UserAndlevel, User, Userlevel, Dock, Line, LineDock };
