const fs = require("fs/promises");

(async () => {
  const result = (await fs.readFile("input.txt", "utf-8"))
    .split("\n\n")
    .map((g) => g.split("\n"))
    .reduce((t, g) => [...t, g.reduce((s, n) => s + +n, 0)], [])
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((s, n) => s + n, 0);

  console.log(result);
})();
