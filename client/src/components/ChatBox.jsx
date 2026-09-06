import { useState, useEffect, useRef, useContext } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message });
      setMessages(prev => [...prev, { text: response.data.reply, sender: 'chef' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'chef',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="bg-primary text-white p-4 flex items-center">
        <MessageSquare className="mr-2" />
        <h3 className="font-semibold">Recipe Request Chat</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg max-w-[80%]">
              <p className="text-sm">Hi {user?.username}! I'm your recipe assistant. What kind of recipe are you looking for?</p>
            </div>
          </div>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user'
                  ? 'bg-primary text-white'
                  : msg.isError
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-200 text-gray-800'
                  }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for a recipe..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
