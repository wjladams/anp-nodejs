
export function vNormalize(vec) {
   let sum = 0
   for(let i=0; i < vec.length; i++) {
       sum += vec[i]
   }
   if (sum != 0) {
       for(let i=0; i < vec.length; i++) {
           vec[i] /= sum
       }
   }

   return sum;
}
