import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Preprocessor } from "./preprocessor";

export function parse(input: string) {
  return new Preprocessor(input)
    .preprocess()
    .map((statement) => new Lexer(statement).tokenize())
    .map((tokens) => new Parser(tokens).parse());
}
