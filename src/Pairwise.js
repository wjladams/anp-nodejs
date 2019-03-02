import {mInit, mId, mPairwise, mLargestEigen, mSquareAddPos} from "../src/util/MathCalcs"
import { Prioritizer } from "./Prioritizer";

export class Pairwise extends Prioritizer {
    constructor(size) {
        super(size)
        this.matrix =  mId(size)
    }

    set(row, col, val) {
        mPairwise(this.matrix, row, col, val)
    }

    addAlt(name) {
        super.addAlt(name)
        mSquareAddPos(this.matrix)
    }

    priority() {
        return mLargestEigen(this.matrix)
    }
}