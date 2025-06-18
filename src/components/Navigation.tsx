
import { Menu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import soraLogo from "@/asset/soraLogo1.png";

interface NavigationProps {
  onMenuClick: () => void;
}

const Navigation = ({ onMenuClick }: NavigationProps) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
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
  );
};

export default Navigation;
