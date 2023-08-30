import { VeinMiningBlocks, VeinBlockChange, VeinMiningApplier, SelfEffecting, VeinBlockChangeProcessor } from "./types.js";
import { Minecraft } from "yoni-mcscripts-lib";
import { VeinMiningError, VeinMiningBlocksTimeOptimizedIterator, VeinContextSet } from "./utils.js";

/*****************************
 ********     Main     ******
 *****************************/

/**
 * 用于处理改变一系列方块的操作。
 */
export class VeinMining {
    veinBlocks: VeinMiningBlocks = null as any;
    blockChanger: VeinBlockChangeProcessor = null as any;
    contexts: VeinContextSet = null as any;
    selfEffects: SelfEffecting = null as any;
    changeApplier: VeinMiningApplier = null as any;
    async runAsync(){
        const veinBlocksIterator = new VeinMiningBlocksTimeOptimizedIterator(this.veinBlocks, 100, 8);
        
        for await (const veinBlocks of veinBlocksIterator)
        for (const block of veinBlocks){
            let changes = this.blockChanger.changeBlock(block, this.contexts);
            let modifiedChanges = [];
            
            ChangeContextResolveing:
            for (let change of changes){
                for (const context of this.contexts){
                    change = context.onChange(change) as VeinBlockChange;
                    if (change == null)
                        continue ChangeContextResolveing;
                }
                modifiedChanges.push(change);
            }
            
            if (this.selfEffects.affectSelf())
                this.changeApplier.applyChanges(modifiedChanges);
            else
                throw new VeinMiningError("Self Effect Failed");
        }
    }
}
