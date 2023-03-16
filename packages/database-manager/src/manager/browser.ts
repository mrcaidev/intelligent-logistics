import type { Database } from "common";
import { Manager } from "./manager";

/**
 * A database manager that runs in the browser,
 * which uses the local storage as the database.
 */
export class BrowserManager extends Manager {
  /**
   * Read an database from the local storage.
   */
  public async readDatabase(): Promise<Database> {
    try {
      const text = localStorage.getItem(this.databaseName);
      return text ? JSON.parse(text) : {};
    } catch {
      console.error("Access denied to local storage");
      return {};
    }
  }

  /**
   * Write an database to the local storage.
   */
  public async writeDatabase(database: Database): Promise<void> {
    try {
      localStorage.setItem(this.databaseName, JSON.stringify(database));
    } catch {
      console.error("Access denied to local storage");
    }
  }
}
