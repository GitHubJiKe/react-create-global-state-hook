import React, { useState } from "react";
import "./App.css";
import createGlobalStateHook from "./hook/createGlobalStateHook";

interface IAppState {
    count: number;
}

const useAppCount = createGlobalStateHook<IAppState>({ count: 0 });

const useChild1Count = createGlobalStateHook<number>(10);

const useChild2Count = createGlobalStateHook<number>(0);

function App() {
    const [appCount] = useAppCount();
    const [child1, setChild1Count] = useChild1Count();
    const [hide, setHide] = useState(false);
    return (
        <div className="App">
            <h1>Parent {appCount.count}</h1>
            <a
                target="_blank"
                href="https://github.com/GitHubJiKe/react-create-global-state-hook"
                style={{
                    position: "absolute",
                    top: 10,
                    right: 20,
                    fontSize: 30,
                    color: "blue",
                    textDecoration: "none",
                    backgroundColor: "yellow",
                    padding: 10,
                    borderRadius: 20,
                }}
            >
                github link
            </a>
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

function Child1() {
    const [appCount, setAppCount] = useAppCount();
    const [child1] = useChild1Count();
    const [child2, setChild2Count] = useChild2Count();

    return (
        <div
            style={{
                flex: 1,
                backgroundColor: "yellow",
                color: "red",
                border: "1px solid green",
            }}
        >
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

function Child2() {
    const [count2] = useChild2Count();
    const [_, setChild1Count] = useChild1Count();
    return (
        <div
            style={{
                flex: 1,
                backgroundColor: "green",
                color: "#fff",
                border: "1px solid yellow",
            }}
        >
            <h2>Child2</h2>
            <button onClick={() => setChild1Count((n) => n + 1)}>
                setChild1Count {count2}
            </button>
        </div>
    );
}

export default App;
