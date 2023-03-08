import { Cursor } from "src/cursor";
import type { Token } from "src/token";
import type { Condition } from "src/types";
import { SyntacticError } from "./error";

export class SelectParser {
  private cursor: Cursor<Token>;

  constructor(tokens: Token[]) {
    this.cursor = new Cursor(tokens);
  }

  public parse() {
    this.checkSelect();
    const fields = this.parseFields();
    this.checkFrom();
    const table = this.parseTable();

    let conditions: Condition[][] = [];
    if (this.hasWhere()) {
      conditions = this.parseConditions();
    }

    return {
      type: "select",
      fields,
      table,
      conditions,
    };
  }

  private checkSelect() {
    if (this.cursor.current().value === "SELECT") {
      this.cursor.forward();
      return;
    }

    throw new SyntacticError("Expect SELECT at the beginning");
  }

  private parseFields() {
    if (this.cursor.current().value === "*") {
      this.cursor.forward();
      return "*" as const;
    }

    const fields = [];

    while (this.cursor.current().type === "identifier") {
      fields.push(this.cursor.current().value as string);
      this.cursor.forward();

      if (this.cursor.current().value === ",") {
        this.cursor.forward();
        continue;
      }

      if (this.cursor.current().type === "identifier") {
        throw new SyntacticError(
          `Expect comma before ${this.cursor.current()}`
        );
      }
    }

    if (fields.length === 0) {
      throw new SyntacticError("Expect column names after SELECT");
    }

    return fields;
  }

  private checkFrom() {
    if (this.cursor.current().value === "FROM") {
      this.cursor.forward();
      return;
    }

    throw new SyntacticError("Expect FROM after column names");
  }

  private parseTable() {
    if (this.cursor.current().type === "identifier") {
      const value = this.cursor.current().value as string;
      this.cursor.forward();
      return value;
    }

    throw new SyntacticError("Expect table name after FROM");
  }

  private hasWhere() {
    if (this.cursor.current().value === "WHERE") {
      this.cursor.forward();
      return true;
    }

    return false;
  }

  private parseConditions() {
    const conditionGroups: Condition[][] = [];
    let currentGroup: Condition[] = [];

    while (this.cursor.current().type === "identifier") {
      const field = this.cursor.current().value as string;
      this.cursor.forward();

      if (this.cursor.current().type !== "operator") {
        throw new SyntacticError(`Expect operator after ${field}`);
      }

      const operator = this.cursor.current().value as string;
      this.cursor.forward();

      if (this.cursor.current().type !== "literal") {
        throw new SyntacticError(`Expect literal after ${field} ${operator}`);
      }

      const value = this.cursor.current().value;
      this.cursor.forward();

      const condition: Condition = { field, operator, value };

      if (this.cursor.current().value === "AND") {
        currentGroup.push(condition);
        this.cursor.forward();
        continue;
      }

      if (this.cursor.current().value === "OR") {
        currentGroup.push(condition);
        conditionGroups.push(currentGroup);
        currentGroup = [];
        this.cursor.forward();
        continue;
      }

      currentGroup.push(condition);
      conditionGroups.push(currentGroup);
    }

    if (conditionGroups.length === 0) {
      throw new SyntacticError("Expect conditions after WHERE");
    }

    return conditionGroups;
  }
}
