import _ from "lodash";
import fs from "fs/promises";

type File = {
  name: string;
  size: number;
  type: "file";
};

type Directory = {
  children: (Directory | File)[];
  name: string;
  type: "directory";
};

const isCommand = (line: string) => line.startsWith("$");

const getLines = async () =>
  (await fs.readFile("input.txt", "utf-8")).split("\n");

const parseDirectory = (line: string) => {
  const match = line.match(/^dir\s(\w+)$/);
  if (!match) throw new Error("Invalid directory");
  const [, name] = match;
  return name;
};

const parseLsLine = (line: string): Directory | File => {
  if (line.startsWith("dir")) {
    return {
      children: [],
      name: parseDirectory(line),
      type: "directory",
    };
  }

  const match = line.match(/^(\d+)\s([\w\.]+)$/);

  if (!match) throw new Error("Invalid file");

  const [, size, name] = match;

  return {
    name,
    size: parseInt(size),
    type: "file",
  };
};

const disk: Directory[] = [];

(async () => {
  const lines = await getLines();

  let path: string[] = [];

  lines.forEach((line) => {
    if (isCommand(line)) {
      const match = line.match(/^\$\s(\w+)\s?(.+)?$/);
      if (!match) throw new Error("Invalid command");
      const [, command, argument] = match;
      switch (command) {
        case "cd":
          if (argument === "..") {
            path = path.slice(0, path.length - 2);
          } else if (argument !== "/") {
            path.push(argument);
            path.reduce((children, fragment) => {
              const found = children
                .filter(({ type }) => type === "directory")
                .find(({ name }) => fragment === name) as Directory | undefined;
              if (found) return found.children;
              const dir: Directory = {
                children: [],
                name: argument,
                type: "directory",
              };
              children.push(dir);
              return dir.children;
            }, disk);
          }
          return;
        case "ls":
          return;
      }
    }

    // console.log(disk, path);

    let current: (Directory | File)[] = disk;

    for (const fragment of path) {
      current = (
        current
          .filter(({ type }) => type === "directory")
          .find((d) => d.name === fragment) as Directory
      ).children;
    }

    console.log(current);

    // // we're listing baby
    // const parsed = parseLsLine(line);

    // const { name } = parsed;
    // currentDirectory[name] = parsed;
  });

  // console.log(disk);
})();
