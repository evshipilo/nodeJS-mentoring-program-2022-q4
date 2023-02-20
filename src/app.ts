import createApplication from "./createApp";
import GroupService from "./services/groupService";
import UserService from "./services/userService";

createApplication(new UserService(), new GroupService());