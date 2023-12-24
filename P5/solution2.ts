import fs from "fs";
import readline from "readline";

type Card = {
  cardNumber: number;
  foundNumbers: number[];
  winningNumbers: Record<string, boolean>;
};

function getWonCopies(card: Card) {
  const numMatchingNumbers = card.foundNumbers.filter(
    (n) => card.winningNumbers[n]
  ).length;

  const copies = [];

  for (
    let i = card.cardNumber + 1;
    i <= card.cardNumber + numMatchingNumbers;
    i++
  ) {
    copies.push(i);
  }

  return copies;
}

async function solution() {
  const inputFileName = "input.txt";

  let currLineIndex = 0;
  const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFileName),
    output: process.stdout,
    terminal: false,
  });

  let cards: Record<string, Card> = {};

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

    cards[cardNumber] = {
      cardNumber: parseInt(cardNumber),
      foundNumbers: revealedNumbers.map((num) => parseInt(num)),
      winningNumbers: winningNumbers.reduce(
        (acc, curr) => ({ ...acc, [curr]: true }),
        {}
      ),
    };
  });

  readInterface.on("close", () => {
    let cardMap: Record<string, Card[]> = Object.values(cards).reduce(
      (curr, acc) => {
        return { ...curr, [acc.cardNumber]: [acc] };
      },
      {}
    );

    let currCardNumber = 1;

    while (currCardNumber <= Object.keys(cards).length) {
      const cardsOfThisNumber = cardMap[currCardNumber];
      for (const card of cardsOfThisNumber) {
        const wonCopies = getWonCopies(card);

        for (const copy of wonCopies) {
          if (typeof cardMap[copy] === "undefined") {
            cardMap[copy] = [];
          }

          cardMap[copy].push(cards[copy]);
        }
      }

      currCardNumber++;
    }

    const totalCards = Object.values(cardMap).reduce(
      (acc, curr) => acc + curr.length,
      0
    );
    console.log(totalCards);
  });
}

solution();
