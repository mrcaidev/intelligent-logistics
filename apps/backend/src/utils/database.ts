import type { Database, Row } from "common";
import { Manager } from "database-manager";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { parse } from "sql-parser";

class NodeManager extends Manager {
  constructor() {
    super("database.json");
  }

  protected async readDatabase() {
    if (!existsSync(this.databaseName)) {
      return {} as Database;
    }

    const text = await readFile(this.databaseName, "utf-8");
    return JSON.parse(text) as Database;
  }

  protected async writeDatabase(database: Database) {
    await writeFile(this.databaseName, JSON.stringify(database), "utf-8");
  }
}

const manager = new NodeManager();

export async function query<T extends Row>(input: string) {
  const ast = parse(input)[0]!;
  return manager.run<T>(ast);
}
