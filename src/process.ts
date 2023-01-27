import { log } from "./middlewares/winstonLogger";

export const processListener = function(){
    process
    .on('unhandledRejection', (reason) => {
      log.error(reason);
    })
    .on('uncaughtException', err => {
      log.error(err);
    });
} 
