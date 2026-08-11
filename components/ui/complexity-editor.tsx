"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Timer } from "lucide-react";

export interface ComplexityField {
  label: string;
  value: string;
}

const DEFAULT_FIELDS: ComplexityField[] = [
  { label: "Worst Case Time Complexity", value: "" },
  { label: "Worst Case Space Complexity", value: "" },
];

interface ComplexityEditorProps {
  /** JSON string of ComplexityField[] — OR legacy plain-text string for backward compat */
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

function parseComplexity(raw: string): ComplexityField[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object" && "label" in parsed[0]) {
      return parsed as ComplexityField[];
    }
  } catch {
    /* not JSON */
  }
  // Legacy: plain text → migrate into defaults with value filled into time complexity
  if (raw.trim()) {
    return [
      { label: "Worst Case Time Complexity", value: raw.trim() },
      { label: "Worst Case Space Complexity", value: "" },
    ];
  }
  return DEFAULT_FIELDS.map((f) => ({ ...f }));
}

export function ComplexityEditor({
  value,
  onChange,
  readOnly = false,
  className = "",
}: ComplexityEditorProps) {
  const [fields, setFields] = useState<ComplexityField[]>(() => parseComplexity(value));

  // Sync with parent value
  useEffect(() => {
    setFields(parseComplexity(value));
  }, [value]);

  function persist(updated: ComplexityField[]) {
    setFields(updated);
    onChange?.(JSON.stringify(updated));
  }

  function updateFieldValue(index: number, val: string) {
    const updated = [...fields];
    updated[index] = { ...updated[index], value: val };
    persist(updated);
  }

  function updateFieldLabel(index: number, label: string) {
    const updated = [...fields];
    updated[index] = { ...updated[index], label };
    persist(updated);
  }

  function addField() {
    persist([...fields, { label: "", value: "" }]);
  }

  function removeField(index: number) {
    // Don't allow removing the two default rows
    if (index < 2) return;
    persist(fields.filter((_, i) => i !== index));
  }

  return (
    <div
      className={`relative bg-bg-base rounded-lg border border-border-default overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default flex-shrink-0">
        <div className="flex items-center gap-2">
          <Timer className="h-3.5 w-3.5 text-text-muted" />
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
            Complexity Analysis
          </span>
        </div>
        {readOnly && (
          <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-sm">
            Read only
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] min-h-[120px] p-4 space-y-3">
        {fields.map((field, i) => {
          const isDefault = i < 2;
          return (
            <div key={i} className="flex items-start gap-3 group">
              {/* Label */}
              <div className="flex-shrink-0 w-56 mt-2">
                {readOnly || isDefault ? (
                  <span className="text-xs font-medium text-accent-primary/80">
                    {field.label}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateFieldLabel(i, e.target.value)}
                    placeholder="Field name..."
                    className="w-full text-xs font-medium text-accent-primary bg-transparent border-b border-accent-primary/30 outline-none focus:border-accent-primary pb-0.5 placeholder:text-text-muted/40"
                  />
                )}
              </div>

              {/* Value */}
              {readOnly ? (
                <div className="flex-1 px-3 py-2 bg-bg-elevated/40 rounded-lg text-sm text-text-primary border border-border-default/50 min-h-[38px] font-code">
                  {field.value || <span className="text-text-muted/40 italic font-sans">Not specified</span>}
                </div>
              ) : (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateFieldValue(i, e.target.value)}
                  placeholder={i === 0 ? "e.g. O(n²)" : i === 1 ? "e.g. O(n)" : "Value..."}
                  className="flex-1 px-3 py-2 bg-bg-elevated/40 rounded-lg text-sm text-text-primary border border-border-default/50 outline-none focus:border-accent-primary/60 transition-colors font-code placeholder:text-text-muted/40 placeholder:font-sans"
                />
              )}

              {/* Delete button (only for custom fields) */}
              {!readOnly && !isDefault && (
                <button
                  onClick={() => removeField(i)}
                  className="flex-shrink-0 mt-2 p-1 text-text-muted/40 hover:text-state-error opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove field"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              {!readOnly && isDefault && (
                <span className="flex-shrink-0 w-6" />
              )}
            </div>
          );
        })}

        {/* Add button */}
        {!readOnly && (
          <button
            onClick={addField}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-accent-primary hover:bg-bg-elevated/50 rounded-lg transition-colors w-full border border-dashed border-border-default/50 hover:border-accent-primary/40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Complexity Field
          </button>
        )}
      </div>
    </div>
  );
}
