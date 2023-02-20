import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { DBInitializationError } from '../customErrors';
import { logger } from '../logger/winstonLogger';
import { myMigration1673944710450 } from '../migrations/1673944710450-my-migration';
import { Group, User} from '../models/typeORMModels';
dotenv.config();

const username = process.env.DB_USERNAME || '';
const DBname = process.env.NAME || '';
const DBpassword = process.env.DB_PASSWORD || '';
const DBhost = process.env.DB_HOST;

const dataSource = new DataSource({
  type: 'postgres',
  host: DBhost,
  port: 5432,
  username,
  password: DBpassword,
  database: DBname,
  synchronize: true,
  logging: true,
  entities: [User, Group],
  subscribers: [],
  migrations: [myMigration1673944710450],
});

dataSource.initialize()
  .then(() => {
    logger.info('Data base initialized');
  })
  .catch(() => {
    throw new DBInitializationError('initialize faled');
  });

// npm run typeorm -- migration:generate ./src/migrations/my-migration
// npm run typeorm -- migration:run

export default dataSource;