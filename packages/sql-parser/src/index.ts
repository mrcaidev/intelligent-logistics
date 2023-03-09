import { parseLexicon } from "./lexicon";
import { parseSyntax } from "./syntax";

// const sql = "INSERT INTO users VALUES (1, 'John')";
const sql = "SELECT id, name FROM users WHERE id = 1 AND name = 'John'";

const tokens = parseLexicon(sql);
const tree = parseSyntax(tokens);
console.log(JSON.stringify(tree, undefined, 2));
