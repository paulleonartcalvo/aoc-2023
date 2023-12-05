import fs from "fs";
import readline from "readline";

type Card = {
  cardNumber: number;
  foundNumbers: number[];
  winningNumbers: Record<string, boolean>;
};
async function solution() {
  const inputFileName = "input.txt";

  let currLineIndex = 0;
  const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFileName),
    output: process.stdout,
    terminal: false,
  });

  let cards: Card[] = [];

  readInterface.on("line", function (line) {
    const regex = /Card\s+(?<cardNumber>\d+):\s+(?<numberSets>.*)/g;

    const matches = regex.exec(line);

    const cardNumber = matches?.groups?.cardNumber;
    const numberSets = matches?.groups?.numberSets;

    if (
      typeof cardNumber === "undefined" ||
      typeof numberSets === "undefined"
    ) {
      console.log(line);
      throw new Error("Card number or number sets is undefined");
    }

    const [revealedNumbers, winningNumbers] = numberSets
      .split("|")
      .map((set) => set.trim().split(/\s+/));

    cards.push({
      cardNumber: parseInt(cardNumber),
      foundNumbers: revealedNumbers.map((num) => parseInt(num)),
      winningNumbers: winningNumbers.reduce(
        (acc, curr) => ({ ...acc, [curr]: true }),
        {}
      ),
    });
  });

  readInterface.on("close", () => {
    const cardValues = cards.map((card) => {
      const matchingNumbers = card.foundNumbers.filter(
        (n) => card.winningNumbers[n]
      );

      if (matchingNumbers.length === 0) return 0;

      return 1 * Math.pow(2, matchingNumbers.length - 1);
    });

    console.log(cardValues.reduce((acc, curr) => acc + curr, 0));
  });
}

solution();
