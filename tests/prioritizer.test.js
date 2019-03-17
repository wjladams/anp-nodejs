import { Prioritizer } from "../src/Prioritizer";


test('bestAltIndex', () => {
    let p = new Prioritizer(3)
    p.direct_data = [0.1, 0.6, 0.2]
    expect(p.bestAltIndex()).toEqual([1, 2])
    p.direct_data = [0.4, 0.401, 0.3]
    expect(p.bestAltIndex()).toEqual([1, 0])
    p.direct_data = [0.1, 0.5, 0.1]
    expect(p.bestAltIndex()).toEqual([1, 2])
})