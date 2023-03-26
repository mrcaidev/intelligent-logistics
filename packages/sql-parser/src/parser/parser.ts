import type { AST } from "common";
import { SqlParserError } from "src/error";
import { TokenType, type Token } from "src/lexer";
import { TokenCursor } from "./cursor";

/**
 * Parses a list of tokens into an AST.
 */
export class Parser {
  /**
   * The cursor that iterates over every token.
   */
  private cursor: TokenCursor;

  constructor(tokens: Token[]) {
    this.cursor = new TokenCursor(tokens);
  }

  /**
   * Parses the tokens into an AST.
   */
  public parse(): AST {
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
      case "DROP":
        return this.parseDrop();
      default:
        throw new SqlParserError(`Invalid keyword: ${keyword}`);
    }
  }

  /**
   * Parses a SELECT statement.
   */
  private parseSelect() {
    const fields = this.parseSelectFields();
    this.cursor.consumeByValue("FROM");
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    const conditions = this.parseConditions();

    return { type: "select", table, fields, conditions } as AST;
  }

  /**
   * Parses an INSERT statement.
   */
  private parseInsert() {
    this.cursor.consumeByValue("INTO");
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    const fields = this.parseInsertFields();
    this.cursor.consumeByValue("VALUES");
    this.cursor.consumeByValue("(");
    const values = this.cursor.consumeManyByType(TokenType.LITERAL);
    this.cursor.consumeByValue(")");

    return { type: "insert", table, fields, values } as AST;
  }

  /**
   * Parses an UPDATE statement.
   */
  private parseUpdate() {
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    this.cursor.consumeByValue("SET");
    const assignments = this.cursor.consumeManyAssignments();
    const conditions = this.parseConditions();

    return { type: "update", table, assignments, conditions } as AST;
  }

  /**
   * Parses a DELETE statement.
   */
  private parseDelete() {
    this.cursor.consumeByValue("FROM");
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    const conditions = this.parseConditions();

    return { type: "delete", table, conditions } as AST;
  }

  /**
   * Parses a CREATE statement.
   */
  private parseCreate() {
    this.cursor.consumeByValue("TABLE");
    const ifNotExists = this.parseIfNotExists();
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);
    this.cursor.consumeByValue("(");
    const definitions = this.cursor.consumeManyDefinitions();
    this.cursor.consumeByValue(")");

    return { type: "create", table, ifNotExists, definitions } as AST;
  }

  /**
   * Parses a DROP statement.
   */
  private parseDrop() {
    this.cursor.consumeByValue("TABLE");
    const ifExists = this.parseIfExists();
    const table = this.cursor.consumeByType(TokenType.IDENTIFIER);

    return { type: "drop", table, ifExists } as AST;
  }

  /**
   * Parses the fields of a SELECT statement.
   * Returns either a list of identifiers,
   * or "*" which stands for all fields.
   */
  private parseSelectFields() {
    if (!this.cursor.hasValue("*")) {
      return this.cursor.consumeManyByType(TokenType.IDENTIFIER);
    }

    this.cursor.consume();

    return "*";
  }

  /**
   * Parses the conditions if a WHERE keyword is present.
   */
  private parseConditions() {
    if (!this.cursor.hasValue("WHERE")) {
      return [];
    }

    this.cursor.consume();

    return this.cursor.consumeManyConditions();
  }

  /**
   * Parses the fields of an INSERT statement.
   * Returns either a list of identifiers,
   * or "*" which stands for all fields.
   */
  private parseInsertFields() {
    if (!this.cursor.hasValue("(")) {
      return "*";
    }

    this.cursor.consume();
    const fields = this.cursor.consumeManyByType(TokenType.IDENTIFIER);
    this.cursor.consumeByValue(")");

    return fields;
  }

  /**
   * Parses the IF NOT EXISTS keyword.
   * Returns true if there is `IF NOT EXISTS` keyword,
   * or false otherwise.
   */
  private parseIfNotExists() {
    if (!this.cursor.hasValue("IF")) {
      return false;
    }

    this.cursor.consume();
    this.cursor.consumeByValue("NOT");
    this.cursor.consumeByValue("EXISTS");

    return true;
  }

  /**
   * Parses the IF EXISTS keyword.
   * Returns true if there is `IF EXISTS` keyword,
   * or false otherwise.
   */
  private parseIfExists() {
    if (!this.cursor.hasValue("IF")) {
      return false;
    }

    this.cursor.consume();
    this.cursor.consumeByValue("EXISTS");

    return true;
  }
}
