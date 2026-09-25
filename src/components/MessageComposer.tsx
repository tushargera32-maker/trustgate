"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/lib/actions/message.actions";
import { useRouter } from "next/navigation";

interface MessageComposerProps {
  applicationId?: string;
  recipientId?: string;
  placeholder?: string;
  storageKey?: string;
  onMessageSent?: () => void;
}

export function MessageComposer({
  applicationId,
  recipientId,
  placeholder = "Type your message here...",
  storageKey = "message-draft",
  onMessageSent,
}: MessageComposerProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(storageKey);
    if (draft) {
      setMessage(draft);
    }
  }, [storageKey]);

  // Save draft to localStorage on change
  useEffect(() => {
    if (message) {
      localStorage.setItem(storageKey, message);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [message, storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const result = await sendMessage({
        body: message,
        applicationId,
        recipientId,
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Clear the draft and input
        setMessage("");
        localStorage.removeItem(storageKey);

        // Call callback if provided
        if (onMessageSent) {
          onMessageSent();
        }

        // Refresh the page to show new message
        router.refresh();
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Send message error:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
        disabled={isSending}
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Press Ctrl+Enter to send
        </p>
        <Button type="submit" disabled={isSending || !message.trim()}>
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
