"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/select.js";

export type WorkspaceSelectOption = {
  label: string;
  swatchClassName?: string;
  value: string;
};

export function WorkspaceSelect({
  ariaLabel,
  name,
  disabled = false,
  onValueChange,
  options,
  placeholder = "Select",
  required = false,
  value
}: {
  ariaLabel?: string;
  name?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  options: WorkspaceSelectOption[];
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <Select name={name} required={required} disabled={disabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel ?? placeholder}
        className="h-11 w-full rounded-md border-border/80 bg-background text-sm shadow-sm"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="z-[160] rounded-md border-border/80">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="rounded-sm">
            <span className="flex items-center gap-2">
              {option.swatchClassName ? (
                <span
                  aria-hidden="true"
                  className={`size-2.5 shrink-0 rounded-full ${option.swatchClassName}`}
                />
              ) : null}
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
