import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Group, User} from '../models/typeORMModels';
dotenv.config();

const username = process.env.DB_USERNAME || '';
const DBname = process.env.NAME || '';
const DBpassword = process.env.DB_PASSWORD || '';
const DBhost = process.env.DB_HOST;

const AppDataSource = new DataSource({
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
  migrations: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit();
  });

export default AppDataSource;