import fs from "fs";
import readline from "readline";

type LineMatch = {
  index: number;
  lineIndex: number;
  content: string;
};

type Gear = LineMatch & {
  gearRatio: number;
};

function matchIsAdjacent(number: LineMatch, symbol: LineMatch) {
  const lineIndexDiff = Math.abs(number.lineIndex - symbol.lineIndex);
  return (
    lineIndexDiff <= 1 &&
    symbol.index >= number.index - 1 &&
    symbol.index <= number.index + number.content.length
  );
}

async function solution() {
  const inputFileName = "input.txt";

  let currLineIndex = 0;
  const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFileName),
    output: process.stdout,
    terminal: false,
  });

  let numbers: LineMatch[] = [];
  let symbols: LineMatch[] = [];

  readInterface.on("line", function (line) {
    const numberRegex = /\d+/g;
    const symbolRegex = /[^\d.]/g;

    const numberMatches: LineMatch[] = [...line.matchAll(numberRegex)].map(
      (match) => {
        if (typeof match.index === "undefined") {
          throw new Error("Match index is undefined");
        }

        return {
          content: match[0],
          index: match.index,
          lineIndex: currLineIndex,
        };
      }
    );

    const symbolMatches: LineMatch[] = [...line.matchAll(symbolRegex)].map(
      (match) => {
        if (typeof match.index === "undefined") {
          throw new Error("Match index is undefined");
        }

        return {
          content: match[0],
          index: match.index,
          lineIndex: currLineIndex,
        };
      }
    );

    numbers = numbers.concat(numberMatches);
    symbols = symbols.concat(symbolMatches);
    currLineIndex++;
  });

  readInterface.on("close", () => {
    const gears: Gear[] = symbols
      .filter((symbol) => symbol.content === "*")
      .flatMap((symbol): Gear[] => {
        const adjacentNumbers = numbers.filter((number) =>
          matchIsAdjacent(number, symbol)
        );

        if (adjacentNumbers.length !== 2) {
          return [];
        }

        return [
          {
            ...symbol,
            gearRatio: adjacentNumbers
              .map((n) => parseInt(n.content))
              .reduce((a, b) => a * b, 1),
          },
        ];
      });

    console.log(gears.reduce((a, b) => a + b.gearRatio, 0));
  });
}

solution();
