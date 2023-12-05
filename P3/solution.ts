import fs from "fs";
import readline from "readline";

type LineMatch = {
  index: number;
  lineIndex: number;
  content: string;
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
    console.log(
      numbers
        .filter((number) =>
          symbols.some((symbol) => matchIsAdjacent(number, symbol))
        )
        .map((number) => parseInt(number.content))
        .reduce((a, b) => a + b, 0)
    );

    // numbers.slice(0, 10).map((number) => {
    //   console.log("NUMBER: ", number);
    //   console.log(
    //     "ADJACENT SYMBOLS: ",
    //     getAdjacentSymbols(number, symbols).map((s) => s)
    //   );
    // });
  });
}

solution();
