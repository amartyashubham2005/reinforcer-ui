import { useState, useRef, useEffect, FormEvent, useCallback } from "react";
import PageMeta from "../components/common/PageMeta";
import { ArrowRightIcon, ArrowUpIcon, BotAvatarIcon, PlusIcon } from "../icons";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { abcService } from "../services/abc";
import { AnalysisSteps } from "../components/chat/AnalysisSteps";
import toast from "react-hot-toast";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";

// Updated Message interface
interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
  isConfirmation?: boolean; // Flag for special styling
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isConfirmingRestart, setIsConfirmingRestart] = useState(false);

  // Use state for analysisId, initialized to null
  const [analysisId, setAnalysisId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to fetch the latest active analysis ID on component mount
  useEffect(() => {
    const fetchAnalysisId = async () => {
      try {
        const response = await abcService.getLatestActiveAnalysis();
        if (response.ok) {
          setAnalysisId(response.data.id);
        } else {
          console.error("Failed to fetch latest active analysis.");
          // Optionally, show an error toast to the user
        }
      } catch (error) {
        console.error("Error fetching analysis ID:", error);
      }
    };
    fetchAnalysisId();
  }, []); // Empty dependency array ensures this runs only once

  const fetchMessages = useCallback(async () => {
    // Do not run if analysisId is not yet available
    if (!analysisId) return;

    try {
      const response = await abcService.getAnalysisConversations(analysisId);
      if (response.ok) {
        const conversations = response.data.sort((a, b) => new Date(Number(a.ts)).getTime() - new Date(Number(b.ts)).getTime());

        const apiMessages = conversations.map((conv): Message => ({
          id: conv.id,
          text: conv.text,
          sender: conv.messageBy,
          timestamp: new Date(Number(conv.ts)).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isConfirmation: conv.isConfirmationMessage && conv.messageBy === "assistant",
        }));
        setMessages(apiMessages);

        const orderedUniqueSteps = conversations.reduce((acc, curr) => {
          if (curr.stepName && !acc.includes(curr.stepName)) {
            acc.push(curr.stepName);
          }
          return acc;
        }, [] as string[]);

        if (orderedUniqueSteps.length > 0) {
          const lastStep = orderedUniqueSteps.pop()!;
          setCurrentStep(lastStep);
          setCompletedSteps(new Set(orderedUniqueSteps));
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, [analysisId]); // Add analysisId as a dependency

  // Effect for polling, now dependent on analysisId
  useEffect(() => {
    if (analysisId) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 3000);
      return () => clearInterval(intervalId);
    }
  }, [analysisId, fetchMessages]);

  // Generic function to send a message to the API
  const sendMessage = async (messageText: string) => {
    // Add a guard to ensure analysisId exists
    if (!messageText.trim() || isSending || !analysisId) return;

    setIsSending(true);
    try {
      await abcService.createAnalysisConversation(analysisId, { text: messageText });
      await fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      if (input === messageText) {
        setInput(messageText);
      }
    } finally {
      setIsSending(false);
    }
  };

  // Handler for the text input form
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  const handleRestartAnalysis = async () => {
    setIsRestarting(true);
    try {
      const response = await abcService.createAnalysis({ title: `analysis-${Date.now()}` });
      if (response.ok) {
        toast.success("New analysis started!");
        setAnalysisId(response.data.id);
        setMessages([]);
        setCompletedSteps(new Set());
        setCurrentStep(null);
      } else {
        toast.error("Failed to restart analysis.");
      }
    } catch (error) {
      console.error("Error restarting analysis:", error);
      toast.error("An error occurred while restarting.");
    } finally {
      setIsRestarting(false);
      setIsConfirmingRestart(false); // Close the dialog after the action is complete
    }
  };

  return (
    <>
      <PageMeta title="Chat | Reinforcer Admin Dashboard Template" description="Chat with the bot in this demo application." />

      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Chat" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col h-[calc(100vh-180px)] bg-white border rounded-lg shadow-theme-lg dark:bg-gray-dark dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-gray-800 dark:text-white">Chat with Bot</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex flex-col gap-5">
                {messages.map((message, index) => (
                  <div key={message.id} className={`flex items-end gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {message.sender === "assistant" && <BotAvatarIcon />}

                    <div className={`max-w-xs lg:max-w-md px-6 py-3 rounded-full ${message.isConfirmation
                      ? "bg-brand-50 dark:bg-brand-500/10 border-l-4 border-brand-500"
                      : message.sender === "user"
                        ? "bg-brand-500 text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-gray-300"
                      }`}>
                      <p className={`text-sm ${message.isConfirmation ? "text-gray-800 dark:text-gray-200" : ""}`}>{message.isConfirmation ? `⚠️ ` : ''}{message.text}</p>

                      {message.isConfirmation && index === messages.length - 1 && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => sendMessage("Yes")}
                            disabled={isSending || !analysisId}
                            className="px-4 py-1 text-sm font-medium text-white transition bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => sendMessage("No")}
                            disabled={isSending || !analysisId}
                            className="px-4 py-1 text-sm font-medium text-white transition bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            No
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
              <form onSubmit={handleFormSubmit} className="relative">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-2">
                  {/* Plus icon button on the left */}
                  <button
                    type="button"
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 mr-3"
                  >
                    <PlusIcon />
                  </button>

                  {/* Input field */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={!analysisId ? "Loading analysis..." : "Type your message..."}
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isSending || !analysisId}
                  />

                  {/* Send button on the right */}
                  <button
                    type="submit"
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition-colors duration-200 ml-3"
                    disabled={!input.trim() || isSending || !analysisId}
                  >
                    <ArrowUpIcon />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <AnalysisSteps
            completedSteps={completedSteps}
            currentStep={currentStep}
            onRestart={() => setIsConfirmingRestart(true)}
            isRestarting={isRestarting}
          />
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isConfirmingRestart}
        onClose={() => setIsConfirmingRestart(false)}
        onConfirm={handleRestartAnalysis}
        isConfirming={isRestarting}
        title="Restart Analysis"
        message="Are you sure you want to restart the analysis? This will clear the current chat history and start a new session."
        confirmButtonText="Yes, Restart"
      />
    </>
  );
}