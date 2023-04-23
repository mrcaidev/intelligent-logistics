import { Manager } from "database-manager";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { Database, Row } from "shared-types";
import { parse } from "sql-parser";

const fileName = import.meta.env.TEST
  ? "database.test.json"
  : import.meta.env.DEV
  ? "database.dev.json"
  : "database.json";

class NodeManager extends Manager {
  constructor() {
    super(fileName);
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

/**
 * Queries database with SQL statements, and returns the retrieved rows.
 *
 * @param sql The SQL string to execute.
 * It can contain multiple statements.
 * Use `$1`, `$2`, ... to pass parameters.
 * @param parameters The parameters to pass to the SQL statement,
 * replacing `$1`, `$2`, ... in the SQL string one by one.
 */
export async function query<T extends Row>(
  sql: string,
  parameters: unknown[] = []
) {
  const parameterizedSql = sql.replaceAll(/\$(\d+)/g, (raw, index) => {
    if (parameters.length >= +index) {
      return JSON.stringify(parameters[+index - 1]);
    }
    return raw;
  });

  const asts = parse(parameterizedSql);

  let result: T[] = [];
  for (const ast of asts) {
    result = await manager.run<T>(ast);
  }

  return result;
}
