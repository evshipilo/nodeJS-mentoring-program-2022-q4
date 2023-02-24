import createApplication from './createApp';
import { logger } from './logger/winstonLogger';
import { processListener } from './process';
import GroupService from './services/groupService';
import UserService from './services/userService';

const application = createApplication(new UserService(), new GroupService());

application.listen(process.env.PORT, () => {
  logger.info(`App listening at http://localhost:${process.env.PORT}`);
});

//handle unhandled errors
processListener();
