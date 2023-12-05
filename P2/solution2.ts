import fs from "fs";
import readline from "readline";

type GameInfo = {
  id: string;
  requiredRed: number;
  requiredBlue: number;
  requiredGreen: number;
};

type PossibleTestInput = {
  red?: number;
  green: number;
  blue?: number;
};

const possibleTest: PossibleTestInput = {
  red: 12,
  green: 13,
  blue: 14,
};

async function solution() {
  const inputFileName = "input.txt";

  const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFileName),
    output: process.stdout,
    terminal: false,
  });

  const gameInfos: GameInfo[] = [];

  readInterface.on("line", (line) => {
    // For each game, evaluate the subsets
    // Lines are in format: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"

    const regex = /Game (?<gameId>\d+): (?<subsets>.*)*/g;
    const matches = regex.exec(line);

    // Split the subsets by semicolon and trim whitespace
    const subsets = matches?.groups?.subsets
      .split(";")
      .map((subset) => subset.trim());

    const gameId = matches?.groups?.gameId;
    if (!gameId) throw new Error("No game ID found");

    let gameInfo: GameInfo = {
      id: gameId,
      requiredRed: 0,
      requiredGreen: 0,
      requiredBlue: 0,
    };
    // For each subset, get the count of red, green, and blue

    const subsetRegex = /(?<count>\d+)\s+(?<color>red|green|blue)/; // Run this on the comma split element of each subset

    subsets?.forEach((subset) => {
      const coloredCubeGroups = subset.split(",").map((cube) => cube.trim());

      coloredCubeGroups.forEach((group) => {
        const match = subsetRegex.exec(group);
        const [color, count] = [match?.groups?.color, match?.groups?.count];

        console.log(group);
        if (typeof color === "undefined" || typeof count === "undefined") {
          throw new Error("No color or count found");
        }

        const parsedCount = parseInt(count);
        if (isNaN(parsedCount)) {
          throw new Error("Count is not a number");
        }

        switch (color) {
          case "red": {
            gameInfo.requiredRed =
              typeof gameInfo.requiredRed === "undefined"
                ? parsedCount
                : Math.max(gameInfo.requiredRed, parsedCount);
            return;
          }
          case "green": {
            gameInfo.requiredGreen =
              typeof gameInfo.requiredGreen === "undefined"
                ? parsedCount
                : Math.max(gameInfo.requiredGreen, parsedCount);
            return;
          }
          case "blue": {
            gameInfo.requiredBlue =
              typeof gameInfo.requiredBlue === "undefined"
                ? parsedCount
                : Math.max(gameInfo.requiredBlue, parsedCount);
            return;
          }

          default: {
            throw new Error("Invalid color");
          }
        }
      });
    });

    gameInfos.push(gameInfo);
  });

  readInterface.on("close", () => {
    // Now we have to find the sum of the powers of each game. We already have the minimum required for each color from the last part,
    // so we just have to multiply them together
    const sum = gameInfos.reduce((acc, game) => {
      return acc + game.requiredRed * game.requiredGreen * game.requiredBlue;
    }, 0);

    console.log("Sum of Powers: ", sum);
  });
}

solution();
