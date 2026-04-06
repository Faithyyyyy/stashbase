"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IcChevDown } from "@/icons/icons";
export function CalendarPicker({
  value,
  onSelect,
  onClose,
  reminderTime,
  onTimeChange,
  timeOpen,
  onTimeToggle,
}: {
  value: string;
  onSelect: (date: string) => void;
  onClose: () => void;
  reminderTime: string;
  onTimeChange: (time: string) => void;
  timeOpen: boolean;
  onTimeToggle: () => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean }[] = [];
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, current: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({
      day: cells.length - daysInMonth - offset + 1,
      current: false,
    });
  }

  const selectedParts = value ? value.split("/") : null;
  const isSelected = (day: number) =>
    selectedParts &&
    parseInt(selectedParts[0]) === day &&
    parseInt(selectedParts[1]) === month + 1 &&
    parseInt(selectedParts[2]) === year % 100;

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div
      className="absolute top-full left-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-20 py-4 w-72"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center px-4 justify-between mb-4">
        <button
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear((y) => y - 1);
            } else setMonth((m) => m - 1);
          }}
          className="w-7 h-7 flex items-center justify-end rounded-lg hover:bg-surface-base transition-colors text-text-secondary"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-text-primary">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear((y) => y + 1);
            } else setMonth((m) => m + 1);
          }}
          className="w-7 h-7 flex items-center justify-start rounded-lg hover:bg-surface-base transition-colors text-text-secondary"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="relative w-full px-6 mb-5">
        <button
          type="button"
          onClick={onTimeToggle}
          className={cn(inputCls, "flex items-center justify-between w-full")}
        >
          {reminderTime || "Select time"}
          <IcChevDown size={12} />
        </button>
        {/* {timeOpen && (
          <div className="absolute top-full w-[85%] mx-auto left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-1 max-h-48 overflow-y-auto animate-slide-down">
            {[
              "06:00am",
              "07:00am",
              "08:00am",
              "09:00am",
              "10:00am",
              "11:00am",
              "12:00pm",
              "01:00pm",
              "02:00pm",
              "03:00pm",
              "04:00pm",
              "05:00pm",
              "06:00pm",
              "07:00pm",
              "08:00pm",
              "09:00pm",
              "10:00pm",
            ].map((t) => (
              <button
                key={t}
                onClick={() => {
                  onTimeChange(t);
                  onTimeToggle();
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-[13px] transition-colors",
                  reminderTime === t
                    ? "bg-surface-base text-text-primary font-medium"
                    : "text-text-secondary hover:bg-surface-base",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )} */}
        {timeOpen && (
          <div className="absolute top-full w-[85%] mx-auto left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-1 max-h-48 overflow-y-auto animate-slide-down">
            {/* Custom time input */}
            <div className="px-3 py-2 border-b border-border">
              <input
                type="time"
                onChange={(e) => {
                  if (!e.target.value) return;
                  const [hours, minutes] = e.target.value.split(":");
                  const h = parseInt(hours);
                  const suffix = h >= 12 ? "pm" : "am";
                  const h12 = h % 12 === 0 ? 12 : h % 12;
                  onTimeChange(
                    `${String(h12).padStart(2, "0")}:${minutes}${suffix}`,
                  );
                }}
                className="w-full text-sm text-text-primary border border-border rounded-sm px-2 py-1.5 outline-none focus:border-border-strong"
                placeholder="Custom time"
              />
            </div>

            {/* Preset times */}
            {[
              "06:00am",
              "07:00am",
              "08:00am",
              "09:00am",
              "10:00am",
              "11:00am",
              "12:00pm",
              "01:00pm",
              "02:00pm",
              "03:00pm",
              "04:00pm",
              "05:00pm",
              "06:00pm",
              "07:00pm",
              "08:00pm",
              "09:00pm",
              "10:00pm",
            ].map((t) => (
              <button
                key={t}
                onClick={() => {
                  onTimeChange(t);
                  onTimeToggle();
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-[13px] transition-colors",
                  reminderTime === t
                    ? "bg-surface-base text-text-primary font-medium"
                    : "text-text-secondary hover:bg-surface-base",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 px-4 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-medium text-text-tertiary py-1"
          >
            {d}
          </div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7 px-4 gap-y-1">
        {cells.map((cell, i) => (
          <button
            key={i}
            disabled={!cell.current}
            onClick={() => {
              if (!cell.current) return;
              const d = String(cell.day).padStart(2, "0");
              const m = String(month + 1).padStart(2, "0");
              const y = String(year).slice(-2);
              onSelect(`${d}/${m}/${y}`);
            }}
            className={cn(
              "w-8 h-8 mx-auto cursor-pointer flex items-center justify-center text-[12px] rounded-full transition-colors",
              !cell.current && "text-text-disabled cursor-default",
              cell.current &&
                isSelected(cell.day) &&
                "bg-foreground text-white font-semibold",
              cell.current &&
                !isSelected(cell.day) &&
                "text-text-primary hover:bg-surface-base",
            )}
          >
            {cell.day}
          </button>
        ))}
      </div>
      {/* Footer */}
      <div className="flex items-center gap-3 px-4 justify-between mt-6 pt-3 border-t border-border">
        <button
          onClick={onClose}
          className=" px-4 py-1.5 text-sm flex-1 border border-[#D0D5DD] rounded-sm  text-text-secondary hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (value) onSelect(value);
            onClose();
          }}
          className="px-4 py-1.5 text-sm flex-1 bg-foreground text-white rounded-sm hover:bg-[#1a4050] transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
const inputCls =
  "w-full text-sm font-medium text-text-primary placeholder:text-text-disabled " +
  "bg-white border border-[#D4D4D4] rounded-sm px-3.5 py-2.5 outline-none transition-all " +
  "hover:border-border-strong focus:border-border-strong focus:shadow-input";
