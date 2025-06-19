
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Navigation Header */}
      <Navigation onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
        {/* FAQ Sidebar */}
        <FAQSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onFAQClick={handleFAQClick}
        />

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="flex-1 max-w-6xl mx-auto p-2 sm:p-4 w-full flex flex-col h-full">
            <div className="text-center mb-4 sm:mb-6 px-2 flex-shrink-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Welcome to SoraChain AI Assistant
              </h2>
              <p className="text-indigo-600 text-sm sm:text-base">
                Ask me anything about the SoraChain AI platform
              </p>
            </div>

            {/* Chat Messages - Fixed height container */}
            <div className="flex-1 min-h-0 mb-4">
              <ChatMessages messages={messages} isLoading={isLoading} />
            </div>            

            {/* Input Area - Fixed at bottom */}
            <div className="flex-shrink-0">
              <MessageInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSendMessage={() => sendMessage()}
                isLoading={isLoading}
              />
            </div>
            <div className="flex-shrink-0">
              {/* <br /> */}
               <p className="text-indigo-600 text-xs s:text-base"><br />
    <h6 className="text-indigo-600 text-xs s:text-base"> ⚠️ Alpha Notice: This AI assistant is an early version built on our Notion docs. Responses may be incomplete — 
    please refer to our <a href="https://notion.sorachain.ai" className="text-indigo-800 hover:underline" target="_blank" rel="noopener noreferrer"> Notion(click here) </a> for the most accurate and up-to-date information. </h6> </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Index;
