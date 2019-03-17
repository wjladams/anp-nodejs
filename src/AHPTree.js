import { Pairwise } from "./Pairwise";
import { vInit } from "./util/MathCalcs";
import { Prioritizer } from "./Prioritizer";

export class AHPTreeNode extends Prioritizer {
    constructor(parentNode, size, name=null) {
        super(size)
        this.children = []
        this.name = name
        this.childPrioritizer = new Pairwise(0)
        //this.altPrioritizer = null
        this.parentNode = parentNode
    }

    addChild(childNode=null) {
        if (childNode == null) {
            childNode = new AHPTreeNode(this.parentNode, this.alts.length)
        }
        this.children.push(childNode)
        this.childPrioritizer.addAlt(null)
        return childNode
    }

    pairwise(child1, child2, value) {
        this.childPrioritizer.set(child1, child2, value)
    }

    setAltScore(alt, score) {
        if (Number.isInteger(alt)) {
            //We were passed the alternative as an integer position
            if (alt < 0) {
                throw "Alt index cannot be negative"
            } else if (alt >= this.nalts()) {
                throw "Alt index cannot be larger than the number of alternatives"
            }
            this.direct_data[alt] = score
        } else {
            //For now we do not allow non-integer refs to alternatives
            throw "Alternative must be indexed by position"
        }
    }

    addAlt(name) {
        super.addAlt(name)
        for(var child in this.children) {
            this.child.addAlt(name)
        }
        if (this.altPrioritizer != null) {
            this.altPrioritizer.addAlt(name)
        }
    }


    nchildren() {
        return this.children.length
    }

    childrenNames() {
        if (this.children == null) {
            return null
        } else if (this.children.length == 0) {
            return []
        } else {
            let rval = []
            for(let i=0; i < this.children.length; i++) {
                rval.push(this.children[i].name)
            }
            return rval
        }
    }

    synthesize() {
        if (this.children.length == 0) {
            //No children, simply return altScores upwards
            return this.direct_data
        }
        //Alright, let's synthesize, first I need to zero out the scores
        let nalts = this.direct_data.length
        for(let i=0; i < nalts; i++) {
            this.direct_data[i] = 0
        }
        //Now let's synthesize each child
        let childScores = this.childPrioritizer.priority()
        for(let i=0; i < this.children.length; i++) {
            let vals = this.children[i].synthesize()
            for(let alt=0; alt < nalts; alt++) {
                this.direct_data[alt] += childScores[i] * vals[alt]
            }
        }
        return this.direct_data
    }

    static fromJSONObject(obj, parentNode) {
        let size = 0
        if (parentNode != null) {
            //Get the size from the parent
            size = parentNode.nalts()
        } else {
            //We are the first parent, so we have alt_names
            size = obj.alt_names.length
        }
        let rval = new AHPTreeNode(parentNode, size, obj.name)

        if (parentNode != null) {
            //We have a parent node, we should use their alternative names
            rval.alts = parentNode.alts
        } else {
            //We need alt names from the object
            rval.alts = obj.alt_names
        }
        // Get children
        if (obj.children != null) {
            for (let i=0; i < obj.children.length; i++) {
                let kid = AHPTreeNode.fromJSONObject(obj.children[i], rval)
                rval.addChild(kid)
            }
            //Bottom level ones should probably have a pairwise matrix
            if (obj.pairwise == null) {
                throw "We need a pairwise matrix for node "+obj.name
            } else {
                let nkids = obj.children.length
                for (let row=0; row < nkids; row++) {
                    for (let col=0; col < nkids; col++) {
                        if (row != col) {
                            let val = obj.pairwise[row][col]
                            if (val >= 1) {
                                //Only set for values >= 1, the others are reciprocals
                                rval.childPrioritizer.set(row, col, val)
                            }
                        }
                    }
                }
            }
        } else {
            //Bottom level alts can have scores
            if (obj.alt_scores != null) {
                if (obj.alt_scores.length != rval.nalts()) {
                    throw "Alt scores of wrong length"
                }
                rval.direct_data = obj.alt_scores
            }
        }
        return rval
    }
}