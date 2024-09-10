'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

// Define types for message and chat history
interface Message {
  id: string;
  role: 'user' | 'assistant'; // Adjust as needed
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [firstMessageAdded, setFirstMessageAdded] = useState(false);

  // Update chat history only when the first message is added in a session
  useEffect(() => {
    if (messages.length > 0 && !firstMessageAdded) {
      const firstMessage = messages[0];
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: firstMessage.id,
          title: `Chat on ${new Date().toLocaleDateString()}`,
          content: firstMessage.content,
          date: new Date().toLocaleTimeString(),
        },
      ]);
      setFirstMessageAdded(true);
    }
  }, [messages, firstMessageAdded]);

  // Handle starting a new chat
  const handleNewChat = () => {
    setFirstMessageAdded(false);
    setMessages([]);
  };

  return (
    <div className="flex flex-col w-full lg:flex-row h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      {/* Chat History Sidebar */}
      <aside className="w-full lg:w-1/4 bg-white shadow-lg p-6 border-r border-gray-200 lg:block hidden rounded-lg backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Chat History</h2>
        <button
          onClick={handleNewChat}
          className="w-full bg-blue-400 text-black px-4 py-2 rounded-lg hover:bg-blue-600 mb-4 transition-colors duration-300"
        >
          New Chat
        </button>
        <ul className="space-y-4">
          {chatHistory.map((chat) => (
            <li key={chat.id} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <h3 className="text-lg font-medium text-gray-700">{chat.title}</h3>
              <p className="text-sm text-gray-500">{chat.date}</p>
              <p className="text-sm text-gray-600 truncate">{chat.content}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Chat Section */}
      <div className="flex flex-col w-full lg:w-3/4 bg-white shadow-lg rounded-lg lg:rounded-r-lg">
        {/* Chat header */}
        <header className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-t-lg lg:rounded-t-lg shadow-md">
          <h1 className="text-3xl font-semibold text-center text-white">UDAAN CHAT</h1>
        </header>

        {/* Chat messages */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-4 max-w-lg rounded-xl shadow ${
                  m.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {/* Use ReactMarkdown to parse and render markdown */}
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <footer className="bg-gray-100 p-4 border-t border-gray-300 rounded-b-lg lg:rounded-b-none lg:rounded-r-lg shadow-inner">
          <form onSubmit={handleSubmit} className="flex">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-400 text-white placeholder-gray-100 bg-gray-800"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition-colors duration-300"
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
