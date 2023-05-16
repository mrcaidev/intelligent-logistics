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
      throw new SqlParserError(`Unexpected token: ${this.current.value}`);
    }

    return ast;
  }

  private parseStatement(): AST {
    if (this.hasType(TokenType.SELECT)) {
      return this.parseSelect();
    }

    if (this.hasType(TokenType.INSERT)) {
      return this.parseInsert();
    }

    if (this.hasType(TokenType.UPDATE)) {
      return this.parseUpdate();
    }

    if (this.hasType(TokenType.DELETE)) {
      return this.parseDelete();
    }

    if (this.hasType(TokenType.CREATE)) {
      return this.parseCreate();
    }

    if (this.hasType(TokenType.DROP)) {
      return this.parseDrop();
    }

    throw new SqlParserError(`Unexpected token: ${this.current.value}`);
  }

  private parseSelect(): SelectAST {
    this.match(TokenType.SELECT);
    const fields = this.parseFields();
    this.match(TokenType.FROM);
    const table = this.parseIdentifier();
    const conditions = this.parseWhere();
    return { type: "select", fields, table, conditions };
  }

  private parseInsert(): InsertAST {
    this.match(TokenType.INSERT);
    this.match(TokenType.INTO);
    const table = this.parseIdentifier();
    const fields = this.parseInsertFields();
    this.match(TokenType.VALUES);
    const values = this.parseValues();
    const returning = this.parseReturning();
    return { type: "insert", table, fields, values, returning };
  }

  private parseUpdate(): UpdateAST {
    this.match(TokenType.UPDATE);
    const table = this.parseIdentifier();
    this.match(TokenType.SET);
    const assignments = this.parseAssignments();
    const conditions = this.parseWhere();
    const returning = this.parseReturning();
    return { type: "update", table, assignments, conditions, returning };
  }

  private parseDelete(): DeleteAST {
    this.match(TokenType.DELETE);
    this.match(TokenType.FROM);
    const table = this.parseIdentifier();
    const conditions = this.parseWhere();
    const returning = this.parseReturning();
    return { type: "delete", table, conditions, returning };
  }

  private parseCreate(): CreateAST {
    this.match(TokenType.CREATE);
    this.match(TokenType.TABLE);
    const ifNotExists = this.parseIfNotExists();
    const table = this.parseIdentifier();
    this.match(TokenType.LEFT_PARENTHESIS);
    const definitions = this.parseDefinitions();
    this.match(TokenType.RIGHT_PARENTHESIS);
    return { type: "create", table, ifNotExists, definitions };
  }

  private parseDrop(): DropAST {
    this.match(TokenType.DROP);
    this.match(TokenType.TABLE);
    const ifExists = this.parseIfExists();
    const table = this.parseIdentifier();
    return { type: "drop", table, ifExists };
  }

  private parseInsertFields() {
    if (this.hasType(TokenType.LEFT_PARENTHESIS)) {
      this.match(TokenType.LEFT_PARENTHESIS);
      const fields = this.parseIdentifiers();
      this.match(TokenType.RIGHT_PARENTHESIS);
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
    if (this.hasType(TokenType.COMMA)) {
      this.match(TokenType.COMMA);
      const value = this.parseValue();
      const values = this.parseValues_();
      return [value, ...values];
    }

    return [];
  }

  private parseValue() {
    this.match(TokenType.LEFT_PARENTHESIS);
    const value = this.parseLiterals();
    this.match(TokenType.RIGHT_PARENTHESIS);
    return value;
  }

  private parseAssignments() {
    const assignment = this.parseAssignment();
    const assignments = this.parseAssignments_();
    return [assignment, ...assignments];
  }

  private parseAssignments_(): Assignment[] {
    if (this.hasType(TokenType.COMMA)) {
      this.match(TokenType.COMMA);
      const assignment = this.parseAssignment();
      const assignments = this.parseAssignments_();
      return [assignment, ...assignments];
    }

    return [];
  }

  private parseAssignment(): Assignment {
    const field = this.parseIdentifier();
    this.match(TokenType.EQUAL);
    const value = this.parseLiteral();
    return { field, value };
  }

  private parseDefinitions() {
    const definition = this.parseDefinition();
    const definitions = this.parseDefinitions_();
    return [definition, ...definitions];
  }

  private parseDefinitions_(): Definition[] {
    if (this.hasType(TokenType.COMMA)) {
      this.match(TokenType.COMMA);
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
    if (this.hasType(TokenType.IF)) {
      this.match(TokenType.IF);
      this.match(TokenType.EXISTS);
      return true;
    }

    return false;
  }

  private parseIfNotExists() {
    if (this.hasType(TokenType.IF)) {
      this.match(TokenType.IF);
      this.match(TokenType.NOT);
      this.match(TokenType.EXISTS);
      return true;
    }

    return false;
  }

  private parseWhere() {
    if (this.hasType(TokenType.WHERE)) {
      this.match(TokenType.WHERE);
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
    if (this.hasType(TokenType.AND)) {
      this.match(TokenType.AND);
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

    if (this.hasType(TokenType.OR)) {
      this.match(TokenType.OR);
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
    if (this.hasType(TokenType.RETURNING)) {
      this.match(TokenType.RETURNING);
      const fields = this.parseFields();
      return fields;
    }

    return [];
  }

  private parseFields() {
    if (this.hasType(TokenType.MULTIPLY)) {
      this.match(TokenType.MULTIPLY);
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
    if (this.hasType(TokenType.COMMA)) {
      this.match(TokenType.COMMA);
      const identifier = this.parseIdentifier();
      const identifiers = this.parseIdentifiers_();
      return [identifier, ...identifiers];
    }

    return [];
  }

  private parseIdentifier() {
    return this.match(TokenType.IDENTIFIER).value as string;
  }

  private parseLiterals() {
    const literal = this.parseLiteral();
    const literals = this.parseLiterals_();
    return [literal, ...literals];
  }

  private parseLiterals_(): unknown[] {
    if (this.hasType(TokenType.COMMA)) {
      this.match(TokenType.COMMA);
      const literal = this.parseLiteral();
      const literals = this.parseLiterals_();
      return [literal, ...literals];
    }

    return [];
  }

  private parseLiteral() {
    return this.match(TokenType.LITERAL).value as unknown;
  }

  private parseOperator() {
    return this.match([
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
    ]).value as string;
  }

  private parseDataType() {
    return this.match([TokenType.NUMERIC, TokenType.TEXT, TokenType.BOOLEAN])
      .value as string;
  }

  /**
   * Returns true if the current token type matches the expectation,
   * or false otherwise.
   */
  private hasType(expectation: TokenType | TokenType[]) {
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
  private match(expectation: TokenType | TokenType[]) {
    if (!this.isOpen()) {
      throw new SqlParserError("Unexpected end of statement");
    }

    if (this.hasType(expectation)) {
      return this.consume();
    }

    throw new SqlParserError(`Unexpected token: ${this.current.value}`);
  }
}
