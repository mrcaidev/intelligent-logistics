import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Preprocessor } from "./preprocessor";

/**
 * Parse the input into a list of ASTs.
 * @param input Input string.
 * @returns A list of ASTs.
 */
export function parse(input: string) {
  return new Preprocessor(input)
    .process()
    .map((statement) => new Lexer(statement).tokenize())
    .map((tokens) => new Parser(tokens).parse());
}
