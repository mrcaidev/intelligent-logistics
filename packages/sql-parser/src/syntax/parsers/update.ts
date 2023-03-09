import type { Token } from "src/types";
import { SyntacticCursor } from "../cursor";

export class UpdateParser {
  private cursor: SyntacticCursor;

  constructor(tokens: Token[]) {
    this.cursor = new SyntacticCursor(tokens);
  }

  public parse() {
    this.cursor.consumeByValue("UPDATE");
    const table = this.cursor.consumeByType("identifier") as string;
    this.cursor.consumeByValue("SET");
    const assignments = this.cursor.consumeManyAssignments();
    const conditions = this.parseConditions();

    return {
      type: "update",
      table,
      assignments,
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
