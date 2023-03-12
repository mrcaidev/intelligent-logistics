import type {
  AST,
  CreateAST,
  DeleteAST,
  InsertAST,
  SelectAST,
  UpdateAST,
} from "src/parser";
import type { ORM } from "./types";
import { Validator } from "./validator";

/**
 * Runs SQL statements according to AST.
 */
export class Runner {
  /**
   * Store the ORM as its file accessing strategy.
   */
  constructor(private orm: ORM) {}

  /**
   * Validate and run a SQL statement.
   * @param ast The abstract syntax tree of the SQL statement.
   * @returns The result of the SQL statement.
   */
  public run(ast: AST) {
    switch (ast.type) {
      case "select":
        return this.validateAndSelect(ast);
      case "insert":
        return this.validateAndInsert(ast);
      case "update":
        return this.validateAndUpdate(ast);
      case "delete":
        return this.validateAndDelete(ast);
      case "create":
        return this.validateAndCreate(ast);
    }
  }

  /**
   * Validate and run a SELECT statement.
   * @param ast AST of the SELECT statement.
   * @returns The result of the SELECT statement.
   */
  private validateAndSelect(ast: SelectAST) {
    const { table, fields, conditions } = ast;

    const schema = this.orm.getSchema(table);
    const validator = new Validator(schema);
    validator.validateFields(fields);
    validator.validateConditions(conditions);

    return this.orm.select(ast);
  }

  /**
   * Validate and run an INSERT statement.
   * @param ast AST of the INSERT statement.
   * @returns The result of the INSERT statement.
   */
  private validateAndInsert(ast: InsertAST) {
    const { table, fields, values } = ast;

    const schema = this.orm.getSchema(table);
    const validator = new Validator(schema);
    validator.validateFields(fields);
    if (fields === "*") {
      validator.validateWildcardValues(values);
    } else {
      validator.validateColumnValues(fields, values);
    }

    return this.orm.insert(ast);
  }

  /**
   * Validate and run an UPDATE statement.
   * @param ast AST of the UPDATE statement.
   * @returns The result of the UPDATE statement.
   */
  private validateAndUpdate(ast: UpdateAST) {
    const { table, assignments, conditions } = ast;

    const schema = this.orm.getSchema(table);
    const validator = new Validator(schema);
    validator.validateAssignments(assignments);
    validator.validateConditions(conditions);

    return this.orm.update(ast);
  }

  /**
   * Validate and run a DELETE statement.
   * @param ast AST of the DELETE statement.
   * @returns The result of the DELETE statement.
   */
  private validateAndDelete(ast: DeleteAST) {
    const { table, conditions } = ast;

    const schema = this.orm.getSchema(table);
    const validator = new Validator(schema);
    validator.validateConditions(conditions);

    return this.orm.delete(ast);
  }

  /**
   * Validate and run a CREATE statement.
   * @param ast AST of the CREATE statement.
   * @returns The result of the CREATE statement.
   */
  private validateAndCreate(ast: CreateAST) {
    const { definitions } = ast;

    Validator.validateDefinitions(definitions);

    return this.orm.create(ast);
  }
}
