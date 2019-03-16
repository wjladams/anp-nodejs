import { vInit, vNormalize, mId, mInit, mMultVec, mLargestEigen, mSquareAddPos, prefHML} from "../src/util/MathCalcs";

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

test('normalize vector inline', () => {
  let v = [1, 2]
  vNormalize(v)
  expect(v).toEqual([1/3, 2/3])
});

test('mInit', () => {
  let mat12 = mInit(1,2)
  expect(mat12).toEqual([[0, 0]])
})

test('mId', () => {
  let size=3
  let id3 = mId(size)
  expect(id3).toEqual([[1, 0, 0], [0, 1, 0], [0, 0 ,1]])
})

test('normalize vector not inline', () => {
  let v = [1, 2]
  expect(vNormalize(v, false)).toEqual([1/3, 2/3.]);
})

test('mMultVec: multiplying a matrix by a vector', () =>{
  let v = [1, 2]
  let m = [[1, 3], [-2, 4]]
  let mv=mMultVec(m, v)
  
  expect(mv[0]).toBeCloseTo(7, 8)
  expect(mv[1]).toBeCloseTo(6, 8)
})

test('mLargestEigen', () => {
  let m = [[1, 2, 6], [1/2, 1, 3], [1/6, 1/3, 1]]
  let pv = [0.6, 0.3, 0.1]
  let eig = mLargestEigen(m)
  for(let i=0; i<pv.length; i++) {
    expect(eig[i]).toBeCloseTo(pv[i], 7)
  }
  let val = mLargestEigen(m, true)
  expect(val).toBeCloseTo(3, 8)
})

test('Add position to square matrix', ()=> {
  let m = []
  mSquareAddPos(m)
  expect(m).toEqual([[1]])
  mSquareAddPos(m)
  expect(m).toEqual([[1, 0], [0, 1]])
})

test('hmlpref', () => {
  expect(prefHML(0, 0)).toBe(0)
  expect(prefHML(1, 0)).toBeNull()
  expect(prefHML(0, 1)).toBeNull()
  expect(prefHML(11, 12)).toBe(0)
  expect(prefHML(10, 12)).toBe(-1)
  expect(prefHML(15, 12)).toBe(1)
})