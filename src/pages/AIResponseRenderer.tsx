import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIResponseRendererProps {
  aiResponse: string;
}

const AIResponseRenderer: React.FC<AIResponseRendererProps> = ({ aiResponse }) => {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <table className="table-auto border-collapse border border-gray-300 dark:border-gray-600" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 p-2 text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 dark:border-gray-600 p-2" {...props} />
          ),
          code: ({ className, children, ...props }) => (
            <code
              className={`bg-gray-200 dark:bg-gray-700 rounded p-1 text-sm ${className || ''}`}
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto" {...props} />
          )
        }}
      >
        {aiResponse}
      </ReactMarkdown>
    </div>
  );
};

export default AIResponseRenderer;
