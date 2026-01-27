import { useState } from "react";
import "./App.css";

function App() {
  const limit = 150;
  const [text, setText] = useState("");

  return (
    <div className="container">
      <textarea
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={limit}
      />
      <div className={`counter ${text.length === limit ? "limit" : ""}`}>
        {text.length}/{limit}
      </div>
    </div>
  );
}

export default App;
