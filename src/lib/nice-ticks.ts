const NICE_STEP_FACTORS = [1, 2, 2.5, 5, 10];
const DEFAULT_TICK_COUNT = 4;

/** Các mốc chia trục tròn số (0, 50 N, 100 N…) vừa đủ bao giá trị lớn nhất. */
export function buildNiceTicks(
  maxValue: number,
  tickCount: number = DEFAULT_TICK_COUNT,
): number[] {
  if (maxValue <= 0) {
    return [0];
  }

  const roughStep = maxValue / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const factor =
    NICE_STEP_FACTORS.find((candidate) => candidate * magnitude >= roughStep) ??
    10;
  const step = factor * magnitude;
  const stepCount = Math.ceil(maxValue / step);

  return Array.from({ length: stepCount + 1 }, (_, index) => index * step);
}
