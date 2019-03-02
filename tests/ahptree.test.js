import { AHPTreeNode } from "../src/AHPTree";

test('basic node construction', () => {
    let node = new AHPTreeNode(null, 0)
    node.addAlt("alt 0")
    expect(node.nalts()).toEqual(1)
    node.addAlt("alt 2")
    expect(node.nalts()).toEqual(2)
    node.addChild()
    expect(node.nkids()).toEqual(1)
    node.addChild()
    expect(node.nkids()).toEqual(2)
    let vals = node.synthesize()
    expect(vals).toEqual([0, 0])
})