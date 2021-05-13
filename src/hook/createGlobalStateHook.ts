import { useState, useEffect } from "react";

/**
 * 非常轻量级别的跨组件共享状态hook
 * 基于TS 提示友好 符合原生useState的使用直觉
 * 详细示例请看 App.tsx
 * @param initState 支持函数式懒初始化
 */

function genEventsMap<S>(): Map<Symbol, Array<(s: S) => void>> {
    return new Map<Symbol, Array<(s: S) => void>>();
}
let eventsMap: Map<Symbol, Array<(s: any) => void>>;

export default function createGlobalStateHook<S>(initState: S) {
    type InnerS = S extends () => any ? ReturnType<S> : S;
    const moduleName = Symbol();

    if (!eventsMap) {
        eventsMap = genEventsMap<S>();
    }

    function isFunc(func: any): func is (s: InnerS) => InnerS {
        return typeof func === "function";
    }

    function invokeEvent(s: InnerS) {
        const events = eventsMap.get(moduleName);
        events && events.forEach((event) => event(s));
    }

    const initS = typeof initState === "function" ? initState() : initState;
    let __s__; // 记录state的引用 在下次调用hook的时候，如果存在实例化过的__s__直接返回此引用即可，不用再次返回initS,避免当组件卸载再次装载后数据同步不及时的问题

    function useGlobalState() {
        const [state, setState] = useState<InnerS>(__s__ || initS);

        __s__ = state;

        useEffect(() => {
            if (!eventsMap.get(moduleName)) {
                eventsMap.set(moduleName, []);
            }

            eventsMap.get(moduleName).push(setState);

            return () => {
                if (eventsMap.get(moduleName)) {
                    const idx = eventsMap
                        .get(moduleName)
                        .findIndex((v) => v === setState);
                    if (idx > -1) {
                        eventsMap.get(moduleName).splice(idx, 1);
                    }
                }

                if (eventsMap.get(moduleName)?.length === 0) {
                    eventsMap.delete(moduleName);
                    __s__ = null;
                }
            };
        }, []);

        const updateState = (s: InnerS | ((s: InnerS) => InnerS)) => {
            const _s = isFunc(s) ? s(state) : s;
            invokeEvent(_s);
        };

        return [state, updateState] as [typeof state, typeof updateState];
    }

    return useGlobalState;
}
