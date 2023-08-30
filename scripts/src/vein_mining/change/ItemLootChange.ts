import { Minecraft } from "yoni-mcscripts-lib";
import { VeinBlockChangeType, VeinBlockChange } from "../types";

export class ItemLootChange implements VeinBlockChange {
    constructor(item: string | Minecraft.ItemType | Minecraft.ItemStack, multiply?: number){
        this.data = new ItemLootChangeData(item instanceof Minecraft.ItemStack ? item : new Minecraft.ItemStack(item));
        if (multiply)
            this.data.multiplyCount = multiply;
    }
    type = VeinBlockChangeType.lootItem;
    data: ItemLootChangeData;
}

export class ItemLootChangeData {
    constructor(item: Minecraft.ItemStack){
        this.item = item;
    }
    multiplyCount: number = 1;
    item: Minecraft.ItemStack
    getFinalItems(): Minecraft.ItemStack[] {
        return new Array(this.multiplyCount).fill(this.item);
    }
}