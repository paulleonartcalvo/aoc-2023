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

// Using this as a "input"
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

  readInterface.on("line", function (line) {
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

    // For each subset, get the count of red, green, and blue that is required.
    // Initialize the game info with 0 for each color and then increase the count if it's higher than the current count
    let gameInfo: GameInfo = {
      id: gameId,
      requiredRed: 0,
      requiredGreen: 0,
      requiredBlue: 0,
    };

    const subsetRegex = /(?<count>\d+)\s+(?<color>red|green|blue)/; // Run this on the comma split element of each subset

    // For each subset, get the count of red, green, and blue
    subsets?.forEach((subset) => {
      const coloredCubeGroups = subset.split(",").map((cube) => cube.trim());

      // For each colored cube group, get the color and count
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

        // If the count is higher than the current count, update the count
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

          // If new colors were introduced, we could just add them here

          default: {
            throw new Error("Invalid color");
          }
        }
      });
    });

    gameInfos.push(gameInfo);
  });

  readInterface.on("close", () => {
    // Filter out games that don't have enough cubes
    const possibleGames = gameInfos.filter((gameInfo) => {
      const enoughRed =
        typeof possibleTest.red === "undefined" ||
        gameInfo.requiredRed <= possibleTest.red;

      const enoughGreen =
        typeof possibleTest.green === "undefined" ||
        gameInfo.requiredGreen <= possibleTest.green;

      const enoughBlue =
        typeof possibleTest.blue === "undefined" ||
        gameInfo.requiredBlue <= possibleTest.blue;

      if (!enoughRed)
        console.log(`Not enough red cubes for game ${gameInfo.id}`);
      else if (!enoughGreen)
        console.log(`Not enough green cubes for game ${gameInfo.id}`);
      else if (!enoughBlue)
        console.log(`Not enough blue cubes for game ${gameInfo.id}`);
      return enoughRed && enoughGreen && enoughBlue;
    });

    console.log(
      "Possible game ids: ",
      possibleGames.map((g) => g.id)
    );

    const sum = possibleGames.reduce((acc, game) => {
      return acc + parseInt(game.id);
    }, 0);

    console.log("SUM: ", sum);
  });
}

solution();
