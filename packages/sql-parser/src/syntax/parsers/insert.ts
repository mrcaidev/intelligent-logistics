import type { Token } from "src/types";
import { SyntacticCursor } from "../cursor";
import { SyntacticError } from "../error";

export class InsertParser {
  private cursor: SyntacticCursor;

  constructor(tokens: Token[]) {
    this.cursor = new SyntacticCursor(tokens);
  }

  public parse() {
    this.cursor.consumeByValue("INSERT");
    this.cursor.consumeByValue("INTO");
    const table = this.cursor.consumeByType("identifier") as string;
    const fields = this.parseFields();
    this.cursor.consumeByValue("VALUES");
    this.cursor.consumeByValue("(");
    const values = this.cursor.consumeManyByType("literal") as unknown[];
    this.cursor.consumeByValue(")");

    if (fields !== "*" && fields.length !== values.length) {
      throw new SyntacticError(
        `Cannot insert ${values.length} values into ${fields.length} fields`
      );
    }

    return {
      type: "insert",
      table,
      fields,
      values,
    };
  }

  private parseFields() {
    if (!this.cursor.hasValue("(")) {
      return "*";
    }

    this.cursor.consume();
    const fields = this.cursor.consumeManyByType("identifier") as string[];
    this.cursor.consumeByValue(")");
    return fields;
  }
}
