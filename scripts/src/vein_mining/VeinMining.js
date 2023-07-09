import { EntityBase, Minecraft, runTask, Location, system } from "yoni-mcscripts-lib";
class VeinMining {
    veinBlocks;
    constructor(player, location, option) {
    }
    runVein() {
    }
    getTool() {
    }
    setToolBroken(isBroken) {
    }
    giveBackTool(item) {
    }
    destroyBlocks(blocks) {
    }
    receiveError(err) {
    }
}
class VeinMiningError extends Error {
}
class VeinMiningProcess {
    onComplete(cb) {
    }
    miningData;
    player;
    tool;
}
class VeinMiningExecutorTimer {
    constructor(perTickMaxTime) {
        this.perTickMaxTime = perTickMaxTime;
    }
    perTickMaxTime;
    static getCurrentTick() {
        return system.currentTick;
    }
    #handleTick = -1;
    #lastQueryTime = Date.now();
    #passedTime = 0;
    #isHandled = false;
    handle() {
        if (this.#isHandled)
            this.unhandle();
        if (VeinMiningExecutorTimer.getCurrentTick() !== this.#handleTick) {
            this.#handleTick = VeinMiningExecutorTimer.getCurrentTick();
            this.#passedTime = 0;
        }
        this.#isHandled = true;
        this.#lastQueryTime = Date.now();
    }
    unhandle() {
        if (this.#isHandled)
            this.#passedTime += Date.now() - this.#lastQueryTime;
        this.#isHandled = false;
    }
    isTimeLimitExceed() {
        this.#passedTime += Date.now() - this.#lastQueryTime;
        this.#lastQueryTime = Date.now();
        return this.#passedTime > this.perTickMaxTime;
    }
}
class VeinMiningExecutor {
    constructor(miningData) {
        this.miningData = miningData;
    }
    miningData;
    static timer = new VeinMiningExecutorTimer(6); // only execute 6ms per tick
    async run() {
        try {
            while (this.miningData.veinBlocks.hasMore()) {
                this.continueNext();
                //降低连锁数量以减少tps降低
                if (this.autoModifyMaxCountPerTick)
                    this.maxCountPerTick = Math.max(this.minCountPerTick, this.maxCountPerTick - 20);
                // wait for next ticking
                let { promise, resolve } = VeinMiningExecutor.generatePendingPromise();
                runTask(resolve);
                await promise;
            }
        }
        catch (err) {
            VeinMiningExecutor.timer.unhandle();
            this.miningData.receiveError(err);
        }
    }
    continueNext() {
        VeinMiningExecutor.timer.handle();
        while (this.miningData.veinBlocks.hasMore()) {
            this.destroyVeinBlocks();
            //超时，结束
            if (VeinMiningExecutor.timer.isTimeLimitExceed())
                break;
            //增加连锁数量以提高效率
            if (this.autoModifyMaxCountPerTick)
                this.maxCountPerTick += 20;
        }
        VeinMiningExecutor.timer.unhandle();
    }
    autoModifyMaxCountPerTick = true;
    maxCountPerTick = 200;
    minCountPerTick = 20;
    destroyVeinBlocks() {
        let blocks = this.miningData.veinBlocks.next(this.maxCountPerTick);
        this.miningData.destroyBlocks(blocks);
    }
    static generatePendingPromise() {
        let resolve, reject;
        let promise = new Promise((re, rj) => {
            resolve = re;
            reject = rj;
        });
        //@ts-ignore 这是基于Promise对象会在创建时就运行传入的函数而实现的
        return { promise, reject, resolve };
    }
}
EventListener.register(Minecraft.world.afterEvent.blockBreak, onBlockBreak);
function onBlockBreak(event) {
    const player = EntityBase.getYoniEntity(event.player);
    const location = Location.fromBlock(block);
    const blockType = event.brokenBlockPermutation.type;
    // VeinMining.startVeinMining(player, location, blockType);
}
class CenterAroundVeinBlocks {
    constructor(blockTypes, center) {
        this.detectingBlocks.push(center.getBlock());
        this.blockTypes = blockTypes;
    }
    blockTypes;
    next(count = 10) {
        const { detectingBlocks } = this;
        const blocks = [];
        while (blocks.length < count && detectingBlocks.length > 0) {
            let oneDetectingBlock = detectingBlocks.shift();
            let aroundBlocks = CenterAroundVeinBlocks.getAroundBlocks(oneDetectingBlock);
            let undetectBlocks = aroundBlocks.filter(v => !this.has(v));
            let targetBlocks = undetectBlocks.filter(this.matchBlock);
            blocks.push(...targetBlocks);
            detectingBlocks.push(...targetBlocks);
            undetectBlocks.forEach(this.add.bind(this));
        }
        return blocks;
    }
    matchBlock(block) {
        return this.blockTypes.includes(block.type);
    }
    hasMore() {
        return this.detectingBlocks.length > 0;
    }
    blocksRecord = {};
    add(block) {
        const { blocksRecord } = this;
        const { x, y, z } = block;
        if (!(x in blocksRecord))
            blocksRecord[x] = {};
        if (!(y in blocksRecord[x]))
            blocksRecord[x][y] = [];
        blocksRecord[x][y].push(z);
    }
    has(block) {
        const { blocksRecord } = this;
        const { x, y, z } = block;
        return x in blocksRecord
            && y in blocksRecord[x]
            && blocksRecord[x][y].includes(z);
    }
    static getAroundBlocks(block) {
        return [
            block.location.offset(-1, 0, 0).getBlock(),
            block.location.offset(1, 0, 0).getBlock(),
            block.location.offset(0, -1, 0).getBlock(),
            block.location.offset(0, 1, 0).getBlock(),
            block.location.offset(0, 0, -1).getBlock(),
            block.location.offset(0, 0, 1).getBlock()
        ];
    }
    blocks = [];
    detectingBlocks = [];
}
