import { EventListener, Minecraft } from "yoni-mcscripts-lib";
EventListener.register(Minecraft.world.afterEvent.blockBreak, onBlockBreak);

function onBlockBreak(event: Minecraft.BlockAfterEvent){
    const player = EntityBase.getYoniEntity(event.player) as YoniPlayer;
    const location = Location.fromBlock(block);
    const blockType = event.brokenBlockPermutation.type;
    // VeinMining.startVeinMining(player, location, blockType);
}
