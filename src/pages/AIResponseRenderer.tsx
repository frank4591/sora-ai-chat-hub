
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIResponseRendererProps {
  aiResponse: string;
}

const AIResponseRenderer: React.FC<AIResponseRendererProps> = ({ aiResponse }) => {
  return (
    <div className="ai-response-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ ...props }) => (
            <table className="markdown-table" {...props} />
          ),
          code: ({ className, children, ...props }) => (
            <code className={`markdown-code ${className || ''}`} {...props}>
              {children}
            </code>
          )
        }}
      >
        {aiResponse}
      </ReactMarkdown>
    </div>
  );
};

export default AIResponseRenderer;
