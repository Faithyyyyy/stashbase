"use client";

import { useCallback, useEffect, useRef, useState, KeyboardEvent } from "react";
import SearchSpinner from "../ui/search-spinner";
import { IcDocs } from "@/icons/icons";

export type FilterOption = "Date" | "Tags" | "Type";

export interface StashResult {
  id: string;
  title: string;
  description: string;
  url?: string;
  type?: "document" | "link" | "image" | "video";
}

type ModalState = "idle" | "searching" | "results" | "empty";

interface SemanticSearchProps {
  onSearch: (query: string, filters: FilterOption[]) => Promise<StashResult[]>;

  onResultSelect?: (result: StashResult) => void;

  debounceMs?: number;

  placeholder?: string;
}

function FilterIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="1"
        y1="2"
        x2="15"
        y2="2"
        stroke={active ? "#0F2E35" : "#737373"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="3.5"
        y1="7"
        x2="12.5"
        y2="7"
        stroke={active ? "#0F2E35" : "#737373"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="12"
        x2="10"
        y2="12"
        stroke={active ? "#0F2E35" : "#737373"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function FilterDropdown({
  activeFilters,
  onToggle,
}: {
  activeFilters: FilterOption[];
  onToggle: (f: FilterOption) => void;
}) {
  const OPTIONS: FilterOption[] = ["Date", "Tags", "Type"];

  return (
    <div
      className="absolute top-full right-0 mt-1.5 w-35 bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.10)] py-1 z-50"
      style={{ animation: "filterDropIn 0.14s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {OPTIONS.map((opt) => {
        const isActive = activeFilters.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`
              w-full text-left px-4 py-2.25 text-sm transition-colors
              hover:bg-gray-50
              ${isActive ? "text-[#0F2E35] font-semibold" : "text-gray-700 font-normal"}
            `}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ResultRow({
  result,
  isHighlighted,
  onClick,
}: {
  result: StashResult;
  isHighlighted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left flex items-start gap-3 px-5 py-4
        border-b border-gray-100 last:border-b-0
        transition-colors
        ${isHighlighted ? "bg-gray-50/80" : "hover:bg-gray-50/60"}
      `}
    >
      <IcDocs size={18} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-text-primary leading-snug">
          {result.title}
        </p>
        {result.description && (
          <p className="text-[13px] text-[#404040] mt-1 leading-relaxed font-medium line-clamp-2">
            {result.description}
          </p>
        )}
      </div>
    </button>
  );
}

function FooterHints() {
  return (
    <div className="flex items-center gap-5 px-5 h-12 border-t border-gray-100">
      {/* Navigate hint */}
      <div className="flex items-center gap-1.5">
        <kbd className="inline-flex items-center justify-center h-6 w-6 px-1.5 text-[10px] font-medium text-[#737373] bg-[#F5F5F5]  rounded-[4px] leading-none">
          <NavIcon />
        </kbd>

        <span className="text-sm text-[#404040] font-medium">Navigate</span>
      </div>

      {/* Close hint */}
      <div
        className="flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <kbd className="inline-flex items-center justify-center h-6 w-6 px-1.5 text-[10px] font-medium text-[#737373] bg-[#F5F5F5]  rounded-[4px] leading-none">
          esc
        </kbd>
        <span className="text-sm text-[#404040] font-medium">Close</span>
      </div>
    </div>
  );
}

export default function SemanticSearch({
  onSearch,
  onResultSelect,
  debounceMs = 400,
  placeholder = "What are you looking for today?",
}: SemanticSearchProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [results, setResults] = useState<StashResult[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterDropRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openModal = () => {
    setModalOpen(true);
    setQuery("");
    setModalState("idle");
    setResults([]);
    setActiveFilters([]);
    setFilterOpen(false);
    setHighlightIdx(-1);
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setFilterOpen(false);
  }, []);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === "Escape") {
        if (filterOpen) {
          setFilterOpen(false);
          return;
        }
        closeModal();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen, filterOpen, closeModal]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        filterDropRef.current?.contains(e.target as Node) ||
        filterBtnRef.current?.contains(e.target as Node)
      )
        return;
      setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Debounced search
  const runSearch = useCallback(
    (q: string, filters: FilterOption[]) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (!q.trim()) {
        setModalState("idle");
        setResults([]);
        return;
      }

      debounceTimer.current = setTimeout(async () => {
        setModalState("searching");
        setHighlightIdx(-1);
        try {
          const res = await onSearch(q.trim(), filters);
          setResults(res);
          setModalState(res.length > 0 ? "results" : "empty");
        } catch {
          setResults([]);
          setModalState("empty");
        }
      }, debounceMs);
    },
    [onSearch, debounceMs],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    runSearch(v, activeFilters);
  };

  const toggleFilter = (f: FilterOption) => {
    const next = activeFilters.includes(f)
      ? activeFilters.filter((x) => x !== f)
      : [...activeFilters, f];
    setActiveFilters(next);
    setFilterOpen(false);
    if (query.trim()) runSearch(query, next);
  };

  // ── Keyboard navigation
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filterOpen) {
      if (e.key === "Escape") setFilterOpen(false);
      return;
    }
    if (modalState !== "results") return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      onResultSelect?.(results[highlightIdx]);
      closeModal();
    }
  };

  const handleResultClick = (r: StashResult) => {
    onResultSelect?.(r);
    closeModal();
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <>
      {/* ── TRIGGER BAR (lives in your Topbar) ─── */}
      <button
        onClick={openModal}
        aria-label="Open search"
        style={{ width: "558px" }}
        className="
          flex items-center gap-2.5 w-full max-w-138.25
          h-10 px-3.5 rounded-full
          bg-[#F6F6F6] border border-[#E5E5E5] flex-1  placeholder:text-[#737373]
          text-[13.5px] text-gray-400
          hover:border-gray-300 
          transition-all duration-150
          select-none
        "
      >
        {/* Search icon */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-[#737373]"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* Placeholder text */}
        <span className="flex-1 text-left text-[#737373] text-sm truncate">
          {placeholder}
        </span>

        {/* Filter icon — decorative in trigger */}
        <FilterIcon active={false} />
      </button>

      {/* ── MODAL -─ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          style={{
            paddingTop: "clamp(60px, 10vh, 120px)",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            ref={modalRef}
            className="
              w-full max-w-137.25 
              bg-white rounded-sm overflow-hidden
               mx-4
            "
            style={{
              animation: "searchModalIn 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── INPUT ROW ── */}
            <div className="relative flex items-center gap-2.5 px-6 h-12  border-b border-gray-100">
              {/* Search icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[#737373"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              {/* Input */}
              <input
                ref={inputRef}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleInputKeyDown}
                placeholder={placeholder}
                className="
                  flex-1 bg-transparent outline-none
                  text-sm text-gray-900
                  placeholder:text-[#737373] 
                  leading-none
                "
              />

              {/* Filter button + dropdown */}
              <div className="relative shrink-0" ref={filterDropRef}>
                <button
                  ref={filterBtnRef}
                  onClick={() => setFilterOpen((o) => !o)}
                  aria-label="Filter results"
                  aria-expanded={filterOpen}
                  className={`
                    flex items-center justify-center
                    w-8 h-8 rounded-lg transition-colors
                    ${
                      filterOpen || hasActiveFilters
                        ? "bg-[#0F2E35]/10 text-[#0F2E35]"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <FilterIcon active={filterOpen || hasActiveFilters} />
                  {hasActiveFilters && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.75 h-1.75 rounded-full bg-[#0F2E35]" />
                  )}
                </button>

                {filterOpen && (
                  <FilterDropdown
                    activeFilters={activeFilters}
                    onToggle={toggleFilter}
                  />
                )}
              </div>
            </div>

            {/* ── BODY --- */}

            {/* SEARCHING */}
            {modalState === "searching" && (
              <div className="flex items-center justify-center py-10">
                <SearchSpinner showLabel />
              </div>
            )}

            {/* RESULTS */}
            {modalState === "results" && (
              <div className="max-h-95 overflow-y-auto overscroll-contain">
                {results.map((r, i) => (
                  <ResultRow
                    key={r.id}
                    result={r}
                    isHighlighted={i === highlightIdx}
                    onClick={() => handleResultClick(r)}
                  />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {modalState === "empty" && (
              <div className="flex flex-col items-center justify-center py-10 gap-1.5 text-center px-6">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-200 mb-1"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="11"
                    x2="14"
                    y2="11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-[13.5px] font-semibold text-gray-500">
                  No stashes found
                </p>
                <p className="text-[12px] text-gray-400">
                  Try different keywords or adjust your filters
                </p>
              </div>
            )}

            {/* ── FOOTER HINTS -- */}
            <FooterHints />
          </div>
        </div>
      )}

      {/* ── KEYFRAMES  ── */}
      <style>{`
        @keyframes searchModalIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes filterDropIn {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </>
  );
}
