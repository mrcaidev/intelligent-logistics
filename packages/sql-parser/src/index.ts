import { LexicalParser } from "./lexical";
import { parseSyntax } from "./syntax";

const sql =
  "SELECT * FROM users WHERE price = null AND id = 1 OR salary = 1000;";
const parser = new LexicalParser(sql);
const tokens = parser.parse();

const tree = parseSyntax(tokens);
console.log(JSON.stringify(tree, undefined, 2));
