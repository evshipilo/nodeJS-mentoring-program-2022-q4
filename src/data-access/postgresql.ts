import { Sequelize, DataTypes } from 'sequelize';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const username = process.env.DB_USERNAME || '';
const DBname = process.env.NAME || '';
const DBpassword = process.env.DB_PASSWORD || '';
const DBhost = process.env.DB_HOST;

const sequelize = new Sequelize(DBname, username, DBpassword, {
  host: DBhost,
  dialect: 'postgres',
});

export async function connection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_deleted: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);
