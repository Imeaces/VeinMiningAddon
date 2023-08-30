import { VeinBlockChangeProcessor } from "../types.js";
import { Minecraft } from "yoni-mcscripts-lib";
import { XpLootChange } from "../change/XpLootChange.js";
import { ItemLootChange } from "../change/ItemLootChange.js";

export class OreBlockProcessor implements VeinBlockChangeProcessor {
    constructor(){
    }
    changeBlock(ore: Minecraft.Block){
        return getChanges(ore);
    }
}


const resultGenerators = new Map<string, () => (ItemLootChange|XpLootChange)[]>;

function getChanges(ore: Minecraft.Block): (ItemLootChange|XpLootChange)[] {
    
    if (resultGenerators.has(ore.typeId))
        return resultGenerators.get(ore.typeId)?.() as (ItemLootChange|XpLootChange)[]
    
    return [];
}

resultGenerators.set("minecraft:deepslate_redstone_ore", getRedstoreOne);
resultGenerators.set("minecraft:lit_deepslate_redstone_ore", getRedstoreOne);
resultGenerators.set("minecraft:redstone_ore", getRedstoreOne);
resultGenerators.set("minecraft:lit_redstone_ore", getRedstoreOne);
function getRedstoreOne(){
    return [
        new ItemLootChange(new Minecraft.ItemStack("minecraft:redstone", randomInt(4, 5))),
        new XpLootChange(1, 5)
    ];
}

resultGenerators.set("minecraft:lapis_ore", getLapisOre);
resultGenerators.set("minecraft:deepslate_lapis_ore", getLapisOre);
function getLapisOre(){
    return [
        new ItemLootChange(new Minecraft.ItemStack("minecraft:lapis_lazuli", randomInt(5, 9))),
        new XpLootChange(2, 5)
    ];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
