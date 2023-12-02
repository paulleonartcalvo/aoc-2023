import fs from "fs";
import readline from "readline";

const numberMap: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
/**
 * Now we have to account for matches of "one", "two", etc on the line.
 */
async function solution() {
  const inputFileName = "input.txt";

  let runningSum = 0;
  const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFileName),
    output: process.stdout,
    terminal: false,
  });

  readInterface.on("line", function (line) {
    // Overlapping numbers will result in erroneous outputs, so we have to check
    // the same line multiple times with different regexes, then sort by index of match

    const matchers = [
      "\\d",
      ...Object.keys(numberMap).map((key) => `(${key})`),
    ];
    const regexes = matchers.map((matcher) => new RegExp(matcher, "g"));

    const matches = regexes
      .flatMap((regex) => {
        const allMatches = [...line.matchAll(regex)];
        return allMatches.flatMap((m) => {
          if (typeof m.index === "undefined" || m.length < 1) return [];
          return [{ match: m[0], index: m.index }];
        });
      })
      .sort((a, b) => a.index - b.index);
    if (matches.every((match) => match === null)) {
      console.log(line);
    }
    const [firstMatch, lastMatch] = [
      matches?.at(0)?.match,
      matches?.at(-1)?.match,
    ];
    console.log(line);
    console.log(firstMatch, lastMatch);

    if (typeof firstMatch === "undefined" || typeof lastMatch === "undefined")
      throw new Error("No matches found");

    const [parseFirst, parseSecond] = [
      parseInt(firstMatch),
      parseInt(lastMatch),
    ];

    // If it can be parsed as number, do so, otherwise look up the value in numberMap
    const joined = `${
      !Number.isNaN(parseFirst) ? parseFirst : numberMap[firstMatch]
    }${!Number.isNaN(parseSecond) ? parseSecond : numberMap[lastMatch]}`;

    console.log(joined);
    const lineResult = parseInt(joined);

    runningSum += lineResult;
  });

  readInterface.on("close", () => console.log(runningSum));
}

solution();
