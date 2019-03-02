
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