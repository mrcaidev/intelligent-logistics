import { parseLexicon } from "./lexicon";
import { parseSyntax } from "./syntax";

// const sql = "SELECT id, name FROM users WHERE id = 1 AND name = 'John'";
// const sql = "INSERT INTO users VALUES (1, 'John')";
const sql = "UPDATE users SET name = 'John', age = 24 WHERE id = 1";

const tokens = parseLexicon(sql);
const tree = parseSyntax(tokens);
console.log(JSON.stringify(tree, undefined, 2));
