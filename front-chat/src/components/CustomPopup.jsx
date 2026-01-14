import { motion } from "framer-motion";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function CustomPopup({ isOpen, onClose, title, content }) {
  // Detect if `content` is a string or JSX
  const isString = typeof content === "string";

  return (
    <Popup
      open={isOpen}
      onClose={onClose}
      modal
      nested
      contentStyle={{
        background: "transparent",
        border: "none",
        boxShadow: "none",
        padding: "0",
      }}
      overlayStyle={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gray-900/70 backdrop-blur-xl text-white p-6 rounded-2xl shadow-2xl w-80 text-center border border-gray-700 mx-auto"
      >
        <h2 className="text-xl font-semibold mb-3 text-blue-400">{title}</h2>

        {/* ✅ Renders string with line breaks, or JSX as-is */}
        {isString ? (
          <div className="text-gray-300 text-sm whitespace-pre-line mb-4">
            {content}
          </div>
        ) : (
          <div className="text-gray-300 text-sm text-left mb-4">{content}</div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md"
        >
          OK
        </motion.button>
      </motion.div>
    </Popup>
  );
}
