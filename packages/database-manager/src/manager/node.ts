import type { Database } from "common";
import { readFile, writeFile } from "fs/promises";
import { Manager } from "./manager";

/**
 * A concrete database manager, which reads and writes the database
 * using the `fs` module in Node.js.
 */
export class NodeManager extends Manager {
  /**
   * Reads the database from a local file.
   */
  protected async readDatabase() {
    const text = await readFile(this.databaseName, "utf-8");
    return JSON.parse(text) as Database;
  }

  /**
   * Writes the database to a local file.
   */
  protected async writeDatabase(database: Database) {
    const text = JSON.stringify(database);
    await writeFile(this.databaseName, text);
  }
}
