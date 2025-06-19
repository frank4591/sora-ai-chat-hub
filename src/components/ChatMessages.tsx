
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
    <Card className="h-full bg-white/70 backdrop-blur-md border-gray-200 shadow-lg overflow-hidden flex flex-col">
      <ScrollArea
        className="flex-1 p-2 sm:p-4"
        ref={scrollAreaRef}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <img src={soraLogo} className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4" />
            <p className="text-sm sm:text-base">Start a conversation about SoraChain AI!</p>
            <p className="text-xs mt-2">
              Or click on a FAQ question from the sidebar
            </p>
          </div>
        )}
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[95%] sm:max-w-[90%] md:max-w-[95%] rounded-lg p-2 sm:p-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-white text-gray-800"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === "assistant" && (
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-indigo-600 flex-shrink-0" />
                  )}
                  {message.role === "user" && (
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-indigo-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <AIResponseRenderer aiResponse={message.content} />
                    <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                      
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-2 sm:p-3 max-w-[95%] sm:max-w-[85%] md:max-w-[75%] shadow-sm">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
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
    </Card>
  );
};

export default ChatMessages;
