import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Preprocessor } from "./preprocessor";
import { ORM, Runner } from "./runner";

/**
 * Connect a given ORM to SQL runner.
 * @param orm ORM to manipulate data in files.
 * @returns A function to run SQL statements and return their results.
 */
export function connectOrmToRunner(orm: ORM) {
  const runner = new Runner(orm);

  return (input: string) =>
    new Preprocessor(input)
      .process()
      .map((statement) => new Lexer(statement).tokenize())
      .map((tokens) => new Parser(tokens).parse())
      .map((ast) => runner.run(ast));
}
