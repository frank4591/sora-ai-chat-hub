
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface FAQSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFAQClick: (question: string) => void;
}

const FAQSidebar = ({ sidebarOpen, setSidebarOpen, onFAQClick }: FAQSidebarProps) => {
  return (
    <>
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
                  onClick={() => onFAQClick(question)}
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
    </>
  );
};

export default FAQSidebar;
