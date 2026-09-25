import { useEffect, useState } from "react";

type Toast = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (data: Toast) => {
    setToasts((prev) => [...prev, data]);
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  return { toast, toasts };
}
