
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

const MessageInput = ({ inputValue, setInputValue, onSendMessage, isLoading }: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex space-x-2 p-2 sm:p-0">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about SoraChain AI..."
        className="flex-1 bg-white/70 backdrop-blur-md border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base h-10 sm:h-11"
        disabled={isLoading}
      />
      <Button
        onClick={onSendMessage}
        disabled={!inputValue.trim() || isLoading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md h-10 sm:h-11 w-10 sm:w-11 p-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageInput;
