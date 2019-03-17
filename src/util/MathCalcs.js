
export function vInit(size, def_val=0) {
    let rval = []
    for(let i=0; i < size; i++)
        rval.push(def_val)
    return rval
}

export function mId(size) {
    let rval = mInit(size, size)
    for(let p=0; p < size; p++) {
        rval[p][p]=1.0
    }
    return rval
}

export function mInit(rows, cols, init_val=0) {
    let rval = []
    for(let row=0; row < rows; row++) {
        rval[row] = Array(cols)
        for(let col=0; col < cols; col++) {
            rval[row][col]=init_val
        }
    }
    return rval;
}

export function mPairwise(mat, row, col, val) {
    if (row == col) {
        //We cannot pairwise row == col
        throw "Row cannot equal column for pairwise exception"
    }
    if (val == 0) {
        mat[row][col]=0
        mat[col][row]=0
    } else {
        mat[row][col]=val
        mat[col][row]=1.0/val
    }
}

export function mMultVec(mat, vec) {
    let nrows = mat.length
    let ncols = mat[0].length
    let rval = vInit(nrows)
    if (vec.length != ncols) {
        throw "Array dimension mismatch"
    }
    for(let row=0; row < nrows; row++) {
        rval[row] = 0
        for(let col=0; col < ncols; col++) {
            rval[row]+=mat[row][col] * vec[col]
        }
    }
    return rval
}

export function vSum(v) {
    let rval = 0
    for(let i=0; i < v.length; i++) {
        rval += v[i]
    }
    return rval
}

export function vDist(v1, v2) {
    let rval = 0
    let diff = 0
    let size = Math.min(v1.length, v2.length)
    for(let i=0; i < size; i++) {
        diff = Math.abs(v1[i] - v2[i])
        if (diff > rval) {
            rval = diff
        }
    }
    return rval
}

export function mLargestEigen(mat, return_val=false, error=1e-10, maxcount=10000) {
    if ((mat == null) || (mat.length == 0)) {
        return []
    }
    let v1 = vInit(mat.length, 1.0/mat.length)
    for(let i=0; i<maxcount; i++) {
        let v2 = mMultVec(mat, v1)
        vNormalize(v2, true)
        let myerr = vDist(v1, v2)
        if (myerr < error) {
            if (return_val) {
                v2 = mMultVec(mat, v2)
                return vSum(v2)
            } else {
                return v2
            }
        }
        v1 = v2
    }
    throw "Convergence Exception"
}
export function vNormalize(vec, inline=true) {
   let sum = 0
   let rval = null
   if (inline) {
       rval = vec
   } else {
       rval = vInit(vec.length)
   }

   for(let i=0; i < vec.length; i++) {
       sum += vec[i]
   }
   if (sum != 0.0) {
       for(let i=0; i < vec.length; i++) {
           rval[i] = vec[i] / sum
       }
   }
   if (inline) {
       return
   } else {
       return rval
   }
}

export function mSquareAddPos(mat) {
    let size = mat.length
    let newRow = []
    for(let i=0; i < size; i++) {
        newRow.push(0)
        mat[i].push(0)
    }
    newRow.push(1)
    mat.push(newRow)
}

/**
 * Returns -2, -1, 0, 1, 2 describing how much better val1 is than val2
 * -2 means val1 is much worse than val1
 * -1 means val1 is worse than val1
 * 0 means val1 is approximately equal to val1
 * 1 means val1 is better than val1
 * 2 means val1 is much better than val1
 * @param {*} val1 
 * @param {*} val2 
 */
export function prefHML(val1, val2, lowCutoff=1.1, medCutoff=2.1) {
    if (val1 == 0) {
        if (val2 == 0) {
            return 0
        } else {
            //val1=0 and val2!=0
            //they are not comparable
            return null
        }
    } else if (val2 == 0) {
        //val2=0 and val1!=0
        //not comparable
        return null
    } else {
        let ratio = Math.abs(val1 / val2)
        if (ratio < 1/medCutoff) {
            //val1 is much worse than val2
            return -2
        } else if (ratio < 1/lowCutoff) {
            //val1 is worse than val2
            return -1
        } else if (ratio < lowCutoff) {
            //val1 is approx the same as val2
            return 0
        } else if (ratio < medCutoff) {
            //val1 is better than val2
            return 1
        } else {
            //val1 is much better than val2
            return 2
        }
    }
}

/**
 * Returns a list of 2 items.  The first item is the index of the best
 * alternative (if there is a tie, it returns the first index that was
 * maximum).  The second thing it returns is the strength of that "best"
 * 0=essentially the same as the 2nd best
 * 1=somewhat better than the 2nd best
 * 2=much better than the 2nd best
 */
export function bestHMLIndex(priority) {
    let nalts = priority.length
    if (nalts == 0) {
        return null
    } else if (nalts == 1) {
        return [0, 0]
    }
    //Okay we handled the edge cases, now let's look
    //for the best and second best index
    let bestIndex=0
    let bestValue=priority[0]
    let secondIndex=1
    let secondValue=priority[1]
    for(let i=1; i < priority.length; i++) {
        if (priority[i] > bestValue) {
            secondIndex = bestIndex
            secondValue = bestValue
            bestIndex = i
            bestValue = priority[i]
        }
    }
    let pref = prefHML(bestValue, secondValue)
    return [bestIndex, pref]
}
