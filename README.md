# React Create Global State Hook

> 超轻量级别的自定义 hook,实现跨组件共享 state,无需借助 Context Api,基于事件,基于 TypeScript,只能推到，友好提示,符合原生 useState 的使用直觉


使用示例：

```tsx
import React, { useState } from "react";
import "./App.css";
import createGlobalStateHook from "./hook/createGlobalStateHook";

interface IAppState {
  count: number;
}

const useAppCount = createGlobalStateHook<IAppState>({ count: 0 });

const useChild1Count = createGlobalStateHook<number>(10);

const useChild2Count = createGlobalStateHook<number>(0);

// 父组件
function App() {
  const [appCount] = useAppCount();
  const [child1, setChild1Count] = useChild1Count();
  const [hide, setHide] = useState(false);
  return (
    <div className="App">
      <h1>Parent {appCount.count}</h1>
      <button
        onClick={() => {
          setChild1Count((s) => s + 1);
        }}
      >
        setChild1Count
      </button>
      <div>child1:{child1}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        {!hide && <Child1 />}
        <Child1 />
        <Child2 />
        {!hide && <Child2 />}
      </div>
      <button onClick={() => setHide(!hide)}>hide</button>
    </div>
  );
}
// 子组件1
function Child1() {
  const [appCount, setAppCount] = useAppCount();
  const [child1] = useChild1Count();
  const [child2, setChild2Count] = useChild2Count();

  return (
    <div style={{ flex: 1, backgroundColor: "yellow", color: "red" }}>
      <h2>appCount： {appCount.count}</h2>
      <h2>Child1</h2>
      <h2>Child2: {child2}</h2>
      <button
        onClick={() => {
          setAppCount(() => ({ count: Date.now() }));
        }}
      >
        setParentCount {child1}
      </button>
      <button
        onClick={() => {
          setChild2Count((s) => s + 1);
        }}
      >
        setChild2Count
      </button>
    </div>
  );
}
// 子组件2
function Child2() {
  const [count2] = useChild2Count();
  return (
    <div style={{ flex: 1, backgroundColor: "green", color: "#fff" }}>
      <h2>Child2</h2> <label style={{ fontSize: 40 }}>{count2}</label>
    </div>
  );
}

export default App;
```
