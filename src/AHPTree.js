import { Pairwise } from "./Pairwise";
import { vInit } from "./util/MathCalcs";
import { Prioritizer } from "./Prioritizer";

export class AHPTreeNode extends Prioritizer {
    constructor(parentNode, size) {
        super(size)
        this.children = []
        this.childPrioritizer = new Pairwise(0)
        //this.altPrioritizer = null
        this.parentNode = parentNode
    }

    addChild() {
        let rval = new AHPTreeNode(this.parentNode, this.alts.length)
        this.children.push(rval)
        this.childPrioritizer.addAlt(null)
        return rval
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


    nkids() {
        return this.children.length
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
            size = nalts
        } else {
            //We are the first parent, so we have alt_names
            size = obj.alt_names.length
        }
        let rval = new AHPTreeNode(parentNode, size)

        // Do much more stuff
        return rval
    }
}