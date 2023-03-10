import { TokenType, type Token } from "src/lexer";
import { ParserCursor } from "./cursor";
import { ParserError } from "./error";
import type { AST } from "./types";

/**
 * Parses a list of tokens into an AST.
 */
export class Parser {
  /**
   * Cursor that iterates over every token.
   */
  private cursor: ParserCursor;

  /**
   * Point the cursor to the first token.
   * @param tokens Tokens to parse.
   */
  constructor(tokens: Token[]) {
    this.cursor = new ParserCursor(tokens);
  }

  /**
   * Parse tokens into an AST.
   * @returns AST of the statement.
   */
  public parse(): AST {
    if (!this.cursor.hasType(TokenType.KEYWORD)) {
      throw new ParserError("Expect keyword at the beginning");
    }

    const { value: keyword } = this.cursor.consume();

    switch (keyword) {
      case "SELECT":
        return this.parseSelect();
      case "INSERT":
        return this.parseInsert();
      case "UPDATE":
        return this.parseUpdate();
      case "DELETE":
        return this.parseDelete();
      case "CREATE":
        return this.parseCreate();
      default:
        throw new ParserError(`Unknown keyword: ${keyword}`);
    }
  }

  /**
   * Parse SELECT statement.
   * @returns AST of the statement.
   */
  private parseSelect() {
    const fields = this.parseSelectFields();
    this.cursor.consumeByValue("FROM");
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    const conditions = this.parseConditions();

    return { type: "select", table, fields, conditions } as AST;
  }

  /**
   * Parse INSERT statement.
   * @returns AST of the statement.
   */
  private parseInsert() {
    this.cursor.consumeByValue("INTO");
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    const fields = this.parseInsertFields();
    this.cursor.consumeByValue("VALUES");
    this.cursor.consumeByValue("(");
    const values = this.cursor.consumeManyByType(TokenType.LITERAL);
    this.cursor.consumeByValue(")");

    const assignments = this.composeFieldAndValueAsAssignment(fields, values);

    return { type: "insert", table, assignments } as AST;
  }

  /**
   * Parse UPDATE statement.
   * @returns AST of the statement.
   */
  private parseUpdate() {
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    this.cursor.consumeByValue("SET");
    const assignments = this.cursor.consumeManyAssignments();
    const conditions = this.parseConditions();

    return { type: "update", table, assignments, conditions } as AST;
  }

  /**
   * Parse DELETE statement.
   * @returns AST of the statement.
   */
  private parseDelete() {
    this.cursor.consumeByValue("FROM");
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    const conditions = this.parseConditions();

    return { type: "delete", table, conditions } as AST;
  }

  /**
   * Parse CREATE statement.
   * @returns AST of the statement.
   */
  private parseCreate() {
    this.cursor.consumeByValue("TABLE");
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    this.cursor.consumeByValue("(");
    const definitions = this.cursor.consumeManyDefinitions();
    this.cursor.consumeByValue(")");

    return { type: "create", table, definitions } as AST;
  }

  /**
   * Parse fields of SELECT statement.
   * Either a list of identifiers, or "*" which stands for all fields.
   * @returns Fields of the statement.
   */
  private parseSelectFields() {
    if (!this.cursor.hasValue("*")) {
      return this.cursor.consumeManyByType(TokenType.IDENTIFIER);
    }

    this.cursor.consume();

    return "*";
  }

  /**
   * Parse conditions if WHERE keyword is present.
   * @returns Conditions of the statement.
   */
  private parseConditions() {
    if (!this.cursor.hasValue("WHERE")) {
      return [];
    }

    this.cursor.consume();

    return this.cursor.consumeManyConditions();
  }

  /**
   * Parse fields of INSERT statement.
   * Either a list of identifiers, or "*" which stands for all fields.
   * @returns Fields of the statement.
   */
  private parseInsertFields() {
    if (!this.cursor.hasValue("(")) {
      return "*";
    }

    this.cursor.consume();

    const fields = this.cursor.consumeManyByType(
      TokenType.IDENTIFIER
    ) as string[];

    this.cursor.consumeByValue(")");

    return fields;
  }

  /**
   * Compose field and value into an assignment.
   * If fields is "*", then the fields in every assignment will be "*".
   * @param fields Fields of the statement.
   * @param values Values of the statement.
   * @returns Assignments of the statement.
   * @throws When fields and values does not have the same length.
   */
  private composeFieldAndValueAsAssignment(
    fields: "*" | string[],
    values: unknown[]
  ) {
    if (fields === "*") {
      return values.map((value) => ({ field: "*", value }));
    }

    if (fields.length !== values.length) {
      throw new ParserError(
        `Cannot insert ${values.length} values into ${fields.length} fields`
      );
    }

    return fields.map((field, index) => ({ field, value: values[index] }));
  }
}
