import { clampStart, nextStart, prevStart, startPositions, wrapIndex } from './carousel-math';

describe('carousel math', () => {
  it.each([
    [1, 11],
    [2, 10],
    [3, 9],
    [4, 8],
  ])(
    'has the right number of start positions for 11 items with %i visible',
    (visible, expected) => {
      expect(startPositions(11, visible)).toBe(expected);
    },
  );

  it('never reports fewer than one position', () => {
    expect(startPositions(2, 4)).toBe(1);
  });

  it('advances one item at a time and wraps from the last position to the first', () => {
    expect(nextStart(0, 11, 3)).toBe(1);
    expect(nextStart(7, 11, 3)).toBe(8);
    expect(nextStart(8, 11, 3)).toBe(0);
  });

  it('goes back one item at a time and wraps from the first position to the last', () => {
    expect(prevStart(5, 11, 3)).toBe(4);
    expect(prevStart(0, 11, 3)).toBe(8);
    expect(prevStart(0, 11, 1)).toBe(10);
  });

  it('clamps a start position when more items become visible', () => {
    expect(clampStart(9, 11, 4)).toBe(7);
    expect(clampStart(-1, 11, 4)).toBe(0);
  });

  it('wraps viewer indexes in both directions', () => {
    expect(wrapIndex(6, 6)).toBe(0);
    expect(wrapIndex(-1, 6)).toBe(5);
  });
});
