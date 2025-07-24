import React, { useState } from "react";

export default function Sidebar() {
  const [blockStates, setBlockStates] = useState({
    move: 10,
    turn_left: 15,
    turn_right: 15,
    goto: { x: 0, y: 0 },
    say: { text: "Hello", seconds: 2 },
    think: { text: "Hmm", seconds: 2 },
    repeat: 1,
  });

  const updateState = (type, value) => {
    setBlockStates(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const BLOCKS = [
    {
      type: "move",
      category: "Motion",
      render: () => (
        <>
          Move{" "}
          <input
            type="number"
            value={blockStates.move}
            onChange={e => updateState("move", +e.target.value)}
            className="w-12 mx-1 text-black px-1 rounded"
          />{" "}
          steps
        </>
      ),
      getData: () => ({ type: "move", steps: blockStates.move }),
    },
    {
      type: "turn_left",
      category: "Motion",
      render: () => (
        <>
          Turn left{" "}
          <input
            type="number"
            value={blockStates.turn_left}
            onChange={e => updateState("turn_left", +e.target.value)}
            className="w-12 mx-1 text-black px-1 rounded"
          />
          °
        </>
      ),
      getData: () => ({ type: "turn_left", degrees: blockStates.turn_left }),
    },
    {
      type: "turn_right",
      category: "Motion",
      render: () => (
        <>
          Turn right{" "}
          <input
            type="number"
            value={blockStates.turn_right}
            onChange={e => updateState("turn_right", +e.target.value)}
            className="w-12 mx-1 text-black px-1 rounded"
          />
          °
        </>
      ),
      getData: () => ({ type: "turn_right", degrees: blockStates.turn_right }),
    },
    {
      type: "goto",
      category: "Motion",
      render: () => (
        <>
          Go to x:{" "}
          <input
            type="number"
            value={blockStates.goto.x}
            onChange={e => updateState("goto", { ...blockStates.goto, x: +e.target.value })}
            className="w-12 mx-1 text-black px-1 rounded"
          />{" "}
          y:{" "}
          <input
            type="number"
            value={blockStates.goto.y}
            onChange={e => updateState("goto", { ...blockStates.goto, y: +e.target.value })}
            className="w-12 mx-1 text-black px-1 rounded"
          />
        </>
      ),
      getData: () => ({ type: "goto", ...blockStates.goto }),
    },
    {
      type: "say",
      category: "Looks",
      render: () => (
        <>
          Say{" "}
          <input
            type="text"
            value={blockStates.say.text}
            onChange={e =>
              updateState("say", {
                ...blockStates.say,
                text: e.target.value,
              })
            }
            className="w-20 mx-1 text-black px-1 rounded"
          />{" "}
          for{" "}
          <input
            type="number"
            min="1"
            value={blockStates.say.seconds}
            onChange={e =>
              updateState("say", {
                ...blockStates.say,
                seconds: Math.max(1, +e.target.value),
              })
            }
            className="w-12 mx-1 text-black px-1 rounded"
          />
          s
        </>

      ),
      getData: () => ({ type: "say", ...blockStates.say }),
    },
    {
      type: "think",
      category: "Looks",
      render: () => (
        <>
          Think{" "}
          <input
            type="text"
            value={blockStates.think.text}
            onChange={e =>
              updateState("think", {
                ...blockStates.think,
                text: e.target.value,
              })
            }
            className="w-20 mx-1 text-black px-1 rounded"
          />{" "}
          for{" "}
          <input
            type="number"
            min="1"
            value={blockStates.think.seconds}
            onChange={e =>
              updateState("think", {
                ...blockStates.think,
                seconds: Math.max(1, +e.target.value),
              })
            }
            className="w-12 mx-1 text-black px-1 rounded"
          />
          s
        </>
      ),
      getData: () => ({ type: "think", ...blockStates.think }),
    },
    {
      type: "repeat",
      category: "Motion",
      render: () => (
        <>
          Repeat{" "}
          <input
            type="number"
            min="1"
            value={blockStates.repeat}
            onChange={e => {
              const val = Math.max(1, +e.target.value); 
              updateState("repeat", val);
            }}
            className="w-12 mx-1 text-black px-1 rounded"
          />
        </>
      ),
      getData: () => ({ type: "repeat", times: blockStates.repeat }),
    }
  ];

  const handleDragStart = (e, blk) => {
    e.dataTransfer.setData("application/json", JSON.stringify(blk.getData()));
  };

  return (
    <div className="w-64 p-3 flex flex-col border-r border-gray-300 bg-gray-100 h-screen overflow-y-auto">
      {["Motion", "Looks"].map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="font-bold text-gray-700 mb-2">{cat}</h3>
          {BLOCKS.filter((b) => b.category === cat).map((b, i) => (
            <div
              key={i}
              className="bg-blue-500 text-white px-2 py-1 mb-2 rounded cursor-pointer text-sm"
              draggable
              onDragStart={(e) => handleDragStart(e, b)}
            >
              {b.render()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
