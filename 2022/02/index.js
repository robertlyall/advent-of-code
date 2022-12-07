const fs = require("fs/promises");

const EXPECTED_OUTCOME = Object.freeze({
  X: "loss",
  Y: "draw",
  Z: "win",
});

const MY_PLAYS = Object.freeze({
  X: "R",
  Y: "P",
  Z: "S",
});

const OPPONENT_PLAYS = Object.freeze({
  A: "R",
  B: "P",
  C: "S",
});

const PLAY_SCORES = Object.freeze({
  P: 2,
  R: 1,
  S: 3,
});

const RESULT_SCORES = Object.freeze({
  loss: 0,
  draw: 3,
  win: 6,
});

const LOSS_MAP = Object.freeze({
  S: "P",
  P: "R",
  R: "S",
});

const WIN_MAP = Object.freeze({
  S: "R",
  P: "S",
  R: "P",
});

const playForOutcome = (expectedOutcome, opponentPlay) => {
  if (expectedOutcome === "draw") {
    return opponentPlay;
  }

  if (expectedOutcome === "loss") {
    return LOSS_MAP[opponentPlay];
  }

  return WIN_MAP[opponentPlay];
};

(async () => {
  const games = (await fs.readFile("data.txt", "utf-8")).split("\n");

  const total = games.reduce((sum, game) => {
    const [opponentEncryptedPlay, expectedOutcomeSymbol] = game.split(" ");

    const expectedOutcome = EXPECTED_OUTCOME[expectedOutcomeSymbol];

    const opponentPlay = OPPONENT_PLAYS[opponentEncryptedPlay];

    const myPlay = playForOutcome(expectedOutcome, opponentPlay);

    const score = PLAY_SCORES[myPlay] + RESULT_SCORES[expectedOutcome];

    return sum + score;
  }, 0);

  console.log(total);
})();
