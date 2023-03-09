import type { Token } from "src/types";
import { SyntacticCursor } from "../cursor";

export class SelectParser {
  private cursor: SyntacticCursor;

  constructor(tokens: Token[]) {
    this.cursor = new SyntacticCursor(tokens);
  }

  public parse() {
    this.cursor.consumeByValue("SELECT");
    const fields = this.parseFields();
    this.cursor.consumeByValue("FROM");
    const table = this.cursor.consumeByType("identifier") as string;
    const conditions = this.parseConditions();

    return {
      type: "select",
      fields,
      table,
      conditions,
    };
  }

  private parseFields() {
    if (!this.cursor.hasValue("*")) {
      return this.cursor.consumeManyByType("identifier") as string[];
    }

    this.cursor.consume();
    return "*";
  }

  private parseConditions() {
    if (!this.cursor.hasValue("WHERE")) {
      return [];
    }

    this.cursor.consume();
    return this.cursor.consumeManyConditions();
  }
}
