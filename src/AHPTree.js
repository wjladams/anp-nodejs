import { Pairwise } from "./Pairwise";
import { vInit } from "./util/MathCalcs";

export class AHPTreeNode {
    constructor(parentTree, size) {
        this.children = []
        this.childPrioritizer = new Pairwise(0)
        this.altPrioritizer = null
        this.altScores = vInit(size)
        this.parentTree = parentTree
    }

    addChild() {
        this.children.push(new AHPTreeNode(this.parentTree, this.altScores.length))
        this.childPrioritizer.addAlt(null)
    }

    addAlt(name) {
        for(var child in this.children) {
            this.child.addAlt(name)
        }
        if (this.altPrioritizer != null) {
            this.altPrioritizer.addAlt(name)
        }
        this.altScores.push(0)
    }

    nalts() {
        return this.altScores.length
    }

    nkids() {
        return this.children.length
    }

    synthesize() {
        if (this.children.length == 0) {
            //No children, simply return altScores upwards
            return this.altScores
        }
        //Alright, let's synthesize, first I need to zero out the scores
        let nalts = this.altScores.length
        for(let i=0; i < nalts; i++) {
            this.altScores[i] = 0
        }
        //Now let's synthesize each child
        let childScores = this.childPrioritizer.priority()
        for(let i=0; i < this.children.length; i++) {
            let vals = this.children[i].synthesize()
            for(let alt=0; alt < nalts; alt++) {
                this.altScores[alt] += childScores[i] * vals[alt]
            }
        }
        return this.altScores
    }
}