const fs = require("fs/promises");

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

const WINNING_PLAYS = Object.freeze(["S P", "P R", "R S"]);

const isWin = (myPlay, opponentPlay) =>
  WINNING_PLAYS.includes(`${myPlay} ${opponentPlay}`);

(async () => {
  const games = (await fs.readFile("data.txt", "utf-8")).split("\n");

  const total = games.reduce((sum, game) => {
    const [opponentEncryptedPlay, myEncryptedPlay] = game.split(" ");

    const myPlay = MY_PLAYS[myEncryptedPlay];
    const opponentPlay = OPPONENT_PLAYS[opponentEncryptedPlay];

    let score = PLAY_SCORES[myPlay];

    if (myPlay === opponentPlay) {
      score += RESULT_SCORES.draw;
    } else if (isWin(myPlay, opponentPlay)) {
      score += RESULT_SCORES.win;
    } else {
      score += RESULT_SCORES.loss;
    }

    return sum + score;
  }, 0);

  console.log(total);
})();
