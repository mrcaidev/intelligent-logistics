import { Cursor } from "src/cursor";
import { TokenType, type Token } from "src/lexer";
import { ParserError } from "./error";
import type { Assignment, Condition, Definition } from "./types";

/**
 * Cursor used by parser.
 */
export class ParserCursor extends Cursor<Token> {
  /**
   * Check if the current token has a specific type.
   * @param expectation Expected token type.
   * @returns `true` if types matched, or `false` otherwise.
   */
  public hasType(expectation: TokenType) {
    return this.isOpen() && this.current.type === expectation;
  }

  /**
   * Check if the current token has a specific value.
   * @param expectation Expected token value.
   * @returns `true` if values matched, or `false` otherwise.
   */
  public hasValue(expectation: unknown) {
    return this.isOpen() && this.current.value === expectation;
  }

  /**
   * Consume a token.
   * @returns Consumed token.
   * @throws When the cursor is closed.
   */
  public override consume() {
    if (this.isClosed()) {
      throw new ParserError("Unexpected end of statement");
    }

    return super.consume();
  }

  /**
   * Consume a token of a specific type.
   * @param expectation Expected token type.
   * @returns Token value.
   * @throws When the token type does not match the expectation.
   */
  public consumeByType(expectation: TokenType) {
    const { type, value } = this.consume();

    if (type !== expectation) {
      throw new ParserError(`Expect ${expectation} at '${value}'`);
    }

    return value;
  }

  /**
   * Consume a token of a specific value.
   * @param expectation Expected token value.
   * @returns Token type.
   * @throws When the token value does not match the expectation.
   */
  public consumeByValue(expectation: unknown) {
    const { type, value } = this.consume();

    if (value !== expectation) {
      throw new ParserError(`Expect '${expectation}' at '${value}'`);
    }

    return type;
  }

  /**
   * Consume a list of tokens separated by a comma,
   * each of which is of a specific type.
   * @param expectation Expected token type.
   * @returns A list of token values.
   * @throws When two eligible tokens are not separated by a comma.
   * @throws When no eligible tokens are found.
   */
  public consumeManyByType(expectation: TokenType) {
    const values: unknown[] = [];

    while (this.hasType(expectation)) {
      values.push(this.consume().value);

      if (this.hasValue(",")) {
        this.consume();
        continue;
      }

      if (this.hasType(expectation)) {
        throw new ParserError(`Expect ',' before ${this.current.value}`);
      }
    }

    if (values.length === 0) {
      throw new ParserError(`Expect ${expectation}`);
    }

    return values;
  }

  /**
   * Consume a condition expression.
   * @returns A condition.
   */
  public consumeCondition() {
    const field = this.consumeByType(TokenType.IDENTIFIER);
    const operator = this.consumeByType(TokenType.OPERATOR);
    const value = this.consumeByType(TokenType.LITERAL);

    return { field, operator, value } as Condition;
  }

  /**
   * Consume a list of conditions, separated by `AND` or `OR` tokens.
   *
   * Note: Conditions connected by `AND` is grouped together first,
   * and then grouped together as a 2-D group by `OR`.
   * @returns A group of condition groups.
   * @example `a = 1 AND b = 2 OR c = 3` => `[[a = 1, b = 2], [c = 3]]`
   * @throws When no eligible conditions are found.
   */
  public consumeManyConditions() {
    const conditionGroups: Condition[][] = [];
    let currentGroup: Condition[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
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
      throw new ParserError("Expect conditions");
    }

    return conditionGroups;
  }

  /**
   * Consume an assignment.
   * @returns An assignment.
   */
  public consumeAssignment() {
    const field = this.consumeByType(TokenType.IDENTIFIER);
    this.consumeByValue("=");
    const value = this.consumeByType(TokenType.LITERAL);

    return { field, value } as Assignment;
  }

  /**
   * Consume a list of assignments, separated by a comma.
   * @returns A list of assignments.
   * @throws When two eligible assignments are not separated by a comma.
   * @throws When no eligible assignments are found.
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
        throw new ParserError(`Expect ',' before ${this.current.value}`);
      }
    }

    if (assignments.length === 0) {
      throw new ParserError("Expect assignments");
    }

    return assignments;
  }

  /**
   * Consume a definition.
   * @returns A definition.
   */
  public consumeDefinition() {
    const field = this.consumeByType(TokenType.IDENTIFIER);
    const type = this.consumeByType(TokenType.DATA_TYPE);

    return { field, type } as Definition;
  }

  /**
   * Consume a list of definitions, separated by a comma.
   * @returns A list of definitions.
   */
  public consumeManyDefinitions() {
    const definitions: Definition[] = [];

    while (this.hasType(TokenType.IDENTIFIER)) {
      const definition = this.consumeDefinition();
      definitions.push(definition);

      if (this.hasValue(",")) {
        this.consumeByValue(",");
        continue;
      }

      if (this.hasType(TokenType.IDENTIFIER)) {
        throw new ParserError(`Expect ',' before ${this.current.value}`);
      }
    }

    if (definitions.length === 0) {
      throw new ParserError("Expect definitions");
    }

    return definitions;
  }
}
