import type {
  Assignment,
  Condition,
  CreateAST,
  Definition,
  DeleteAST,
  InsertAST,
  Schema,
  SelectAST,
  UpdateAST,
} from "src/types";
import { DatabaseManagerError } from "./error";

/**
 * Validate an AST against its targeted table.
 */
export class Validator {
  /**
   * Store the schema of the table.
   * @param schema Schema of the table.
   */
  constructor(private schema: Schema) {}

  /**
   * Validate the AST of a SELECT statement.
   * @param ast AST of a SELECT statement.
   */
  public validateSelect(ast: SelectAST) {
    const { fields, conditions } = ast;

    this.validateFields(fields);
    this.validateConditions(conditions);
  }

  /**
   * Validate the AST of an INSERT statement.
   * @param ast AST of an INSERT statement.
   */
  public validateInsert(ast: InsertAST) {
    const { fields, values } = ast;

    if (fields === "*") {
      this.validateOrderedValues(values);
    } else {
      this.validateFieldsAndValues(fields, values);
    }
  }

  /**
   * Validate the AST of an UPDATE statement.
   * @param ast AST of an UPDATE statement.
   */
  public validateUpdate(ast: UpdateAST) {
    const { assignments, conditions } = ast;

    this.validateAssignments(assignments);
    this.validateConditions(conditions);
  }

  /**
   * Validate the AST of a DELETE statement.
   * @param ast AST of a DELETE statement.
   */
  public validateDelete(ast: DeleteAST) {
    const { conditions } = ast;

    this.validateConditions(conditions);
  }

  /**
   * Validate the AST of a CREATE statement.
   * @param ast AST of a CREATE statement.
   */
  public validateCreate(ast: CreateAST) {
    const { definitions } = ast;

    this.validateDefinitions(definitions);
  }

  /**
   * Validate the fields.
   * @param fields Fields.
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
   * Validate the values by their order.
   * @param values Values.
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
        return;
      }

      throw new DatabaseManagerError(`Column ${field} expects ${type}`);
    }
  }

  /**
   * Validate the fields and values.
   * @param fields Fields.
   * @param values Values.
   */
  private validateFieldsAndValues(fields: string[], values: unknown[]) {
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
   * Validate the field and value in every assignment.
   * @param assignments Assignments.
   */
  private validateAssignments(assignments: Assignment[]) {
    for (const { field, value } of assignments) {
      this.validateFieldAndValue(field, value);
    }
  }

  /**
   * Validate the field and value in every condition.
   * @param conditions Conditions.
   */
  private validateConditions(conditions: Condition[][]) {
    for (const { field, value } of conditions.flat()) {
      this.validateFieldAndValue(field, value);
    }
  }

  /**
   * Validate the fields and types in every definition.
   * @param definitions Definitions.
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
   * Validate that the field exists, and the value is of the field's type.
   * @param field Field.
   * @param value Value.
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
   * Check if a value is of a given data type.
   * @param value Value.
   * @param type Data type.
   * @returns `true` if matched, `false` otherwise.
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
