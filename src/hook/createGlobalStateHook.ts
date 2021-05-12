import { useState, useEffect } from "react";

/**
 * 非常轻量级别的跨组件共享状态hook
 * 基于TS 提示友好 符合原生useState的使用直觉
 * 详细示例请看 App.tsx
 * @param initState 支持函数式懒初始化
 */

export default function createGlobalStateHook<S>(initState: S) {
  type InnerS = S extends () => any ? ReturnType<S> : S;
  const moduleName = Symbol();
  const eventsMap = new Map<Symbol, Array<(s: InnerS) => void>>();

  function isFunc(func: any): func is (s: InnerS) => InnerS {
    return typeof func === "function";
  }

  function invokeEvent(s: InnerS) {
    const events = eventsMap.get(moduleName);
    events && events.forEach((event) => event(s));
  }

  function useGlobalState() {
    const initS = typeof initState === "function" ? initState() : initState;
    const [state, setState] = useState<InnerS>(initS);

    useEffect(() => {
      if (eventsMap.get(moduleName)) {
        eventsMap.get(moduleName)?.push(setState);
      } else {
        eventsMap.set(moduleName, [setState]);
      }
      return () => {
        eventsMap.delete(moduleName);
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
