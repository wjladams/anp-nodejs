import { vInit } from "../src/util/MathCalcs";

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

test('makes sure we are not in 1984 (i.e. 2+2 != 5)', () => {
  expect(2 + 2).toBeLessThan(5);
});

test('init vector test', () => {
  let v = vInit(3)
  expect(v.length).toBe(3)
  expect(v).toEqual([0, 0, 0])
  v = vInit(2, 1.4)
  expect(v).toEqual([1.4, 1.4])
});
