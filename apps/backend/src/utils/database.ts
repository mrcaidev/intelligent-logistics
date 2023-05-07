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

class FsManager extends Manager {
  protected async readDatabase() {
    if (!existsSync(fileName)) {
      return {} as Database;
    }

    const text = await readFile(fileName, "utf-8");
    return JSON.parse(text) as Database;
  }

  protected async writeDatabase(database: Database) {
    await writeFile(fileName, JSON.stringify(database), "utf-8");
  }
}

const manager = new FsManager();

/**
 * Queries database with parameterized SQL statements,
 * and returns the retrieved rows.
 *
 * @param sql The SQL string to execute.
 * It can contain multiple statements.
 * Use `$1`, `$2`, ... to pass parameters.
 * @param parameters The parameters passed to the SQL statement,
 * replacing `$1`, `$2`, ... in the SQL string one by one.
 */
export async function query<T extends Row>(
  sql: string,
  parameters: unknown[] = []
) {
  const parameterizedSql = sql.replaceAll(/\$(\d+)/g, (raw, index) => {
    if (+index > parameters.length) {
      return raw;
    }
    return JSON.stringify(parameters[+index - 1]);
  });

  const asts = parse(parameterizedSql);

  let result: T[] = [];
  for (const ast of asts) {
    result = await manager.run<T>(ast);
  }

  return result;
}
