import React, { useRef, useState } from "react";

const PRESET_COLORS = [
  // { label: "Default", value: null },
  { label: "Dark Blue", value: "#0f172a" },
  { label: "Midnight", value: "#1a1a2e" },
  { label: "Forest", value: "#1a2e1a" },
  { label: "Wine", value: "#2e1a1a" },
  { label: "Purple", value: "#1e1a2e" },
  { label: "Slate", value: "#1e293b" },
  { label: "Light", value: "#f1f5f9" },
  { label: "Ocean", value: "#0a2342" },
  { label: "Emerald", value: "#064e3b" },
  { label: "Rose", value: "#4c0519" },
  { label: "Amber", value: "#451a03" },
  { label: "Cyan", value: "#083344" },
  { label: "Gray", value: "#111827" },
  { label: "Beige", value: "#ffd199" },
  { label: "Warm", value: "#1c1917" },
  { label: "Pink", value: "#500724" },
];

const ThemePicker = ({ onSelect, onReset, onClose }) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("color"); // "color" | "image"

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // warn if file > 3MB
    if (file.size > 3 * 1024 * 1024) {
      alert("Image too large! Please use an image under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => onSelect("image", reader.result);
    reader.readAsDataURL(file);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-80 p-5 border border-white/20"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            🎨 Chat Background
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("color")}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "color"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            🎨 Colors
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "image"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            🖼 Image
          </button>
        </div>

        {/* Color Tab */}
        {activeTab === "color" && (
          <div className="grid grid-cols-4 gap-3">
            {PRESET_COLORS.map(({ label, value }) => (
              <button
                key={label}
                title={label}
                onClick={() => onSelect("color", value)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-12 h-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                             hover:scale-110 transition-transform shadow-md"
                  style={{
                    background:
                      value ?? "linear-gradient(135deg, #e2e8f0, #94a3b8)",
                  }}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 group-hover:text-blue-500">
                  {label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Image Tab */}
        {activeTab === "image" && (
          <div className="flex flex-col items-center gap-3">
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-28 border-2 border-dashed border-gray-400 dark:border-gray-600 
                         rounded-xl flex flex-col items-center justify-center cursor-pointer 
                         hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <span className="text-3xl mb-1">📁</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Click to upload image
              </span>
              <span className="text-xs text-gray-400">Max 3MB</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={() => {
            onReset();
            onClose();
          }}
          className="mt-4 w-full py-2 rounded-xl bg-red-100 dark:bg-red-900/30 
                     text-red-600 dark:text-red-400 text-sm font-medium 
                     hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          🔄 Reset to Default
        </button>
      </div>
    </div>
  );
};

export default ThemePicker;
