/*
export class OreBlockProcessor implements VeinBlockChangeProcessor {
    constructor(){
    }
    dropMappings = new Map<Minecraft.Block, Minecraft.ItemStack[]>(
    );
    getDrops(ore: Minecraft.Block): Minecraft.ItemStack[] {
        return this.dropMappings.get(ore) ?? [];
    }
    changeBlock(ore: Minecraft.Block){
        return ([] as VeinBlockChange[]).concat(
        
            this.getDrops(ore).map(item => {
                return {
                    type: VeinBlockChangeType.lootItem,
                    data: item
                };
            }),
        
        );
    }
}
*/