import "reflect-metadata";
import { AppDataSource } from "../config/database.js";

async function main() {
  await AppDataSource.initialize();
  try {
    const result = await AppDataSource.runMigrations();
    console.log(`Ran ${result.length} migration(s).`);
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});