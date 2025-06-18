
import { useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue;
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageContent) {
      setInputValue("");
    }
    setIsLoading(true);

    try {
      // Get environment variables with VITE_ prefix for frontend access
      const apiBase = import.meta.env.VITE_API_BASE;
      const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID;
      const apiKey = import.meta.env.VITE_API_KEY_SORA;
      const searchKey = import.meta.env.VITE_SEARCH_KEY;
      const searchEndpoint = import.meta.env.VITE_SEARCH_ENDPOINT;
      const searchIndex = import.meta.env.VITE_SEARCH_INDEX;

      const endpoint = `${apiBase}/openai/deployments/${deploymentId}/extensions/chat/completions?api-version=2023-08-01-preview`;

      // Prepare messages array with system message and chat history
      const conversationMessages = [
        {
          role: "system",
          content:
            "You are an AI assistant that helps people find information about Sorachain Ai platform, Give them information related to Sorachain.Give proper spacing,  use markdown format in response.Do not use plain text or tabs for formatting — format as Markdown table ,headings, bold wherever required. For table create proper tabular lines ",
        },
        ...messages.slice(-10).map((msg) => ({
          // Last 10 messages for context
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: content,
        },
      ];

      const requestBody = {
        messages: conversationMessages,
        dataSources: [
          {
            type: "AzureCognitiveSearch",
            parameters: {
              endpoint: searchEndpoint,
              key: searchKey,
              indexName: searchIndex,
              semanticConfiguration: "default",
              queryType: "semantic",
              fieldsMapping: {
                contentField: "content",
              },
              inScope: true,
              roleInformation:
                "You are an SoraChain AI platform's assistant that helps people find information about the project and help to find more information to them.Use markdown format in response.Do not use plain text or tabs for formatting — format as Markdown table ,headings, bold wherever required. For table create proper tabular lines and remove reference of documents.when giving final content response",
            },
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 1000,
        past_messages: 10,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      const assistantContent =
        data.choices?.[0]?.message?.content ||
        "Sorry, I could not process your request.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        `Failed to send message: ${error.message}. Please check your configuration.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    sendMessage,
  };
};
