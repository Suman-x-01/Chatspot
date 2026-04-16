import { useState } from "react";

export function useChatBackground(userId, roomId) {
  const key = `chatbg__${userId}__${roomId}`;

  const [background, setBackground] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : { type: "color", value: "#3e4554" };
    } catch {
      return { type: "color", value: null };
    }
  });

  const updateBackground = (type, value) => {
    const newBg = { type, value };
    setBackground(newBg);
    localStorage.setItem(key, JSON.stringify(newBg));
  };

  const resetBackground = () => {
    localStorage.removeItem(key);
    setBackground({ type: "color", value: "#3e4554" });
  };

  return { background, updateBackground, resetBackground };
}
