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

  let lineIndex = 0;
  let seedNumbers: number[] = [];
  const map = {
    seed: {
      soil: {},
    },
    soil: {
      fertilizer: {},
    },
    fertilizer: {
      water: {},
    },
    water: {
      light: {},
    },
    light: {
      temperature: {},
    },
    temperature: {
      humidity: {},
    },
    humidity: {
      location: {},
    },
  };

  readInterface.on("line", function (line) {
    const seedNumbersRegex = /seeds:(?<seedNumbers>(\s+\d+)+)/g;

    if (lineIndex === 0) {
      const matches = seedNumbersRegex.exec(line);

      const sanitizedSeedNumbers = matches?.groups?.seedNumbers
        .trim()
        .split(/\s+/)
        .map((num) => parseInt(num));
      if (typeof sanitizedSeedNumbers === "undefined") {
        console.log(line);
        throw new Error("Seed numbers match is undefined");
      }

      seedNumbers = sanitizedSeedNumbers;
      console.log(`${seedNumbers.length} seed numbers`);
      console.log(seedNumbers);
    } else {
      if (line.endsWith("map:")) {
        console.log("Map title line");
        const sourceDestRegex = /(?<sourceName>.+)-to-(?<destName>.+)\smap:/;

        const { sourceName, destName } =
          sourceDestRegex.exec(line)?.groups ?? {};
        if (
          typeof sourceName === "undefined" ||
          typeof destName === "undefined"
        ) {
          console.log(line);
          throw new Error("Source or destination name is undefined");
        }

        console.log(`Source: ${sourceName}, Destination: ${destName}`);
      } else {
      }

      console.log;
    }

    lineIndex++;
  });

  readInterface.on("close", () => {});
}

solution();
