"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  inline?: boolean;
}

export default function Toast({
  message,
  onDismiss,
  inline = false,
}: ToastProps) {
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

  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "#F0FDF4",
        border: "1px solid #BBF7D0",
        borderRadius: "12px",
        padding: "12px 16px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        transition: "all 0.3s",
        minWidth: "340px",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "9999px",
          backgroundColor: "#22C55E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p style={{ fontSize: "0.875rem", color: "#15803D", flex: 1 }}>
        <span style={{ fontWeight: 600, color: "#111827" }}>Success!</span>{" "}
        {message}
      </p>
    </div>
  );

  if (inline) {
    return <div style={{ marginBottom: "20px" }}>{inner}</div>;
  }

  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "32px",
        left: "50%",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-8px)",
        opacity: visible ? 1 : 0,
        transition: "all 0.3s",
        zIndex: 50,
      }}
    >
      {inner}
    </div>
  );
}
