class ItemUseSimulator {
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
    operations: SimulateOperationEntry[];
    
}

enum SimulateOperationType {
    createItems,
    removeBlocks,
    createEntities,
    removeEntities,
    
    custom,
    unknown,
}

interface SimulateOperation {
    action: SimulateOperationType;
}

interface SimulateResult {
    operations: SimulateOperationEntry[]
}

class createItemOperation {
    action: SimulateOperationType.createItems = SimulateOperationType.createItems;
    items: [Location, Minecraft.ItemStack][];
    constructor(items: [Location, Minecraft.ItemStack][]){
        this.items = items;
    }
}