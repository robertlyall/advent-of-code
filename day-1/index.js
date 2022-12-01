const fs = require("fs/promises");

(async () => {
  const totals = (await fs.readFile("data.txt", "utf-8"))
    .split("\n\n")
    .map((group) => group.split("\n"))
    .reduce(
      (totals, group) => [
        ...totals,
        group.reduce((sum, n) => sum + parseInt(n), 0),
      ],
      []
    )
    .sort((a, b) => b - a);

  console.log(totals.slice(0, 3).reduce((sum, n) => sum + n, 0));
})();
