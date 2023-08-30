import { Minecraft } from "yoni-mcscripts-lib";
import { VeinContextSet } from "./utils.js";

/*****************************
 ****     Types          *****
 *****************************/

export interface VeinBlockChange {
    type: VeinBlockChangeType
    data: any
}
export interface VeinMiningBlockGetter {
    next(): Minecraft.Block;
    hasNext(): boolean;
}
export interface VeinMiningBlocks {
    next(count: number): Minecraft.Block[];
    hasMore(): boolean;
}
export interface VeinBlockChangeProcessor {
    changeBlock(block: Minecraft.Block, contexts: VeinContextSet): VeinBlockChange[]
}

export enum VeinBlockChangeType {
    replaceBlock,
    removeBlock,
    lootItem,
    lootXp,
}
export interface VeinContext {
    contextData: any
    onChange(change: VeinBlockChange): VeinBlockChange | null;
}

export interface VeinMiningApplier {
     applyChanges(changes: VeinBlockChange[]): void
}

export interface SelfEffecting {
    affectSelf(change?: VeinBlockChange): boolean;
}
