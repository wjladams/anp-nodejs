import {mInit, mId, mPairwise, mLargestEigen} from "../src/util/MathCalcs"

export class Pairwise {
    constructor(size) {
        this.size = size
        this.matrix =  mId(size)
        this.alts = []
        for(let i=0; i < size; i++) {
            this.alts[i] = "Alternative "+(i+1)
        }
    }

    set(row, col, val) {
        mPairwise(this.matrix, row, col, val)
    }

    priority() {
        return mLargestEigen(this.matrix)
    }
}