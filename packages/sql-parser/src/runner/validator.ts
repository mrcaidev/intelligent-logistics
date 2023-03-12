import type { Assignment, Condition, Definition } from "src/parser";
import { RunnerError } from "./error";
import type { Schema } from "./types";

/**
 * Validate the semantics of a SQL statement against a schema.
 */
export class Validator {
  /**
   * Store the schema.
   */
  constructor(private schema: Schema) {}

  /**
   * Validate a field-value pair.
   * @param field Field.
   * @param value Value.
   */
  public validateFieldAndValue(field: string, value: unknown) {
    const column = this.schema.find((column) => column.field === field);

    if (!column) {
      throw new RunnerError(`Column ${field} does not exist`);
    }

    if (Validator.hasType(value, column.type)) {
      return;
    }

    throw new RunnerError(
      `Column ${field} expects ${column.type}, but got ${value}`
    );
  }

  /**
   * Validate the existence of a field.
   * @param fields Field.
   */
  public validateFields(fields: "*" | string[]) {
    if (fields === "*") {
      return;
    }

    for (const field of fields) {
      if (this.schema.some((column) => column.field === field)) {
        continue;
      }

      throw new RunnerError(`Column ${field} does not exist`);
    }
  }

  /**
   * Validate a list of values with the natural order of fields.
   * @param values Values.
   */
  public validateWildcardValues(values: unknown[]) {
    if (values.length !== this.schema.length) {
      throw new RunnerError(
        `Cannot insert ${values.length} values into ${this.schema.length} fields`
      );
    }

    for (const [index, value] of values.entries()) {
      const { field, type } = this.schema[index]!;

      if (Validator.hasType(value, type)) {
        return;
      }

      throw new RunnerError(
        `Column ${field} expects ${type}, but got ${value}`
      );
    }
  }

  /**
   * Validate a list of values with their corresponding fields.
   * @param fields Fields.
   * @param values Values.
   */
  public validateColumnValues(fields: string[], values: unknown[]) {
    if (fields.length !== values.length) {
      throw new RunnerError(
        `Cannot insert ${values.length} values into ${fields.length} fields`
      );
    }

    for (const [index, field] of fields.entries()) {
      this.validateFieldAndValue(field, values[index]);
    }
  }

  /**
   * Validate a list of assignments.
   * @param assignments Assignments.
   */
  public validateAssignments(assignments: Assignment[]) {
    for (const { field, value } of assignments) {
      this.validateFieldAndValue(field, value);
    }
  }

  /**
   * Validate a list of conditions.
   * @param conditions Conditions.
   */
  public validateConditions(conditions: Condition[][]) {
    for (const { field, value } of conditions.flat()) {
      this.validateFieldAndValue(field, value);
    }
  }

  /**
   * Validate a list of definitions.
   * @param definitions Definitions.
   */
  public static validateDefinitions(definitions: Definition[]) {
    const fields = new Set<string>();

    for (const { field } of definitions) {
      if (fields.has(field)) {
        throw new RunnerError(`Duplicate column name ${field}`);
      }

      fields.add(field);
    }
  }

  /**
   * Check if a value is of a given data type.
   * @param value Value.
   * @param type Data type.
   * @returns `true` if matched, `false` otherwise.
   */
  public static hasType(value: unknown, type: string) {
    const correspondence: Record<string, string> = {
      NUMERIC: "number",
      TEXT: "string",
      BOOLEAN: "boolean",
    };

    return typeof value === correspondence[type];
  }
}
