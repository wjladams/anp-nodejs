import {Pairwise} from "../src/Pairwise"

test('constructor', () => {
    let pw = new Pairwise(3)
    expect(pw.size).toEqual(3)
    expect(pw.matrix).toEqual([[1,0,0],[0,1,0],[0,0,1]])
})

test('setting', () => {
    let pw = new Pairwise(3)
    pw.set(0, 1, 2)
    expect(pw.matrix).toEqual([[1, 2, 0], [1/2, 1, 0],[0, 0,1]])
    expect(() => {
        pw.set(0, 0, 2)
    }).toThrow()
})

test('priority', () => {
    let pw = new Pairwise(3)
    pw.set(0, 1, 2)
    pw.set(1,2, 3)
    pw.set(0, 2, 6)
    expect(pw.matrix).toEqual([[1, 2, 6], [1/2, 1, 3],[1/6, 1/3,1]])
    let expected=[0.6, 0.3, 0.1]
    let calcd = pw.priority()
    for(let i=0; i < expected.length; i++) {
        expect(calcd[i]).toBeCloseTo(expected[i], 8)
    }
})