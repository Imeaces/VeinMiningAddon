import { Minecraft } from "yoni-mcscripts-lib";
import { VeinBlockChangeType, VeinBlockChange } from "../types";

export class XpLootChange implements VeinBlockChange {
    constructor(xpPoint: number)
    constructor(minXp: number, maxXp: number)
    constructor(minXp: number, maxXp = minXp){
        if (minXp !== maxXp)
            minXp = randomInt(minXp, maxXp);
        this.data = minXp;
    }
    type = VeinBlockChangeType.lootXp;
    data: number;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
