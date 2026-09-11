import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

const BASE_OPTIONS = [{ value: "default", label: "Featured" }, { value: "name-asc", label: "Name: A–Z" }];

const PRICE_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortMenu({ value, onChange, hasPrices }) {
  const options = hasPrices ? [...BASE_OPTIONS, ...PRICE_OPTIONS] : BASE_OPTIONS;
  const current = options.find((o) => o.value === value) || options[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-store-control border border-store-border bg-store-surface px-3.5 py-2 text-sm font-medium text-store-fg transition-colors hover:bg-store-surface-hover"
        >
          {current.label}
          <ChevronDown size={14} className="text-store-muted" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-30 w-52 overflow-hidden rounded-store-card border border-store-border bg-store-surface p-1 shadow-lg"
        >
          {options.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              onSelect={() => onChange(opt.value)}
              className="flex cursor-pointer select-none items-center justify-between rounded-store-control px-3 py-2 text-sm text-store-muted-fg outline-none transition-colors data-[highlighted]:bg-store-surface-hover data-[highlighted]:text-store-fg"
            >
              {opt.label}
              {value === opt.value && <Check size={14} className="text-store-primary" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
