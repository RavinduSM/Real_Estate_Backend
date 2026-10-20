// using this to sync the tables in the production db mmanually
import { sequelize } from '../models';

async function main() {
  await sequelize.authenticate();
  await sequelize.sync(); // create missing tables only
  console.log('Tables created');
  await sequelize.close();
}
void main();