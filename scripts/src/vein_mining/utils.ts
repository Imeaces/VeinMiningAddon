import { Minecraft } from "yoni-mcscripts-lib";
import { idle, ExecutingTimer } from "./lib.js";
import { VeinContext, VeinMiningBlocks } from "./types.js";

/*****************************
 ********     Utils     ******
 *****************************/


export class VeinMiningError extends Error {
}

export class VeinMiningToolChangedError extends VeinMiningError {}

export class VeinMiningToolTypeChangedError extends VeinMiningToolChangedError {
    constructor(oldType: Minecraft.ItemType | null, newType: Minecraft.ItemType | null){
        super();
    }
}

/**
 * 用于异步、分时段地遍及 VeinMiningBlocks，使处理连锁采集的过程尽量不对游戏造成过多的卡顿。
 */
export class VeinMiningBlocksTimeOptimizedIterator implements AsyncIterableIterator<Minecraft.Block[]> {
    perTickMaxTimeMs: number;
    timer: ExecutingTimer;
    veinBlocks: VeinMiningBlocks;
    countPerYileds: number;
    constructor(veinBlocks: VeinMiningBlocks, countPerYileds: number, perTickMaxTimeMs: number){
        this.perTickMaxTimeMs = perTickMaxTimeMs;
        this.veinBlocks = veinBlocks;
        this.countPerYileds = countPerYileds;
        this.timer = new ExecutingTimer(this.perTickMaxTimeMs);
    }
    async*[Symbol.asyncIterator](): AsyncIterableIterator<Minecraft.Block[]> {
        //我tm同一个过程写两份代码
        
        do {
            this.timer.handle();
            yield this.veinBlocks.next(this.countPerYileds);
            this.timer.unhandle();
            if (this.timer.isTimeLimitExceed()){
                await idle(1);
                this.countPerYileds = Math.max(VeinMiningBlocksTimeOptimizedIterator.minCountPerYields, this.countPerYileds - VeinMiningBlocksTimeOptimizedIterator.minCountPerYields);
            }
        } while (this.veinBlocks.hasMore());
    }
    #hasCompleted: boolean = false;
    async next(): Promise<IteratorResult<Minecraft.Block[]>> {
        if (this.timer.isHandled)
            this.timer.unhandle();
            
        if (this.timer.isTimeLimitExceed()){
            await idle(1);
            this.countPerYileds = Math.max(VeinMiningBlocksTimeOptimizedIterator.minCountPerYields, this.countPerYileds - VeinMiningBlocksTimeOptimizedIterator.minCountPerYields);
        }
        
        if (!this.#hasCompleted && this.veinBlocks.hasMore()){
            this.timer.handle();
            return { done: false, value: this.veinBlocks.next(this.countPerYileds) };
        }
        
        this.#hasCompleted = true;
        return { done: true, value: undefined };
    }
    static minCountPerYields = 20;
}

export class VeinContextSet {
    constructor(contexts: VeinContext[]){
        this.contexts = contexts;
    }
    [Symbol.iterator](){
        return this.contexts[Symbol.iterator]();
    }
    contexts: VeinContext[]
    hasContextData(data: any): boolean {
        const value = this.contexts.find(c => c.contextData === data);
        if (value != undefined)
            this.#cache = { data, value };
        return value != undefined;
    }
    #cache: undefined | { data: any, value: VeinContext };
    getContextByData(data: any): VeinContext {
        if (this.#cache != undefined){
            const { value, data: data0 } = this.#cache;
            this.#cache = undefined;
            if (data0 === data){
                return value;
            }
        }
        const value = this.contexts.find(c => c.contextData === data);
        if (value == undefined)
            throw new Error("no such context");
        return value;
    }
}
