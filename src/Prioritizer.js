import { vNormalize } from "./util/MathCalcs";


export class Prioritizer {
    constructor(size) {
        this.size = size
        this.alts = []
        this.direct_data = []
        for(let i=0; i < size; i++) {
            this.alts[i] = "Alternative "+(i+1)
            this.direct_data[i] = 0
        }
    }

    setdirect(position, value) {
        this.direct_data[position] = value
    }

    firstFreeName() {
        for(let i=1; i < this.alts.length+2; i++) {
            let name = "Alternative "+i 
            if (!this.alts.includes(name)) {
                return name
            }
        }
        throw "Could not find a free name, this makes no sense"
    }

    addAlt(name) {
        this.size += 1
        if (name == null) {
            name = this.firstFreeName()
        }
        this.alts.push(name)
        this.direct_data.push(0)
    }

    priority() {
        return vNormalize(this.direct_data)
    }

    indexOf(alt) {
        if (Number.isInteger(alt)) {
            //We are asking the index of something already an index, just return that
            return alt
        } else {
            let rval = this.alts.indexOf(alt)
            return rval
        }
    }
}