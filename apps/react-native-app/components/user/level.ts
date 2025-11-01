// get total level experience needed to reach a level
export function getLevelExp(level: number) {
  if (level <= 10) {
    return Math.round(100 * Math.pow(1.5, level - 1));
  } else {
    return Math.round(100 * Math.pow(1.5, 9) * Math.pow(1.25, level - 10));
  }
}
