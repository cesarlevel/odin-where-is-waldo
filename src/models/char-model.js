export class CharModel {
    constructor(
        {
            description = null,
            name = null,
            pos = [],
            found = false
        } = {}) {
        this.description = description;
        this.name = name;
        this.pos = pos;
        this.found = found;
    }
}