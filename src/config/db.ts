import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME ?? 'real_estate',
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? '',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    // sequelize pluralizes/underscores by default; this keeps createdAt/updatedAt camelCase to match the rest of the codebase
    underscored: false,
  },
});

export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log(`MySQL connected: ${process.env.DB_HOST ?? 'localhost'}/${process.env.DB_NAME ?? 'real_estate'}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    console.error(`Error connecting to MySQL: ${message}`);
    process.exit(1);
  }
}
