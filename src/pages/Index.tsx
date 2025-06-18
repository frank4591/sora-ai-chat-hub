
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ExternalLink, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Markdown from "markdown-to-jsx";
import AIResponseRenderer from "./AIResponseRenderer";
import soraLogo from "@/asset/soraLogo1.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const faqQuestions = [
  "What is SoraChain AI trying to build?",
  "What is the vision of SoraChain AI?",
  "What are the Go To Market(GTM) Strategy of SoraChain AI?",
  "What is the Revenue Model?",
  "Why Sorachain AI Excels at what they are building?",
  "Who are the core Competitors?",
  "What is your Competitors Advantage?",
  "What is the Difference between On device Training and SoraChain AI's Training?"
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue;
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageContent) {
      setInputValue("");
    }
    setIsLoading(true);

    try {
      // Get environment variables with VITE_ prefix for frontend access
      const apiBase = import.meta.env.VITE_API_BASE;
      const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID;
      const apiKey = import.meta.env.VITE_API_KEY_SORA;
      const searchKey = import.meta.env.VITE_SEARCH_KEY;
      const searchEndpoint = import.meta.env.VITE_SEARCH_ENDPOINT;
      const searchIndex = import.meta.env.VITE_SEARCH_INDEX;

      const endpoint = `${apiBase}/openai/deployments/${deploymentId}/extensions/chat/completions?api-version=2023-08-01-preview`;

      // Prepare messages array with system message and chat history
      const conversationMessages = [
        {
          role: "system",
          content:
            "You are an AI assistant that helps people find information about Sorachain Ai platform, Give them information related to Sorachain.Give proper spacing,  use markdown format in response.Do not use plain text or tabs for formatting — format as Markdown table ,headings, bold wherever required. For table create proper tabular lines ",
        },
        ...messages.slice(-10).map((msg) => ({
          // Last 10 messages for context
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: content,
        },
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
                contentField: "content",
              },
              inScope: true,
              roleInformation:
                "You are an SoraChain AI platform's assistant that helps people find information about the project and help to find more information to them.Use markdown format in response.Do not use plain text or tabs for formatting — format as Markdown table ,headings, bold wherever required. For table create proper tabular lines and remove reference of documents.when giving final content response",
            },
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 1000,
        past_messages: 10,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      const assistantContent =
        data.choices?.[0]?.message?.content ||
        "Sorry, I could not process your request.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        `Failed to send message: ${error.message}. Please check your configuration.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFAQClick = (question: string) => {
    setSidebarOpen(false);
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <img src={soraLogo} className="h-5 w-5" />
              <h1 className="text-xl font-bold text-gray-900">
                SoraChain AI Assistant
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://sorachain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1"
              >
                <span>Home</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://docs.sorachain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1"
              >
                <span>Documentation</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://notion.sorachain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1"
              >
                <span>Notion</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* FAQ Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-80 h-full transition-transform duration-300 ease-in-out`}>
          <div className="h-full bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-5rem)] p-4">
              <div className="space-y-2">
                {faqQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleFAQClick(question)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-colors duration-200 text-sm text-gray-700 hover:text-indigo-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 max-w-6xl mx-auto p-4 w-full flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to SoraChain AI Assistant
              </h2>
              <p className="text-indigo-600">
                Ask me anything about the SoraChain AI platform
              </p>
            </div>

            {/* Chat Messages - Fixed height with proper scrolling */}
            <Card className="flex-1 bg-white/70 backdrop-blur-md border-gray-200 mb-4 shadow-lg overflow-hidden">
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                      <img src={soraLogo} className="h-12 w-12 mx-auto mb-4" />
                      <p>Start a conversation about SoraChain AI!</p>
                      <p className="text-xs mt-2">Or click on a FAQ question from the sidebar</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                            message.role === "user"
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === "assistant" && (
                              <Bot className="h-5 w-5 mt-0.5 text-indigo-600 flex-shrink-0" />
                            )}
                            {message.role === "user" && (
                              <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="whitespace-pre-wrap break-words overflow-hidden">
                                <AIResponseRenderer aiResponse={message.content} />
                              </div>
                              <p
                                className={`text-xs mt-1 ${
                                  message.role === "user"
                                    ? "text-indigo-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3 max-w-[85%] shadow-sm">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-indigo-600" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </Card>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about SoraChain AI..."
                className="flex-1 bg-white/70 backdrop-blur-md border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
