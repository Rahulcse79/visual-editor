import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function MidArea({
  animations,
  setAnimations,
  blocksList,
  setBlocksList,
}) {
  useEffect(() => {
    setBlocksList((prev) => {
      const newList = [...prev];
      while (newList.length < animations) newList.push([]);
      while (newList.length > animations) newList.pop();
      return newList;
    });
  }, [animations, setBlocksList]);

  const handleDrop = (e, index) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;

      const parsed = JSON.parse(data);
      const blk = { ...parsed, id: uuid() };

      const newList = [...blocksList];
      newList[index] = [...newList[index], blk];
      setBlocksList(newList);
    } catch (error) {
      console.error("Invalid block dropped:", error);
    }
  };

  const renderBlockLine = (blk) => {
    switch (blk.type) {
      case "move":
        return `Move ${blk.steps} steps`;
      case "turn_left":
        return `Turn left ${blk.degrees}°`;
      case "turn_right":
        return `Turn right ${blk.degrees}°`;
      case "goto":
        return `Go to x: ${blk.x}, y: ${blk.y}`;
      case "say":
        return `Say "${blk.text}" for ${blk.seconds}s`;
      case "think":
        return `Think "${blk.text}" for ${blk.seconds}s`;
      case "repeat":
        return `Repeat ${blk.times}`;
      default:
        return `Unknown block`;
    }
  };

  const handleAnimationsChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setAnimations(value);
  };

  return (
    <div className="flex-1 p-4 bg-gray-100 flex flex-col">
      <div className="mb-4">
        <label className="font-semibold mr-2">Animations:</label>
        <input
          type="number"
          min="1"
          value={animations}
          onChange={handleAnimationsChange}
          className="w-16 px-2 py-1 border rounded text-black"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {blocksList.map((blocks, index) => (
          <div
            key={index}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            className="p-3 bg-white border border-gray-300 rounded shadow"
          >
            <h2 className="font-semibold mb-2">Code Block {index + 1}</h2>
            {blocks.length === 0 ? (
              <p className="text-gray-400 text-sm">Drag a block here</p>
            ) : (
              blocks.map((b) => (
                <div key={b.id} className="bg-gray-200 px-2 py-1 mb-1 rounded">
                  {renderBlockLine(b)}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
