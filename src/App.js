import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [animations, setAnimations] = useState(1);
  const [sprites, setSprites] = useState([]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);
  const [blocksList, setBlocksList] = useState([[]]);

  // Handle sprite initialization/update when animations count changes
  useEffect(() => {
    setSprites((prevSprites) => {
      const updated = [...prevSprites];

      while (updated.length < animations) {
        updated.push({
          id: uuid(),
          name: `Cat ${updated.length + 1}`,
          x: 100 + updated.length * 50,
          y: 100 + updated.length * 50,
          angle: 0,
          blocks: [],
          message: "",
        });
      }

      while (updated.length > animations) {
        updated.pop();
      }

      if (!updated.find((sprite) => sprite.id === selectedSpriteId)) {
        setSelectedSpriteId(updated[0]?.id || null);
      }

      return updated;
    });

    setBlocksList((prev) => {
      const newList = [...prev];
      while (newList.length < animations) newList.push([]);
      while (newList.length > animations) newList.pop();
      return newList;
    });
  }, [animations]);

  // Sprite boundary check and state update
  const updateSprite = (id, extras) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) => {
        if (sprite.id !== id) return sprite;

        const containerWidth = window.innerWidth - 300;
        const containerHeight = window.innerHeight;
        const spriteWidth = 95;
        const spriteHeight = 100;

        const newX = extras.x !== undefined ? extras.x : sprite.x;
        const newY = extras.y !== undefined ? extras.y : sprite.y;

        if (
          newX < 0 ||
          newY < 0 ||
          newX + spriteWidth > containerWidth ||
          newY + spriteHeight > containerHeight
        ) {
          alert("Cat can't go outside the box!");
          return sprite;
        }

        return { ...sprite, ...extras };
      })
    );
  };

  useEffect(() => {
    if (sprites.length < 2) return;

    const interval = setInterval(() => {
      const newSprites = [...sprites];

      for (let i = 0; i < newSprites.length; i++) {
        for (let j = i + 1; j < newSprites.length; j++) {
          const s1 = newSprites[i];
          const s2 = newSprites[j];

          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 60) {
            // Collision detected — swap their blocks
            setBlocksList((prev) => {
              const newBlocks = [...prev];
              const temp = newBlocks[i];
              newBlocks[i] = newBlocks[j];
              newBlocks[j] = temp;
              return newBlocks;
            });
          }
        }
      }
    }, 300); 

    return () => clearInterval(interval);
  }, [sprites, blocksList]);

  return (
    <div className="bg-blue-100 pt-6 font-sans h-screen flex overflow-hidden">
      <div className="flex bg-white rounded-tr-xl mr-2 border-t border-r border-gray-200">
        <div className="w-64 border-r border-gray-200">
          <Sidebar />
        </div>
        <div className="w-[300px] border-l border-gray-200">
          <MidArea
            animations={animations}
            blocksList={blocksList}
            setBlocksList={setBlocksList}
            setAnimations={setAnimations}
          />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-tl-xl ml-2 border-t border-l border-gray-200">
        <PreviewArea
          sprites={sprites}
          selectedSpriteId={selectedSpriteId}
          setSelectedSpriteId={setSelectedSpriteId}
          updateSprite={updateSprite}
          blocksList={blocksList}
          setBlocksList={setBlocksList}
        />
      </div>
    </div>
  );
}
