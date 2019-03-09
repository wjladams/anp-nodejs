import {mInit, mId, mPairwise, mLargestEigen, mSquareAddPos} from "../src/util/MathCalcs"
import { Prioritizer } from "./Prioritizer";

export class Pairwise extends Prioritizer {
    constructor(size) {
        super(size)
        this.matrix =  mId(size)
    }

    set(row, col, val) {
        let rrow = this.indexOf(row)
        let rcol = this.indexOf(col)
        mPairwise(this.matrix, rrow, rcol, val)
    }

    addAlt(name) {
        super.addAlt(name)
        mSquareAddPos(this.matrix)
    }

    priority() {
        return mLargestEigen(this.matrix)
    }
}