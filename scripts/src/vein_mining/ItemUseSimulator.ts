import { YoniBlock, Minecraft } from "yoni-mcscripts-lib";

export class ItemUseSimulator {
    destoryBlockType(type: Minecraft.BlockType, count = 1){
    }
    destroyBlock(block: YoniBlock, count = 1){
    }
    destroyBlocks(blocks: YoniBlock){
    }
    useOnBlockType(type: Minecraft.BlockType, count = 1){
    }
    useOn(type: Minecraft.EntityType): {
    }
    constructor(player: YoniPlayer, tool: Minecraft.ItemStack){
        this.player = player;
        this.tool = tool;
    }
    isToolExistOnPlayer(): boolean {
    }
    isToolAvailable(): boolean {
    }
    resultOperations: SimulateOperation[];
    successfulOperations: SimulateOperation[];
}

//指定的工具能否执行特定操作？

interface SimulateResult {
    operations: SimulateOperationEntry[]
}


//指定的工具在特定的方块上执行操作时是否有特殊结果？
    //是否生成物品？
    //是否生成实体？
    //是否放置方块？
    //是否移除方块？
    //是否对工具造成影响？

export enum SimulateAffactType {
    createItems,
    removeBlocks,
    createEntities,
    removeEntities,
    
    custom,
    unknown,
}

interface SimulateAffact {
    type: SimulateAffactType;
}

export class CreateItemAffact implements SimulateAffact {
    type: SimulateOperationType.createItems = SimulateOperationType.createItems;
    items: ([Location, Minecraft.ItemStack])[];
    constructor(items: ([Location, Minecraft.ItemStack])[]){
        this.items = items;
    }
}

export class RemoveBlocksAffact implements SimulateAffact {
    type: SimulateOperationType.removeBlocks = SimulateOperationType.removeBlocks;
    blocksLocation: Location[];
}