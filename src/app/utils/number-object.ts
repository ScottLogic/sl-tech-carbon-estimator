export type NumberObject = { [s: string]: number };

export function sumValues(input: NumberObject): number {
  return Object.values(input).reduce((prev, curr) => prev + curr);
}

export function multiplyValues<T extends NumberObject>(input: T, factor: number): T {
  const result: NumberObject = {};
  for (const [key, value] of Object.entries(input)) {
    result[key] = value * factor;
  }
  return result as T;
}
