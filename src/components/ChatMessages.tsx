
import { useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import AIResponseRenderer from "@/pages/AIResponseRenderer";
import soraLogo from "@/asset/soraLogo1.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
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
                      <div className="prose prose-sm max-w-none overflow-auto">
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
  );
};

export default ChatMessages;
