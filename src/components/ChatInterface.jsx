import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInterface = ({ format }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatLabels = {
    'friday-fourball': 'Friday Four-Ball',
    'saturday-fourball': 'Saturday Four-Ball',
    'saturday-alternate': 'Saturday Alternate Shot',
    'sunday-singles': 'Sunday Singles'
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    const newMessage = {
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: inputValue,
          format: format 
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble accessing the rules. Please try again.'
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-green-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Golf Rules Assistant</h1>
        <p className="text-sm mt-1">Format: {formatLabels[format]}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white shadow-md'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md p-3 rounded-lg">
              Checking the rules...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your situation..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     disabled:bg-green-300 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;