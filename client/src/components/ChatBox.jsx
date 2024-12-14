import { useState } from "react";

const ChatBox = ({ documentContent }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const handleChat = async () => {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        documentContent,
      }),
    });
    const data = await response.json();
    setChatResponse(data.response);
  };

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-semibold">Chat with the Document</h3>
      <textarea
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Ask a question..."
        className="w-full p-2 border border-gray-300 rounded-lg mt-2"
      />
      <button
        onClick={handleChat}
        className="mt-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Send
      </button>
      {chatResponse && (
        <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded-lg">
          <strong>Groq Response:</strong>
          <p>{chatResponse}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
