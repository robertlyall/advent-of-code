const fs = require("fs/promises");

(async () => {
  const totals = (await fs.readFile("data.txt", "utf-8"))
    .split("\n\n")
    .map((group) => {
      console.log(group.split("\n"));
      return group.split("\n");
    })
    .reduce(
      (totals, group) => [
        ...totals,
        group.reduce((sum, n) => sum + Number(n), 0),
      ],
      []
    );

  console.log(Math.max(...totals));
})();
