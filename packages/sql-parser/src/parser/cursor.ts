import type { Assignment, Condition, Definition } from "common";
import { Cursor } from "src/cursor";
import { TokenType, type Token } from "src/lexer";
import { SqlParserError } from "../error";

/**
 * Iterates over every token.
 */
export class TokenCursor extends Cursor<Token> {
  /**
   * Returns true if the current token is of the given type,
   * or false otherwise.
   */
  public hasType(expectation: TokenType) {
    return this.isOpen() && this.current.type === expectation;
  }

  /**
   * Returns true if the current token is of the given value,
   * or false otherwise.
   */
  public hasValue(expectation: unknown) {
    return this.isOpen() && this.current.value === expectation;
  }

  /**
   * Consumes a token.
   */
  public override consume() {
    if (this.isOpen()) {
      return super.consume();
    }

    throw new SqlParserError("Unexpected end of statement");
  }

  /**
   * Consumes a token of a specific type.
   */
  public consumeByType(expectation: TokenType) {
    const { type, value } = this.consume();

    if (type === expectation) {
      return value;
    }

    throw new SqlParserError(`Expect ${expectation} at ${value}`);
  }

  /**
   * Consumes a token of a specific value.
   */
  public consumeByValue(expectation: unknown) {
    const { type, value } = this.consume();

    if (value === expectation) {
      return type;
    }

    throw new SqlParserError(`Expect ${expectation} at ${value}`);
  }

  /**
   * Consumes a list of tokens separated by commas,
   * each of which is of a specific type.
   */
  public consumeManyByType(expectation: TokenType) {
    const values: unknown[] = [];

    while (this.hasType(expectation)) {
      const value = this.consume().value;
      values.push(value);

      if (this.hasValue(",")) {
        this.consume();
        continue;
      }

      if (this.hasType(expectation)) {
        throw new SqlParserError(`Expect comma before ${this.current.value}`);
      }
    }

    if (values.length === 0) {
      throw new SqlParserError(`Expect ${expectation}`);
    }

    return values;
  }

  /**
   * Consumes a condition.
   */
  public consumeCondition() {
    const field = this.consumeByType(TokenType.IDENTIFIER);
    const operator = this.consumeByType(TokenType.OPERATOR);
    const value = this.consumeByType(TokenType.LITERAL);

    return { field, operator, value } as Condition;
  }

  /**
   * Consumes a list of conditions, separated by `AND` or `OR`.
   *
   * Note: Conditions connected by `AND` are respectively grouped first,
   * and then grouped again as a whole by `OR`,
   * which forms a nested condition object.
   */
  public consumeManyConditions() {
    const conditionGroups: Condition[][] = [];
    let currentGroup: Condition[] = [];

    while (this.hasType(TokenType.IDENTIFIER)) {
      const condition = this.consumeCondition();
      currentGroup.push(condition);

      if (this.hasValue("AND")) {
        this.consume();
        continue;
      }

      if (this.hasValue("OR")) {
        this.consume();
        conditionGroups.push(currentGroup);
        currentGroup = [];
        continue;
      }

      conditionGroups.push(currentGroup);
      break;
    }

    if (conditionGroups.length === 0) {
      throw new SqlParserError("Expect conditions");
    }

    return conditionGroups;
  }

  /**
   * Consumes an assignment.
   */
  public consumeAssignment() {
    const field = this.consumeByType(TokenType.IDENTIFIER);
    this.consumeByValue("=");
    const value = this.consumeByType(TokenType.LITERAL);

    return { field, value } as Assignment;
  }

  /**
   * Consumes a list of assignments, separated by commas.
   */
  public consumeManyAssignments() {
    const assignments: Assignment[] = [];

    while (this.hasType(TokenType.IDENTIFIER)) {
      const assignment = this.consumeAssignment();
      assignments.push(assignment);

      if (this.hasValue(",")) {
        this.consume();
        continue;
      }

      if (this.hasType(TokenType.IDENTIFIER)) {
        throw new SqlParserError(`Expect comma before ${this.current.value}`);
      }
    }

    if (assignments.length === 0) {
      throw new SqlParserError("Expect assignments");
    }

    return assignments;
  }

  /**
   * Consumes a definition.
   */
  public consumeDefinition() {
    const field = this.consumeByType(TokenType.IDENTIFIER);
    const type = this.consumeByType(TokenType.DATA_TYPE);

    return { field, type } as Definition;
  }

  /**
   * Consumes a list of definitions, separated by commas.
   */
  public consumeManyDefinitions() {
    const definitions: Definition[] = [];

    while (this.hasType(TokenType.IDENTIFIER)) {
      const definition = this.consumeDefinition();
      definitions.push(definition);

      if (this.hasValue(",")) {
        this.consume();
        continue;
      }

      if (this.hasType(TokenType.IDENTIFIER)) {
        throw new SqlParserError(`Expect comma before ${this.current.value}`);
      }
    }

    if (definitions.length === 0) {
      throw new SqlParserError("Expect definitions");
    }

    return definitions;
  }
}
