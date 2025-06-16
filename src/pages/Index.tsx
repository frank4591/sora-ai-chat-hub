import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Get environment variables with VITE_ prefix for frontend access
      const apiBase = import.meta.env.VITE_API_BASE;
      const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID;
      const apiKey = import.meta.env.VITE_API_KEY_SORA;
      const searchKey = import.meta.env.VITE_SEARCH_KEY;
      const searchEndpoint = import.meta.env.VITE_SEARCH_ENDPOINT;
      const searchIndex = import.meta.env.VITE_SEARCH_INDEX;

      // Validate environment variables
      if (!apiBase || !deploymentId || !apiKey || !searchKey || !searchEndpoint || !searchIndex) {
        throw new Error('Missing required environment variables. Please check your Azure Static Web App configuration.');
      }

      console.log('Environment variables loaded:', {
        apiBase: apiBase ? 'Set' : 'Missing',
        deploymentId: deploymentId ? 'Set' : 'Missing',
        apiKey: apiKey ? 'Set' : 'Missing',
        searchKey: searchKey ? 'Set' : 'Missing',
        searchEndpoint: searchEndpoint ? 'Set' : 'Missing',
        searchIndex: searchIndex ? 'Set' : 'Missing'
      });

      const endpoint = `${apiBase}/openai/deployments/${deploymentId}/extensions/chat/completions?api-version=2023-08-01-preview`;

      // Prepare messages array with system message and chat history
      const conversationMessages = [
        {
          role: "system",
          content: "You are an AI assistant that helps people find information about Sorachain Ai platform, Give them information related to Sorachain"
        },
        ...messages.slice(-10).map(msg => ({ // Last 10 messages for context
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user",
          content: currentInput
        }
      ];

      const requestBody = {
        messages: conversationMessages,
        dataSources: [
          {
            type: "AzureCognitiveSearch",
            parameters: {
              endpoint: searchEndpoint,
              key: searchKey,
              indexName: searchIndex,
              semanticConfiguration: "default",
              queryType: "semantic",
              fieldsMapping: {
                contentField: "content"
              },
              inScope: true,
              roleInformation: "You are an SoraChain AI platform's assistant that helps people find information about the project and help to find more information to them"
            }
          }
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 1000,
        past_messages: 10,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null
      };

      console.log('Making request to:', endpoint);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const assistantContent = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message}. Please check your configuration.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-purple-400" />
              <h1 className="text-xl font-bold text-white">SoraChain Bot</h1>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://sorachain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-300 transition-colors flex items-center space-x-1"
              >
                <span>Home</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://docs.sorachain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-300 transition-colors flex items-center space-x-1"
              >
                <span>Documentation</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://notion.sorachain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-300 transition-colors flex items-center space-x-1"
              >
                <span>Notion</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Chat Interface */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to SoraChain AI Assistant</h2>
          <p className="text-purple-300">Ask me anything about the SoraChain AI platform</p>
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 bg-black/40 backdrop-blur-md border-white/20 mb-4">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <p>Start a conversation about SoraChain AI!</p>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-5 w-5 mt-0.5 text-purple-400 flex-shrink-0" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-purple-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about SoraChain AI..."
            className="flex-1 bg-black/40 backdrop-blur-md border-white/20 text-white placeholder-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
