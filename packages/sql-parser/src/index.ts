import { LexicalParser } from "./lexical";

const sql = "SELECT * FROM users WHERE price = null;";
const parser = new LexicalParser(sql);
const tokens = parser.parse();
console.log(tokens);
