import type { Token } from "src/types";
import { SyntacticCursor } from "../cursor";

export class DeleteParser {
  private cursor: SyntacticCursor;

  constructor(tokens: Token[]) {
    this.cursor = new SyntacticCursor(tokens);
  }

  public parse() {
    this.cursor.consumeByValue("DELETE");
    this.cursor.consumeByValue("FROM");
    const table = this.cursor.consumeByType("identifier") as string;
    const conditions = this.parseConditions();

    return {
      type: "delete",
      table,
      conditions,
    };
  }

  private parseConditions() {
    if (!this.cursor.hasValue("WHERE")) {
      return [];
    }

    this.cursor.consume();
    return this.cursor.consumeManyConditions();
  }
}
