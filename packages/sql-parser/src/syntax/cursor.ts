import { Cursor } from "src/cursor";
import type {
  Assignments,
  Condition,
  Definition,
  Token,
  TokenType,
} from "src/types";
import { SyntacticError } from "./error";

export class SyntacticCursor extends Cursor<Token> {
  public hasType(expectation: TokenType) {
    return this.isOpen() && this.current.type === expectation;
  }

  public hasValue(expectation: unknown) {
    return this.isOpen() && this.current.value === expectation;
  }

  public override consume() {
    if (this.isClosed()) {
      throw new SyntacticError("Unexpected end of input");
    }

    return super.consume();
  }

  public consumeByType(expectation: TokenType) {
    const { type, value } = this.consume();

    if (type !== expectation) {
      throw new SyntacticError(`Expect ${expectation} at '${value}'`);
    }

    return value;
  }

  public consumeByValue(expectation: unknown) {
    const { type, value } = this.consume();

    if (value !== expectation) {
      throw new SyntacticError(`Expect '${expectation}' at '${value}'`);
    }

    return type;
  }

  public consumeManyByType(expectation: TokenType) {
    const values: unknown[] = [];

    while (this.hasType(expectation)) {
      values.push(this.consume().value);

      if (this.hasValue(",")) {
        this.consume();
        continue;
      }

      if (this.hasType(expectation)) {
        throw new SyntacticError(`Expect ',' before ${this.current.value}`);
      }
    }

    if (values.length === 0) {
      throw new SyntacticError(
        `Expect ${expectation} before ${this.current.value}`
      );
    }

    return values;
  }

  public consumeCondition() {
    const field = this.consumeByType("identifier");
    const operator = this.consumeByType("operator");
    const value = this.consumeByType("literal");

    return { field, operator, value } as Condition;
  }

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

    return conditionGroups;
  }

  public consumeManyAssignments() {
    const assignments: Assignments[] = [];

    while (this.hasType("identifier")) {
      const { field, operator, value } = this.consumeCondition();

      if (operator !== "=") {
        throw new SyntacticError(`Expect '=' at '${operator}'`);
      }

      assignments.push({ field, value });

      if (this.hasValue(",")) {
        this.consume();
        continue;
      }

      if (this.hasType("identifier")) {
        throw new SyntacticError(`Expect ',' before ${this.current.value}`);
      }
    }

    if (assignments.length === 0) {
      throw new SyntacticError(
        `Expect assignments before ${this.current.value}`
      );
    }

    return assignments;
  }

  public consumeDefinition() {
    const field = this.consumeByType("identifier");
    const type = this.consumeByType("dataType");

    return { field, type } as Definition;
  }

  public consumeManyDefinitions() {
    const definitions: Definition[] = [];

    while (this.hasType("identifier")) {
      const definition = this.consumeDefinition();
      definitions.push(definition);

      if (this.hasValue(",")) {
        this.consumeByValue(",");
        continue;
      }
    }

    if (definitions.length === 0) {
      throw new SyntacticError(
        `Expect definitions before ${this.current.value}`
      );
    }

    return definitions;
  }
}
