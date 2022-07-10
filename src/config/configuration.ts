import * as dotenv from 'dotenv';

dotenv.config();

export default () => ({
  baseUrl: process.env.BASE_URL || 'http://localhost:3000/',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    db: process.env.PGDATABASE,
    port: parseInt(process.env.PGPORT, 10) || 5432,
  },
  maxCountOfTriesCreate: 100,
});
