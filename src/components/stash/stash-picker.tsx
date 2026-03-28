"use client";

import { IcX, IcDoc, IcUplinkfilled } from "@/icons/icons";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectLink: () => void;
  onSelectUpload: () => void;
}

export default function StashTypePickerModal({
  open,
  onClose,
  onSelectLink,
  onSelectUpload,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in backdrop-blur-xs backdrop-saturate-150 flex items-center justify-center p-4"
      style={{ background: "rgba(15,15,15,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-modal w-full max-w-[556px] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[18px] font-semibold text-black">
            Add to stash?
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-base transition-colors"
          >
            <IcX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm text-text-secondary font-medium mb-4 text-center">
            What do you want to stash?
          </p>
          <div className="flex gap-3 justify-center items-center">
            <button
              onClick={onSelectUpload}
              className="flex hover:bg-[#EAFFFF] h-[100px] w-[100px] cursor-pointer hover:border-[#022B3A] flex-col items-center justify-center gap-2 border border-[#D4D4D4] rounded-sm py-6  hover:bg-surface-base transition-all"
            >
              <IcDoc size={24} color="#022B3A" />
              <span className="text-sm font-semibold text-text-primary">
                Upload
              </span>
            </button>
            <button
              onClick={onSelectLink}
              className="flex hover:bg-[#EAFFFF] h-[100px] w-[100px] cursor-pointer hover:border-[#022B3A] flex-col items-center justify-center gap-2 border border-[#D4D4D4] rounded-sm py-6  hover:bg-surface-base transition-all"
            >
              <IcUplinkfilled
                size={24}
                className="rotate-[80deg]"
                color="#022B3A"
              />

              <span className="text-sm font-semibold text-text-primary">
                Links
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center px-6 py-4">
          <button
            onClick={onSelectLink}
            className="px-6 py-2 rounded-sm text-sm font-medium bg-foreground text-white hover:bg-[#1a4050] transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
