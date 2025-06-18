
import { useState } from "react";
import Navigation from "@/components/Navigation";
import FAQSidebar from "@/components/FAQSidebar";
import ChatMessages from "@/components/ChatMessages";
import MessageInput from "@/components/MessageInput";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { messages, inputValue, setInputValue, isLoading, sendMessage } = useChat();

  const handleFAQClick = (question: string) => {
    setSidebarOpen(false);
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Header */}
      <Navigation onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* FAQ Sidebar */}
        <FAQSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onFAQClick={handleFAQClick}
        />

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

            {/* Chat Messages */}
            <ChatMessages messages={messages} isLoading={isLoading} />

            {/* Input Area */}
            <MessageInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={() => sendMessage()}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
