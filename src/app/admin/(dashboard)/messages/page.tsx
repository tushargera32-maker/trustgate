import { MessageSquare, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MessageComposer } from "@/components/MessageComposer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: {
    clientId?: string;
    applicationId?: string;
  };
}

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const session = await requireStaff();

  // Build where clause based on filters
  const where: any = {
    isInternal: false,
  };

  if (searchParams.clientId) {
    where.application = {
      clientId: searchParams.clientId,
    };
  }

  if (searchParams.applicationId) {
    where.applicationId = searchParams.applicationId;
  }

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
        },
      },
      application: {
        select: {
          id: true,
          reference: true,
          client: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    take: 100,
  });

  // Group messages by client/application
  const messagesByClient = messages.reduce((acc, msg) => {
    const key = msg.application?.client.id || msg.senderId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Client Messages
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and respond to client messages across all applications.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Messages</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
              <h2 className="mt-4 font-display text-lg">
                No messages yet
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Client messages will appear here when they send their first message.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(messagesByClient).map(([clientKey, clientMessages]) => {
                const firstMsg = clientMessages[0];
                const client = firstMsg.application?.client;
                const clientName = client?.fullName || firstMsg.sender.name || firstMsg.sender.email;
                const clientInitials = clientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div key={clientKey} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center gap-3 border-b pb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{clientInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{clientName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {client?.email || firstMsg.sender.email}
                        </p>
                        {firstMsg.application && (
                          <p className="text-xs text-muted-foreground">
                            Application: {firstMsg.application.reference}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {clientMessages.length} message{clientMessages.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                      {clientMessages.reverse().map((msg) => {
                        const isStaff = msg.sender.role !== "CLIENT";
                        const senderName = msg.sender.name || msg.sender.email;
                        const senderInitials = senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);

                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${isStaff ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={msg.sender.image || undefined} />
                              <AvatarFallback className="text-xs">
                                {senderInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`flex flex-col gap-1 ${isStaff ? "items-end" : "items-start"}`}
                            >
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-medium">{senderName}</span>
                                {isStaff && (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium">
                                    {msg.sender.role.replace("_", " ")}
                                  </span>
                                )}
                              </div>
                              <div
                                className={`max-w-md rounded-lg px-4 py-2.5 ${
                                  isStaff
                                    ? "bg-primary/10 text-foreground"
                                    : "bg-secondary"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(msg.createdAt).toLocaleString("en-US", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t pt-3">
                      <MessageComposer
                        applicationId={firstMsg.applicationId || undefined}
                        storageKey={`admin-message-draft-${clientKey}`}
                        placeholder={`Reply to ${clientName}...`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
