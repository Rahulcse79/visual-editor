import React, { useEffect, useRef } from "react";
import CatSprite from "./CatSprite";

const BOUND_WIDTH = 800;
const BOUND_HEIGHT = 500;

export default function PreviewArea({
  sprites,
  selectedSpriteId,
  setSelectedSpriteId,
  updateSprite,
  blocksList,
  setBlocksList,
}) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const runningRef = useRef(false);
  const lastSwapRef = useRef(0);

  const say = async (id, text, seconds) => {
    updateSprite(id, { message: text });
    await delay(seconds * 1000);
    updateSprite(id, { message: "" });
  };

  const performBlock = async (block, spriteState, updateLocalState) => {
    const { id, x = 0, y = 0, angle = 0 } = spriteState;

    switch (block.type) {
      case "move": {
        const rad = angle * (Math.PI / 180);
        const dx = Math.round(Math.cos(rad) * block.steps);
        const dy = Math.round(Math.sin(rad) * block.steps);
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newX <= BOUND_WIDTH &&
          newY >= 0 &&
          newY <= BOUND_HEIGHT
        ) {
          updateSprite(id, { x: newX, y: newY });
          updateLocalState({ ...spriteState, x: newX, y: newY });
        }
        break;
      }
      case "turn_left": {
        const newAngle = (angle - block.degrees + 360) % 360;
        updateSprite(id, { angle: newAngle });
        updateLocalState({ ...spriteState, angle: newAngle });
        break;
      }
      case "turn_right": {
        const newAngle = (angle + block.degrees) % 360;
        updateSprite(id, { angle: newAngle });
        updateLocalState({ ...spriteState, angle: newAngle });
        break;
      }
      case "goto": {
        updateSprite(id, { x: block.x, y: block.y });
        updateLocalState({ ...spriteState, x: block.x, y: block.y });
        break;
      }
      case "say":
        await say(id, block.text, block.seconds);
        break;
      case "think":
        await say(id, `🤔 ${block.text}`, block.seconds);
        break;
      default:
        break;
    }

    await delay(500);
  };

  const playAll = async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    for (let i = 0; i < blocksList.length; i++) {
      const originalSprite = sprites[i];
      if (!originalSprite) continue;

      const blocks = blocksList[i];
      let localSprite = { ...originalSprite };

      const updateLocalState = (updated) => {
        localSprite = updated;
      };

      let j = 0;
      while (j < blocks.length) {
        const block = blocks[j];

        if (block.type === "repeat") {
          const times = block.times || 1;
          const repeatBlocks = blocks.slice(0, j);

          for (let k = 0; k < times; k++) {
            for (const repeatBlock of repeatBlocks) {
              await performBlock(repeatBlock, localSprite, updateLocalState);
            }
          }
          j++;
        } else {
          await performBlock(block, localSprite, updateLocalState);
          j++;
        }
      }
    }

    setBlocksList(blocksList.map(() => []));
    runningRef.current = false;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (sprites.length < 2 || now - lastSwapRef.current < 800) return;

      const newBlocks = [...blocksList];
      let swapped = false;

      for (let i = 0; i < sprites.length; i++) {
        for (let j = i + 1; j < sprites.length; j++) {
          const s1 = sprites[i];
          const s2 = sprites[j];

          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 60 && !swapped) {
            // Swap move directions by inverting steps
            const updatedI = newBlocks[i].map((blk) =>
              blk.type === "move"
                ? { ...blk, steps: -blk.steps }
                : { ...blk }
            );
            const updatedJ = newBlocks[j].map((blk) =>
              blk.type === "move"
                ? { ...blk, steps: -blk.steps }
                : { ...blk }
            );

            newBlocks[i] = updatedJ;
            newBlocks[j] = updatedI;

            setBlocksList(newBlocks);
            swapped = true;
            lastSwapRef.current = now;
            break;
          }
        }
        if (swapped) break;
      }
    }, 300);

    return () => clearInterval(interval);
  }, [sprites, blocksList, setBlocksList]);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          onClick={() => setSelectedSpriteId(sprite.id)}
          className="cursor-pointer absolute"
          style={{
            left: sprite.x,
            top: sprite.y,
          }}
        >
          <CatSprite
            x={sprite.x}
            y={sprite.y}
            angle={sprite.angle || 0}
            message={sprite.message || ""}
          />
        </div>
      ))}

      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        <button
          onClick={playAll}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold ml-4"
        >
          ▶️ Play All
        </button>
      </div>
    </div>
  );
}
