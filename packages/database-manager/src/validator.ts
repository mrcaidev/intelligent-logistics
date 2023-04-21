import {
  Assignment,
  AST,
  Condition,
  CreateAST,
  Definition,
  DeleteAST,
  InsertAST,
  Schema,
  SelectAST,
  UpdateAST,
} from "common";
import { DatabaseManagerError } from "./error";

/**
 * Validates an AST against its target table.
 */
export class Validator {
  constructor(private schema: Schema) {}

  /**
   * Validates an AST.
   */
  public validate(ast: AST) {
    switch (ast.type) {
      case "select":
        return this.validateSelect(ast);
      case "insert":
        return this.validateInsert(ast);
      case "update":
        return this.validateUpdate(ast);
      case "delete":
        return this.validateDelete(ast);
      case "create":
        return this.validateCreate(ast);
    }
  }

  /**
   * Validates the AST of a SELECT statement.
   */
  private validateSelect(ast: SelectAST) {
    const { fields, conditions } = ast;

    this.validateFields(fields);
    this.validateConditions(conditions);
  }

  /**
   * Validates the AST of an INSERT statement.
   */
  private validateInsert(ast: InsertAST) {
    const { fields, values } = ast;

    if (fields === "*") {
      for (const value of values) {
        this.validateOrderedValues(value);
      }
      return;
    }

    for (const value of values) {
      this.validateNamedValues(fields, value);
    }
  }

  /**
   * Validates the AST of an UPDATE statement.
   */
  private validateUpdate(ast: UpdateAST) {
    const { assignments, conditions } = ast;

    this.validateAssignments(assignments);
    this.validateConditions(conditions);
  }

  /**
   * Validates the AST of a DELETE statement.
   */
  private validateDelete(ast: DeleteAST) {
    const { conditions } = ast;

    this.validateConditions(conditions);
  }

  /**
   * Validates the AST of a CREATE statement.
   */
  private validateCreate(ast: CreateAST) {
    const { definitions } = ast;

    this.validateDefinitions(definitions);
  }

  /**
   * Validates the fields.
   */
  private validateFields(fields: "*" | string[]) {
    if (fields === "*") {
      return;
    }

    for (const field of fields) {
      if (this.schema.some((column) => column.field === field)) {
        continue;
      }

      throw new DatabaseManagerError(`Column ${field} does not exist`);
    }
  }

  /**
   * Validates the values by their order.
   */
  private validateOrderedValues(values: unknown[]) {
    if (values.length !== this.schema.length) {
      throw new DatabaseManagerError(
        `Cannot insert ${values.length} values into ${this.schema.length} fields`
      );
    }

    for (const [index, value] of values.entries()) {
      const { field, type } = this.schema[index]!;

      if (Validator.hasType(value, type)) {
        continue;
      }

      throw new DatabaseManagerError(`Column ${field} expects ${type}`);
    }
  }

  /**
   * Validates the fields and the values.
   */
  private validateNamedValues(fields: string[], values: unknown[]) {
    if (values.length !== fields.length) {
      throw new DatabaseManagerError(
        `Cannot insert ${values.length} values into ${fields.length} fields`
      );
    }

    for (const [index, field] of fields.entries()) {
      this.validateFieldAndValue(field, values[index]);
    }
  }

  /**
   * Validates the field and the value of every assignment.
   */
  private validateAssignments(assignments: Assignment[]) {
    for (const { field, value } of assignments) {
      this.validateFieldAndValue(field, value);
    }
  }

  /**
   * Validates the field and the value of every condition.
   */
  private validateConditions(conditions: Condition[][]) {
    for (const { field, value } of conditions.flat()) {
      this.validateFieldAndValue(field, value);
    }
  }

  /**
   * Validates the field and the type of every definition.
   */
  private validateDefinitions(definitions: Definition[]) {
    const fields = new Set<string>();

    for (const { field } of definitions) {
      if (fields.has(field)) {
        throw new DatabaseManagerError(`Duplicate column name ${field}`);
      }

      fields.add(field);
    }
  }

  /**
   * Validates that the field exists, and the value is of the field's type.
   */
  private validateFieldAndValue(field: string, value: unknown) {
    const column = this.schema.find((column) => column.field === field);

    if (!column) {
      throw new DatabaseManagerError(`Column ${field} does not exist`);
    }

    if (Validator.hasType(value, column.type)) {
      return;
    }

    throw new DatabaseManagerError(`Column ${field} expects ${column.type}`);
  }

  /**
   * Returns true if a value is of a given data type,
   * or false otherwise.
   */
  private static hasType(value: unknown, type: string) {
    const correspondence: Record<string, string> = {
      NUMERIC: "number",
      TEXT: "string",
      BOOLEAN: "boolean",
    };

    return typeof value === correspondence[type];
  }
}
