import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { toast } from "react-hot-toast";
import JoinReactChat from "./components/JoinREactChat";
// import JoinReactChat from "./components/JoinREactChat";
import ChatPage from "./components/ChatPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <JoinReactChat />
    </>
  );
}

export default App;
