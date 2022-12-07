const _ = require("lodash");
const fs = require("fs/promises");

const parse = (line) => {
  const match = line.match(/^(\d+)\s[\w\.]+$/);
  const [, size] = match;
  return parseInt(size);
};

(async () => {
  const lines = (await fs.readFile(process.argv[2], "utf-8")).split("\n");

  let current = [];
  let paths = new Map();

  lines.forEach((line) => {
    if (line.startsWith("$")) {
      const match = line.match(/^\$\s(\w+)\s?(.+)?$/);
      const [, command, argument] = match;
      if (command !== "cd") return;
      if (argument === "..") return current.pop();
      if (argument === "/") return (current = []);
      current.push(argument);
      return;
    }

    if (line.startsWith("dir")) return;

    const size = parse(line);

    _.times(current.length, (n) => {
      const parts = current.slice(0, n + 1);
      const path = parts.join("/");
      const value = paths.get(path) || 0;
      paths.set(path, size + value);
    });
  });

  console.log(paths);

  console.log(
    [...paths.values()].filter((v) => v < 100000).reduce((sum, n) => sum + n, 0)
  );
})();
