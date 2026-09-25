import Link from "next/link";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function MessagesPage() {
  const session = await requireSession();

  const messages = await prisma.message.findMany({
    where: { senderId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Messages
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Counsellor chat
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Secure messaging with your assigned counsellor.
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[60vh] flex-col items-center justify-center p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-display text-lg">
              No messages yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Start a conversation with your counsellor. Messages are delivered
              immediately and you&apos;ll receive an email notification when they reply.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {messages.map((msg) => {
                const isFromUser = msg.senderId === session.user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isFromUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md rounded-lg p-4 ${
                        isFromUser
                          ? "bg-gold-500/10 text-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="text-sm">{msg.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <Textarea
            placeholder="Type your message here..."
            className="min-h-[100px]"
          />
          <div className="mt-3 flex justify-end">
            <Button>
              <Send className="h-4 w-4" /> Send message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
