import { useEffect, useRef } from "react";
import { Menu, Search, X, PanelLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export default function TopHeader({
  sidebarCollapsed,
  onExpandSidebar,
  onMobileMenuClick,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search products in this store…",
}) {
  const { isDark, toggleTheme } = useTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-store-border bg-store-bg/90 px-5 py-3.5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuClick}
          aria-label="Open menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-store-control border border-store-border bg-store-surface text-store-fg transition-colors hover:bg-store-surface-hover lg:hidden"
        >
          <Menu size={17} />
        </button>

        {sidebarCollapsed && (
          <button
            type="button"
            onClick={onExpandSidebar}
            aria-label="Expand sidebar"
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-store-control border border-store-border bg-store-surface text-store-fg transition-colors hover:bg-store-surface-hover lg:grid"
          >
            <PanelLeft size={16} />
          </button>
        )}

        {onSearchChange ? (
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-store-muted"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-store-control border border-store-border bg-store-surface py-2.5 pl-10 pr-16 text-sm text-store-fg placeholder:text-store-muted outline-none transition-colors focus:border-store-primary"
            />
            {searchValue ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-store-muted hover:text-store-fg"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded border border-store-border bg-store-bg px-1.5 py-0.5 text-[10px] font-medium text-store-muted sm:flex">
                /
              </kbd>
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-store-control border border-store-border bg-store-surface text-store-fg transition-colors hover:bg-store-surface-hover"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
