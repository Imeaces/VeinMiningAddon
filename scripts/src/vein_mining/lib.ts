import { MinecraftSystem } from "yoni-mcscripts-lib";

/*****************************
 ****     Functions     ******
 *****************************/

export class ExecutingTimer {
    constructor(perTickMaxTime: number){
        this.perTickMaxTime = perTickMaxTime;
    }
    perTickMaxTime: number;
    static getCurrentTick(): number {
        return MinecraftSystem.currentTick;
    }
    #handleTick: number = -1;
    #lastQueryTime: number = Date.now();
    #passedTime: number = 0;
    #isHandled = false;
    get isHandled() {
        this.isTimeLimitExceed();
        return this.#isHandled;
    }
    handle(){
        this.unhandle();
        this.#isHandled = true;
    }
    unhandle(){
        if (this.isHandled)
            this.#isHandled = false;
    }
    isTimeLimitExceed(): boolean {
        const now = Date.now();
        if (ExecutingTimer.getCurrentTick() !== this.#handleTick){
            this.#isHandled = false;
            this.#handleTick = ExecutingTimer.getCurrentTick();
            this.#passedTime = 0;
        } else if (this.#isHandled) {
            this.#passedTime += now - this.#lastQueryTime;
        }
        this.#lastQueryTime = now;
        return this.#passedTime > this.perTickMaxTime;
    }
}

export function generatePendingPromise(): { promise: Promise<void>, reject: (result: any) => void, resolve: (err?: unknown) => void } {
    let resolve: (result: any) => void, reject: (e?: unknown) => void;
    let promise: Promise<void> = new Promise((re, rj) => {
        resolve = re;
        reject = rj;
    });
    //@ts-ignore 这是基于Promise对象会在创建时就运行传入的函数而实现的
    return { promise, reject, resolve };
}

export async function idle(time: number = 1){
    const { resolve, promise } = generatePendingPromise();
    MinecraftSystem.runTimeout(() => void resolve(), Math.max(0, time));
    await promise;
}