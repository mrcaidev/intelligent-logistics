import { Cursor } from "src/cursor";
import type { Token } from "src/types";
import { SyntacticError } from "./error";

export class InsertParser {
  private cursor: Cursor<Token>;

  constructor(tokens: Token[]) {
    this.cursor = new Cursor(tokens);
  }

  public parse() {
    this.checkInsertInto();
    const table = this.parseTable();

    let fields: "*" | string[] = "*";
    if (this.hasFields()) {
      fields = this.parseFields();
    }

    this.checkValues();
    const values = this.parseValues();

    return {
      type: "insert",
      table,
      fields,
      values,
    };
  }

  private checkInsertInto() {
    if (this.cursor.current().value !== "INSERT") {
      throw new SyntacticError("Expect INSERT INTO at the beginning");
    }

    this.cursor.forward();

    if (this.cursor.current().value !== "INTO") {
      throw new SyntacticError("Expect INSERT INTO at the beginning");
    }

    this.cursor.forward();
  }

  private parseTable() {
    if (this.cursor.current().type !== "identifier") {
      throw new SyntacticError("Expect table name after INSERT INTO");
    }

    const value = this.cursor.current().value as string;
    this.cursor.forward();
    return value;
  }

  private hasFields() {
    if (this.cursor.current().value !== "(") {
      return false;
    }

    this.cursor.forward();
    return true;
  }

  private parseFields() {
    const fields = [];

    while (this.cursor.current().type === "identifier") {
      fields.push(this.cursor.current().value as string);
      this.cursor.forward();

      if (this.cursor.current().value === ",") {
        this.cursor.forward();
        continue;
      }

      if (this.cursor.current().type === "identifier") {
        throw new SyntacticError(`Expect ',' before ${this.cursor.current()}`);
      }
    }

    if (this.cursor.current().value !== ")") {
      throw new SyntacticError(`Expect ')' after fields`);
    }

    if (fields.length === 0) {
      throw new SyntacticError("Expect column names between parentheses");
    }

    this.cursor.forward();

    return fields;
  }

  private checkValues() {
    if (this.cursor.current().value !== "VALUES") {
      throw new SyntacticError("Expect VALUES after INSERT INTO");
    }

    this.cursor.forward();
  }

  private parseValues() {
    if (this.cursor.current().value !== "(") {
      throw new SyntacticError("Expect '(' after VALUES");
    }

    this.cursor.forward();

    const values: unknown[] = [];

    while (this.cursor.current().value !== ")") {
      if (!this.cursor.isOpen()) {
        throw new SyntacticError("Unclosed parenthesis");
      }

      if (this.cursor.current().type !== "literal") {
        throw new SyntacticError(
          `Expect literal as values, received ${this.cursor.current().value}`
        );
      }

      values.push(this.cursor.current().value);
      this.cursor.forward();

      if (this.cursor.current().value === ",") {
        this.cursor.forward();
      }
    }

    if (values.length === 0) {
      throw new SyntacticError("Expect values between parentheses");
    }

    return values;
  }
}
