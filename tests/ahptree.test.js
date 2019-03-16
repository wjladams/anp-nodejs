import { AHPTreeNode } from "../src/AHPTree";
var fs = require('fs');

test('basic node construction', () => {
    let node = new AHPTreeNode(null, 0)
    node.addAlt("alt 0")
    expect(node.nalts()).toEqual(1)
    node.addAlt("alt 2")
    expect(node.nalts()).toEqual(2)
    node.addChild()
    expect(node.nchildren()).toEqual(1)
    node.addChild()
    expect(node.nchildren()).toEqual(2)
    let vals = node.synthesize()
    expect(vals).toEqual([0, 0])
})

test('simple synthesis', () => {
    let node = new AHPTreeNode(null, 3)
    let c1 = node.addChild()
    let c2 = node.addChild()
    c1.setAltScore(0, 0.7)
    c1.setAltScore(1, 0.5)
    c1.setAltScore(2, 1.0)

    c2.setAltScore(0, 0.1)
    c2.setAltScore(1, 0.4)
    c2.setAltScore(2, 0.8)

    let scores = node.synthesize()
    expect(scores[0]).toBeCloseTo(0.4)
    expect(scores[1]).toBeCloseTo(0.45)
    expect(scores[2]).toBeCloseTo(0.9)
})

test('synthesis with pairwise', () => {
    let node = new AHPTreeNode(null, 3)
    let c1 = node.addChild()
    let c2 = node.addChild()
    c1.setAltScore(0, 0.7)
    c1.setAltScore(1, 0.5)
    c1.setAltScore(2, 1.0)

    c2.setAltScore(0, 0.1)
    c2.setAltScore(1, 0.4)
    c2.setAltScore(2, 0.8)

    node.pairwise(0, 1, 2)

    let scores = node.synthesize()
    expect(scores[0]).toBeCloseTo((2*0.7+1*0.1)/3)
    expect(scores[1]).toBeCloseTo((2*0.5+1*0.4)/3)
    expect(scores[2]).toBeCloseTo((2*1.0 + 1*0.8)/3)
})

test('json parsing', () => {
    var obj = JSON.parse(fs.readFileSync('tests/simple_tree.json', 'utf8'))
    let node = AHPTreeNode.fromJSONObject(obj)
    expect(node).toBeDefined()
    expect(node.nalts()).toEqual(3)
    expect(node.alts[0]).toEqual("alt1")
    expect(node.nchildren()).toEqual(4)
    let kid1 = node.children[0]
    expect(kid1.direct_data).toEqual([1, 0.5, 0.25])
    let childPris = node.childPrioritizer.priority()
    console.log(childPris)
    expect(childPris[0]/childPris[1]).toBeCloseTo(node.childPrioritizer.matrix[0][1])
    expect(childPris[1]/childPris[2]).toBeCloseTo(node.childPrioritizer.matrix[1][2])
    expect(childPris[2]/childPris[3]).toBeCloseTo(node.childPrioritizer.matrix[2][3])
})