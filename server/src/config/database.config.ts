import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST || 'localhost',
  synchronize: process.env.DATABASE_SYNCHRONIZE || true,
  autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES || true,
}));
