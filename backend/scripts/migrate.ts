import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  logging: false,
});

async function runMigrations() {
  const migrationsDir = path.resolve(__dirname, '../src/database/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  for (const file of files) {
    const migration = await import(path.join(migrationsDir, file));
    if (migration.up) {
      console.log(`Running migration: ${file}`);
      await migration.up(sequelize.getQueryInterface());
    }
  }
  await sequelize.close();
  console.log('All migrations executed.');
}

runMigrations().catch(e => {
  console.error(e);
  process.exit(1);
}); 