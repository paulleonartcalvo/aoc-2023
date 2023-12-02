import fs from "fs";
import readline from "readline";

async function solution() {
  const inputFileName = "input.txt";

  let runningSum = 0;
  const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFileName),
    output: process.stdout,
    terminal: false,
  });

  readInterface.on("line", function (line) {
    // Find matches of 1 number on the line
    const numberMatches = line.match(/\d/g);
    const [firstMatch, lastMatch] = [
      numberMatches?.at(0),
      numberMatches?.at(-1),
    ];

    const joined = `${firstMatch}${lastMatch}`;

    const lineResult = parseInt(joined);

    runningSum += lineResult;
  });

  readInterface.on("close", () => console.log(runningSum));
}

solution();
