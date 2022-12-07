const _ = require("lodash");
const fs = require("fs/promises");

const isCommand = (line) => line.startsWith("$");

const getLines = async () =>
  (await fs.readFile("input.txt", "utf-8")).split("\n");

const parseDir = (line) => {
  const match = line.match(/^dir\s(\w+)$/);

  if (!match) throw new Error("Invalid directory");

  const [, name] = match;

  return {
    children: [],
    name,
    type: "directory",
  };
};

const parseFile = (line) => {
  const match = line.match(/^(\d+)\s([\w\.]+)$/);

  if (!match) throw new Error("Invalid file");

  const [, size, name] = match;

  return {
    name,
    size: parseInt(size),
    type: "file",
  };
};

const parse = (line) =>
  line.startsWith("dir") ? parseDir(line) : parseFile(line);

const disk = [];

const sizes = [];

const calculateSize = (children) => {
  const sizeOfDirectories = children
    .filter((i) => i.type === "directory")
    .map((d) => calculateSize(d.children))
    .reduce((sum, n) => sum + n, 0);

  const sizeOfFiles = children
    .filter((i) => i.type === "file")
    .map((f) => f.size)
    .reduce((sum, n) => sum + n, 0);

  const size = sizeOfDirectories + sizeOfFiles;

  sizes.push(size);

  return size;
};

(async () => {
  const lines = await getLines();

  let path = [];

  lines.forEach((line) => {
    if (isCommand(line)) {
      const match = line.match(/^\$\s(\w+)\s?(.+)?$/);
      if (!match) throw new Error("Invalid command");
      const [, command, argument] = match;
      if (command !== "cd") return;
      if (argument === "..") {
        path = path.slice(0, path.length - 2);
      } else if (argument !== "/") {
        path.push(argument);
        path.reduce((children, fragment) => {
          const found = children
            .filter(({ type }) => type === "directory")
            .find(({ name }) => fragment === name);
          if (found) return found.children;
          const dir = {
            children: [],
            name: argument,
            type: "directory",
          };
          children.push(dir);
          return dir.children;
        }, disk);
      }
      return;
    }

    // console.log(disk, path);

    let current = disk;

    for (const fragment of path) {
      current = current
        .filter(({ type }) => type === "directory")
        .find((d) => d.name === fragment).children;
    }

    // console.log(current);

    // // we're listing baby
    const parsed = parse(line);

    // console.log(parsed);

    const { name } = parsed;
    const index = current.findIndex((i) => i.name === name);
    index === -1 ? current.push(parsed) : (current[index] = parsed);
  });

  calculateSize(disk);

  const dirSizes = sizes.filter((s) => s <= 100000).sort((a, b) => b - a);
  console.log(dirSizes.reduce((sum, n) => sum + n, 0));
})();
