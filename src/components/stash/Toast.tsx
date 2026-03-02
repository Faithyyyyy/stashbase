"use client";
import { useEffect, useState } from "react";
import { IcCheck } from "@/icons/icons";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      const showTimeout = setTimeout(() => setVisible(true), 0);
      const hideTimeout = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 3000);
      return () => {
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 z-60 pointer-events-none animate-toast-in"
      style={{ transform: "translateX(-50%)" }}
    >
      <div
        className={`flex items-center gap-2.5 bg-text-primary text-text-inverse text-[12.5px] font-medium
        px-4 py-2.5 rounded-xl shadow-toast transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-4.5 h-4.5 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
          <IcCheck size={10} className="text-green-400" />
        </div>
        {message}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="pointer-events-auto ml-1 text-text-inverse/50 hover:text-text-inverse transition-colors text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
