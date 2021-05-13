import { useState, useEffect } from "react";

function genEventsMap<S>(): Map<Symbol, Array<(s: S) => void>> {
    return new Map<Symbol, Array<(s: S) => void>>();
}
let eventsMap: Map<Symbol, Array<(s: any) => void>>;

/**
 * judge func is a Function
 * @param func
 */
function isFunc<InnerS>(func: any): func is (s: InnerS) => InnerS {
    return typeof func === "function";
}
/**
 * invoke events to modify state
 * @param s
 * @param moduleName
 */
function invokeEvent<InnerS>(s: InnerS, moduleName: Symbol) {
    const events = eventsMap.get(moduleName);
    events && events.forEach((event) => event(s));
}

/**
 * Ultra-lightweight cross-component shared state hook function
 * Based on Typecsript, friendly prompts, in line with the intuition of native useState
 * Use examples to view App.tsx
 * @param initState Support functional lazy initialization state
 */
export default function createGlobalStateHook<S>(initState: S) {
    type InnerS = S extends () => any ? ReturnType<S> : S;
    const moduleName = Symbol();

    if (!eventsMap) {
        eventsMap = genEventsMap<S>();
    }

    const initS = typeof initState === "function" ? initState() : initState;
    let __s__; // avoid untimely synchronizing data

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
            const _s = isFunc<InnerS>(s) ? s(state) : s;
            invokeEvent(_s, moduleName);
        };

        return [state, updateState] as [typeof state, typeof updateState];
    }

    return useGlobalState;
}
