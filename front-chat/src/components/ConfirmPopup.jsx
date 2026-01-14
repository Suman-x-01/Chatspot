import { motion } from "framer-motion";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const ConfirmPopup = ({ isOpen, onClose, onConfirm, title, content }) => {
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
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900/70 backdrop-blur-xl text-white p-6 rounded-2xl shadow-2xl w-80 text-center border border-gray-700 mx-auto"
      >
        <h2 className="text-xl font-semibold mb-3 text-blue-400">{title}</h2>
        <p className="text-gray-300 text-sm mb-4">{content}</p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </Popup>
  );
};

export default ConfirmPopup;
