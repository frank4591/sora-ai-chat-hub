import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIResponseRenderer = ({ aiResponse }) => {
  return (
    <div className="ai-response-container">
      <ReactMarkdown
        children={aiResponse}
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <table className="markdown-table" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => (
            <code className={`markdown-code ${className || ''}`} {...props}>
              {children}
            </code>
          )
        }}
      />
    </div>
  );
};

export default AIResponseRenderer;
