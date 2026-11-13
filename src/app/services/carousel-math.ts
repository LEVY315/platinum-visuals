// Pure position logic for a carousel that shows `visible` items and moves one item per step.

/** Number of distinct starting positions, e.g. 11 items with 3 visible → 9. */
export function startPositions(total: number, visible: number): number {
  return Math.max(1, total - Math.max(1, visible) + 1);
}

export function clampStart(index: number, total: number, visible: number): number {
  return Math.min(Math.max(0, index), startPositions(total, visible) - 1);
}

/** Next start position; wraps from the last position back to the first. */
export function nextStart(current: number, total: number, visible: number): number {
  const count = startPositions(total, visible);
  return current >= count - 1 ? 0 : current + 1;
}

/** Previous start position; wraps from the first position to the last. */
export function prevStart(current: number, total: number, visible: number): number {
  const count = startPositions(total, visible);
  return current <= 0 ? count - 1 : Math.min(current - 1, count - 1);
}

/** Wrapping index for a simple one-at-a-time viewer. */
export function wrapIndex(index: number, length: number): number {
  return length === 0 ? 0 : ((index % length) + length) % length;
}
