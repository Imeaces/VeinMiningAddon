"use strict";
class ItemUseSimulator {
    destoryBlockType(type, count = 1) {
    }
    destroyBlock(block, count = 1) {
    }
    destroyBlocks(blocks) {
    }
    useOnBlockType(type, count = 1) {
    }
    operations;
}
var SimulateOperationType;
(function (SimulateOperationType) {
    SimulateOperationType[SimulateOperationType["createItems"] = 0] = "createItems";
    SimulateOperationType[SimulateOperationType["removeBlocks"] = 1] = "removeBlocks";
    SimulateOperationType[SimulateOperationType["createEntities"] = 2] = "createEntities";
    SimulateOperationType[SimulateOperationType["removeEntities"] = 3] = "removeEntities";
    SimulateOperationType[SimulateOperationType["custom"] = 4] = "custom";
    SimulateOperationType[SimulateOperationType["unknown"] = 5] = "unknown";
})(SimulateOperationType || (SimulateOperationType = {}));
class createItemOperation {
    action = SimulateOperationType.createItems;
    items;
    constructor(items) {
        this.items = items;
    }
}
