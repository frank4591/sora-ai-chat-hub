
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
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <img src={soraLogo} className="h-4 w-4 sm:h-5 sm:w-5" />
            <h1 className="text-mg sm:text-m font-bold text-gray-900 truncate">
              SoraChain AI Assistant
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-6">
            <a
              href="https://sorachain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1 text-sm lg:text-base"
            >
              <span>Home</span>
              <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4" />
            </a>
            <a
              href="https://docs.sorachain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1 text-sm lg:text-base"
            >
              <span>Documentation</span>
              <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4" />
            </a>
            <a
              href="https://notion.sorachain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1 text-sm lg:text-base"
            >
              <span>Notion</span>
              <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4" />
            </a>
          </div>
          {/* Mobile menu button for navigation links */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                // Simple mobile menu - could be enhanced with a dropdown
                window.open("https://sorachain.ai", "_blank");
              }}
            >
              Links
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
