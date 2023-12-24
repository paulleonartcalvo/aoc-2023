import fs from "fs";
import readline from "readline";

type Range = { min: number; max: number };
type RangePair = { source: Range; dest: Range };
type ResourceMaps = Record<
  string,
  | {
      desination: string;
      rangePairs: RangePair[];
    }
  | undefined
>;
/**
 *
 * @param num The number to check
 * @param min The start of the range (inclusive)
 * @param max The end of the range (exclusive)
 * @returns Whether the number is within the range
 */
function isWithinRange(num: number, min: number, max: number) {
  return num >= min && num < max;
}

function getRangeIntersection(
  left: { max: number; min: number },
  right: { max: number; min: number }
): { max: number; min: number } | undefined {
  if (left.min >= right.max || right.min >= left.max) return undefined;

  return {
    min: Math.max(left.min, right.min),
    max: Math.min(left.max, right.max),
  };
}

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
  const maps: ResourceMaps = {};
  let currSource: string | undefined = undefined;
  let currDest: string | undefined = undefined;

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
    } else if (line.endsWith("map:")) {
      console.log("Map title line");
      const sourceDestRegex = /(?<sourceName>.+)-to-(?<destName>.+)\smap:/;

      const { sourceName, destName } = sourceDestRegex.exec(line)?.groups ?? {};
      if (
        typeof sourceName === "undefined" ||
        typeof destName === "undefined"
      ) {
        console.log(line);
        throw new Error("Source or destination name is undefined");
      }

      console.log(`Source: ${sourceName}, Destination: ${destName}`);

      currSource = sourceName;
      currDest = destName;
    } else if (line.length === 0) {
      // Empty line
      console.log("Empty line");
    } else {
      // Number map line
      if (typeof currSource === "undefined" || typeof currDest === "undefined")
        throw new Error("Source or destination is undefined");

      const sourceDestRangeRegex =
        /(?<sourceRangeStart>\d+)\s+(?<destRangeStart>\d+)\s+(?<rangeLength>\d+)/;

      const { sourceRangeStart, destRangeStart, rangeLength } =
        sourceDestRangeRegex.exec(line)?.groups ?? {};

      if (
        typeof sourceRangeStart === "undefined" ||
        typeof destRangeStart === "undefined" ||
        typeof rangeLength === "undefined"
      ) {
        console.log(line);
        throw new Error("Source or destination range is undefined");
      }

      if (typeof maps[currSource] === "undefined") {
        maps[currSource] = {
          desination: currDest,
          rangePairs: [],
        };
      }

      const parsedRangeLength = parseInt(rangeLength);

      if (isNaN(parsedRangeLength)) {
        console.log(line);
        throw new Error("Range length is not a number");
      }

      maps[currSource]?.rangePairs.push({
        source: {
          min: parseInt(sourceRangeStart),
          max: parseInt(sourceRangeStart) + parsedRangeLength,
        },
        dest: {
          min: parseInt(destRangeStart),
          max: parseInt(destRangeStart) + parsedRangeLength,
        },
      });
    }

    lineIndex++;
  });

  readInterface.on("close", () => {
    const startSource = "seed";
    const endDestination = "location";

    const startSourceRanges = maps[startSource]?.rangePairs
      .map(({ source }) => source)
      .filter(({ min, max }) =>
        seedNumbers.some((num) => isWithinRange(num, min, max))
      );

    if (typeof startSourceRanges === "undefined") {
      throw new Error("Start source ranges is undefined");
    }

    traverseMaps(maps, startSource, startSourceRanges);
  });
}

function traverseMaps(
  maps: ResourceMaps,
  sourceKey: string,
  finalDestinationKey: string,
  validSourceRanges?: Range[]
) {
  const mapValue = maps[sourceKey];

  if (typeof mapValue === "undefined") return;

  let compatibleRanges: RangePair[] = [];

  if (typeof validSourceRanges !== "undefined") {
    compatibleRanges = mapValue.rangePairs.filter(({ source }) =>
      validSourceRanges.some(
        (range) => typeof getRangeIntersection(range, source) !== "undefined"
      )
    );
  } else {
    compatibleRanges = mapValue.rangePairs;
  }

  const destRanges = compatibleRanges.map(({ dest }) => dest);

  console.log(`${sourceKey} -> ${mapValue.desination}`);
  console.log(
    `${sourceKey} compatible with: ${compatibleRanges.length} ranges`
  );

  if (destRanges.length === 0) {
    console.log(`No compatible destination ranges for ${sourceKey}`);
  }

  const destination = mapValue.desination;

  if (destination === finalDestinationKey) {
    console.log(`Found final destination: ${destination}`);

    const smallestValuePossible = destRanges.reduce((acc, curr) => {
      if (curr.min < acc) return curr.min;

      return acc;
    }, destRanges[0].min);
  }

  return traverseMaps(maps, destination, finalDestinationKey, destRanges);
}

// /**
//  * If a range is contained within another range, remove the contained range
//  * @param ranges
//  */
// function simplifyRanges(ranges: Range[]) {

//   for (let i = 0; i < ranges.length; i++) {
//     const currRange = ranges[i];

//     for (let j = 0; j < ranges.length; j++) {
//       if (i === j) continue;

//       const otherRange = ranges[j];

//       if (isWithinRange(currRange.min, otherRange.min, otherRange.max - otherRange.min)) {
//         ranges.splice(i, 1);
//         i--;
//         break;
//       }
//     }
//   }

// }

solution();
