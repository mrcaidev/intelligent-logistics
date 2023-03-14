import type { Database } from "common";
import { DatabaseManagerError } from "src/error";
import { Manager } from "./manager";

/**
 * A concrete database manager, which reads and writes the database
 * using the `localStorage` API of browser.
 */
export class BrowserManager extends Manager {
  /**
   * Reads the database from the local storage.
   */
  protected async readDatabase() {
    try {
      const text = localStorage.getItem(this.databaseName);
      return text === null ? {} : (JSON.parse(text) as Database);
    } catch {
      throw new DatabaseManagerError("Access denied to local storage");
    }
  }

  /**
   * Writes the database to the local storage.
   */
  protected async writeDatabase(database: Database) {
    try {
      localStorage.setItem(this.databaseName, JSON.stringify(database));
    } catch {
      throw new DatabaseManagerError("Access denied to local storage");
    }
  }
}
