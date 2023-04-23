import { Cursor } from "cursor";
import { SqlParserError } from "error";
import {
  AST,
  Assignment,
  Condition,
  CreateAST,
  Definition,
  DeleteAST,
  DropAST,
  InsertAST,
  SelectAST,
  UpdateAST,
} from "shared-types";
import { Token, TokenType } from "token";

/**
 * Parses a list of tokens into an abstract syntax tree.
 */
export class Parser extends Cursor<Token> {
  constructor(tokens: Token[]) {
    super(tokens);
  }

  /**
   * Returns an abstract syntax tree parsed from the tokens.
   */
  public parse() {
    const ast = this.parseStatement();

    if (this.isOpen()) {
      throw new SqlParserError(`Invalid syntax: ${formatToken(this.current)}`);
    }

    return ast;
  }

  private parseStatement(): AST {
    if (this.match(TokenType.SELECT)) {
      return this.parseSelect();
    }

    if (this.match(TokenType.INSERT)) {
      return this.parseInsert();
    }

    if (this.match(TokenType.UPDATE)) {
      return this.parseUpdate();
    }

    if (this.match(TokenType.DELETE)) {
      return this.parseDelete();
    }

    if (this.match(TokenType.CREATE)) {
      return this.parseCreate();
    }

    if (this.match(TokenType.DROP)) {
      return this.parseDrop();
    }

    throw new SqlParserError(`Invalid syntax: ${formatToken(this.current)}`);
  }

  private parseSelect(): SelectAST {
    this.consumeToken(TokenType.SELECT);
    const fields = this.parseFields();
    this.consumeToken(TokenType.FROM);
    const table = this.parseIdentifier();
    const conditions = this.parseWhere();
    return { type: "select", fields, table, conditions };
  }

  private parseInsert(): InsertAST {
    this.consumeToken(TokenType.INSERT);
    this.consumeToken(TokenType.INTO);
    const table = this.parseIdentifier();
    const fields = this.parseInsertFields();
    this.consumeToken(TokenType.VALUES);
    const values = this.parseValues();
    const returning = this.parseReturning();
    return { type: "insert", table, fields, values, returning };
  }

  private parseUpdate(): UpdateAST {
    this.consumeToken(TokenType.UPDATE);
    const table = this.parseIdentifier();
    this.consumeToken(TokenType.SET);
    const assignments = this.parseAssignments();
    const conditions = this.parseWhere();
    const returning = this.parseReturning();
    return { type: "update", table, assignments, conditions, returning };
  }

  private parseDelete(): DeleteAST {
    this.consumeToken(TokenType.DELETE);
    this.consumeToken(TokenType.FROM);
    const table = this.parseIdentifier();
    const conditions = this.parseWhere();
    const returning = this.parseReturning();
    return { type: "delete", table, conditions, returning };
  }

  private parseCreate(): CreateAST {
    this.consumeToken(TokenType.CREATE);
    this.consumeToken(TokenType.TABLE);
    const ifNotExists = this.parseIfNotExists();
    const table = this.parseIdentifier();
    this.consumeToken(TokenType.LEFT_PARENTHESIS);
    const definitions = this.parseDefinitions();
    this.consumeToken(TokenType.RIGHT_PARENTHESIS);
    return { type: "create", table, ifNotExists, definitions };
  }

  private parseDrop(): DropAST {
    this.consumeToken(TokenType.DROP);
    this.consumeToken(TokenType.TABLE);
    const ifExists = this.parseIfExists();
    const table = this.parseIdentifier();
    return { type: "drop", table, ifExists };
  }

  private parseInsertFields() {
    if (this.match(TokenType.LEFT_PARENTHESIS)) {
      this.consumeToken(TokenType.LEFT_PARENTHESIS);
      const fields = this.parseIdentifiers();
      this.consumeToken(TokenType.RIGHT_PARENTHESIS);
      return fields;
    }

    return "*";
  }

  private parseValues() {
    const value = this.parseValue();
    const values = this.parseValues_();
    return [value, ...values];
  }

  private parseValues_(): unknown[][] {
    if (this.match(TokenType.COMMA)) {
      this.consumeToken(TokenType.COMMA);
      const value = this.parseValue();
      const values = this.parseValues_();
      return [value, ...values];
    }

    return [];
  }

  private parseValue() {
    this.consumeToken(TokenType.LEFT_PARENTHESIS);
    const value = this.parseLiterals();
    this.consumeToken(TokenType.RIGHT_PARENTHESIS);
    return value;
  }

  private parseAssignments() {
    const assignment = this.parseAssignment();
    const assignments = this.parseAssignments_();
    return [assignment, ...assignments];
  }

  private parseAssignments_(): Assignment[] {
    if (this.match(TokenType.COMMA)) {
      this.consumeToken(TokenType.COMMA);
      const assignment = this.parseAssignment();
      const assignments = this.parseAssignments_();
      return [assignment, ...assignments];
    }

    return [];
  }

  private parseAssignment(): Assignment {
    const field = this.parseIdentifier();
    this.consumeToken(TokenType.EQUAL);
    const value = this.parseLiteral();
    return { field, value };
  }

  private parseDefinitions() {
    const definition = this.parseDefinition();
    const definitions = this.parseDefinitions_();
    return [definition, ...definitions];
  }

  private parseDefinitions_(): Definition[] {
    if (this.match(TokenType.COMMA)) {
      this.consumeToken(TokenType.COMMA);
      const definition = this.parseDefinition();
      const definitions = this.parseDefinitions_();
      return [definition, ...definitions];
    }

    return [];
  }

  private parseDefinition(): Definition {
    const field = this.parseIdentifier();
    const type = this.parseDataType();
    return { field, type };
  }

  private parseIfExists() {
    if (this.match(TokenType.IF)) {
      this.consumeToken(TokenType.IF);
      this.consumeToken(TokenType.EXISTS);
      return true;
    }

    return false;
  }

  private parseIfNotExists() {
    if (this.match(TokenType.IF)) {
      this.consumeToken(TokenType.IF);
      this.consumeToken(TokenType.NOT);
      this.consumeToken(TokenType.EXISTS);
      return true;
    }

    return false;
  }

  private parseWhere() {
    if (this.match(TokenType.WHERE)) {
      this.consumeToken(TokenType.WHERE);
      const conditions = this.parseConditions();
      return conditions;
    }

    return [];
  }

  private parseConditions() {
    const condition = this.parseCondition();
    const [type, conditions] = this.parseConditions_();

    const [first, ...rest] = conditions;
    if (type === undefined) {
      return [[condition], ...rest];
    } else if (type === TokenType.AND) {
      return [[condition, ...first!], ...rest];
    } else {
      return [[condition], ...conditions];
    }
  }

  private parseConditions_(): [TokenType | undefined, Condition[][]] {
    if (this.match(TokenType.AND)) {
      this.consumeToken(TokenType.AND);
      const condition = this.parseCondition();
      const [type, conditions] = this.parseConditions_();

      const [first, ...rest] = conditions;
      if (type === undefined) {
        return [TokenType.AND, [[condition], ...rest]];
      } else if (type === TokenType.AND) {
        return [TokenType.AND, [[condition, ...first!], ...rest]];
      } else {
        return [TokenType.AND, [[condition], ...conditions]];
      }
    }

    if (this.match(TokenType.OR)) {
      this.consumeToken(TokenType.OR);
      const condition = this.parseCondition();
      const [type, conditions] = this.parseConditions_();

      const [first, ...rest] = conditions;
      if (type === undefined) {
        return [TokenType.OR, [[condition], ...rest]];
      } else if (type === TokenType.AND) {
        return [TokenType.OR, [[condition, ...first!], ...rest]];
      } else {
        return [TokenType.OR, [[condition], ...conditions]];
      }
    }

    return [undefined, []];
  }

  private parseCondition(): Condition {
    const field = this.parseIdentifier();
    const operator = this.parseOperator();
    const value = this.parseLiteral();
    return { field, operator, value };
  }

  private parseReturning() {
    if (this.match(TokenType.RETURNING)) {
      this.consumeToken(TokenType.RETURNING);
      const fields = this.parseFields();
      return fields;
    }

    return [];
  }

  private parseFields() {
    if (this.match(TokenType.MULTIPLY)) {
      this.consumeToken(TokenType.MULTIPLY);
      return "*";
    }

    const fields = this.parseIdentifiers();
    return fields;
  }

  private parseIdentifiers() {
    const identifier = this.parseIdentifier();
    const identifiers = this.parseIdentifiers_();
    return [identifier, ...identifiers];
  }

  private parseIdentifiers_(): string[] {
    if (this.match(TokenType.COMMA)) {
      this.consumeToken(TokenType.COMMA);
      const identifier = this.parseIdentifier();
      const identifiers = this.parseIdentifiers_();
      return [identifier, ...identifiers];
    }

    return [];
  }

  private parseIdentifier() {
    return this.consumeToken(TokenType.IDENTIFIER).value as string;
  }

  private parseLiterals() {
    const literal = this.parseLiteral();
    const literals = this.parseLiterals_();
    return [literal, ...literals];
  }

  private parseLiterals_(): unknown[] {
    if (this.match(TokenType.COMMA)) {
      this.consumeToken(TokenType.COMMA);
      const literal = this.parseLiteral();
      const literals = this.parseLiterals_();
      return [literal, ...literals];
    }

    return [];
  }

  private parseLiteral() {
    return this.consumeToken(TokenType.LITERAL).value as unknown;
  }

  private parseOperator() {
    return this.consumeToken([
      TokenType.AND,
      TokenType.OR,
      TokenType.EQUAL,
      TokenType.NOT_EQUAL,
      TokenType.GREATER_THAN,
      TokenType.GREATER_THAN_OR_EQUAL,
      TokenType.LESS_THAN,
      TokenType.LESS_THAN_OR_EQUAL,
      TokenType.ADD,
      TokenType.SUBTRACT,
      TokenType.MULTIPLY,
      TokenType.DIVIDE,
    ]).type;
  }

  private parseDataType() {
    return this.consumeToken([
      TokenType.NUMERIC,
      TokenType.TEXT,
      TokenType.BOOLEAN,
    ]).type;
  }

  /**
   * Returns true if the current token type matches the expectation,
   * or false otherwise.
   */
  private match(expectation: TokenType | TokenType[]) {
    if (!this.isOpen()) {
      return false;
    }

    if (Array.isArray(expectation)) {
      return expectation.includes(this.current.type);
    }

    return expectation === this.current.type;
  }

  /**
   * If the current token type matches the expectation,
   * returns its value and moves to the next one.
   * Otherwise, throws an error.
   */
  private consumeToken(expectation: TokenType | TokenType[]) {
    const isMatched = this.match(expectation);

    if (isMatched) {
      return this.consume();
    }

    if (this.isOpen()) {
      throw new SqlParserError(`Invalid syntax: ${formatToken(this.current)}`);
    }

    throw new SqlParserError("Unexpected end of statement");
  }
}

function formatToken(token: Token) {
  return token.value === undefined ? token.type : token.value;
}
