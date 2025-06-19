
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIResponseRendererProps {
  aiResponse: string;
}

const AIResponseRenderer: React.FC<AIResponseRendererProps> = ({ aiResponse }) => {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-sm sm:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 dark:border-gray-600 text-xs sm:text-sm" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 p-1 sm:p-2 text-left text-xs sm:text-sm" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 dark:border-gray-600 p-1 sm:p-2 text-xs sm:text-sm" {...props} />
          ),
          code: ({ className, children, ...props }) => (
            <code
              className={`bg-gray-200 dark:bg-gray-700 rounded p-1 text-xs sm:text-sm ${className || ''}`}
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-2 sm:p-4 overflow-x-auto text-xs sm:text-sm" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-lg sm:text-xl font-bold mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base sm:text-lg font-bold mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm sm:text-base font-bold mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 text-xs sm:text-sm leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="mb-2 pl-4 text-xs sm:text-sm" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-2 pl-4 text-xs sm:text-sm" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-xs sm:text-sm" {...props} />
          )
        }}
      >
        {aiResponse}
      </li>
    </div>
  );
};

export default AIResponseRenderer;
