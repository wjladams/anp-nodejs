
export function vInit(size, def_val=0) {
    let rval = []
    for(i=0; i < size; i++)
        rval.push(def_val)
    return rval
}

export function vNormalize(vec, inline=true) {
   let sum = 0
   if (inline) {
       rval = vec
   } else {
       rval = vInit(vec.length)
   }

   for(let i=0; i < vec.length; i++) {
       sum += vec[i]
   }
   if (sum != 0) {
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
