"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-secondary-700/50">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-primary-400"
            >
              <span className="text-base font-semibold sm:text-lg">
                {item.question}
              </span>
              <svg
                className={cn(
                  "h-5 w-5 shrink-0 text-secondary-400 transition-transform duration-200",
                  isOpen && "rotate-180 text-primary-400"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <div
              className={cn(
                "grid transition-all duration-200",
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-secondary-400 sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
