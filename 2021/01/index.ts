import fs from "fs/promises";

(async () => {
  const lines = (await fs.readFile("input.txt", "utf-8"))
    .split("\n")
    .map(Number);

  const result = lines.reduce((sum, current, index) => {
    const previous = lines[index - 1];
    return !previous || current <= previous ? sum : sum + 1;
  }, 0);

  console.log(result);
})();
