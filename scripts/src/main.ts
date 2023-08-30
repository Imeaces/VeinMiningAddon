import { LegacyEventListener, Minecraft, EntityBase, Location, YoniPlayer } from "yoni-mcscripts-lib";
LegacyEventListener.register(Minecraft.world.afterEvents.blockBreak, onBlockBreak);

function onBlockBreak(event: Minecraft.BlockBreakAfterEvent){
    const player = EntityBase.getYoniEntity(event.player) as YoniPlayer;
    const location = Location.fromBlock(event.block);
    const blockType = event.brokenBlockPermutation.type;
    // VeinMining.startVeinMining(player, location, blockType);
}
