import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Store, Download, X, ChevronsLeft, ChevronsRight, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { InsanjoMark } from "../Logo";
import { cn } from "../../utils/cn";

const NAV_GROUPS = [
  {
    label: "Discover",
    items: [
      { label: "Home", href: "/", icon: Home, match: (p) => p === "/" },
      { label: "Find Stores", href: "/stores", icon: Compass, match: (p) => p.startsWith("/stores") },
    ],
  },
  {
    label: "Current Store",
    items: [
      { label: "This Store", href: "#top", icon: Store, match: (p) => p.startsWith("/store/"), isCurrent: true },
    ],
  },
  {
    label: "Utility",
    items: [
      { label: "Download App", href: "/download", icon: Download, match: (p) => p.startsWith("/download") },
    ],
  },
];

function NavLink({ item, active, collapsed, onNavigate }) {
  const Icon = item.icon;
  const classes = cn(
    "group relative flex items-center gap-3 rounded-store-control px-3 py-2 text-sm font-medium transition-colors",
    collapsed && "justify-center px-0",
    active ? "bg-store-surface-hover text-store-fg" : "text-store-muted-fg hover:bg-store-surface-hover hover:text-store-fg",
  );

  const inner = (
    <>
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-store-primary" />
      )}
      <Icon size={18} strokeWidth={active ? 2.1 : 1.75} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </>
  );

  const El = item.isCurrent ? "a" : Link;
  const elProps = item.isCurrent ? { href: item.href } : { to: item.href };

  const link = (
    <El {...elProps} onClick={onNavigate} className={classes} aria-current={active ? "page" : undefined}>
      {inner}
    </El>
  );

  if (!collapsed) return link;

  return (
    <Tooltip.Root delayDuration={200}>
      <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={10}
          className="z-80 rounded-store-control border border-store-border bg-store-surface px-2.5 py-1.5 text-xs font-medium text-store-fg shadow-md"
        >
          {item.label}
          <Tooltip.Arrow className="fill-store-surface" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function NavGroups({ pathname, collapsed, onNavigate }) {
  return (
    <nav className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-store-muted">
              {group.label}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                active={item.match(pathname)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarPromo() {
  return (
    <Link
      to="/download"
      className="group relative mt-3 block overflow-hidden rounded-store-card border border-store-border transition-colors hover:border-store-fg/20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl"
          style={{ background: "var(--pattern-royal)", opacity: "var(--pattern-glow-opacity)" }}
        />
        <div
          className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full blur-2xl"
          style={{ background: "var(--pattern-cyan)", opacity: "calc(var(--pattern-glow-opacity) * 0.7)" }}
        />
      </div>
      <div className="relative z-10 flex flex-col gap-1.5 bg-store-surface/60 p-4 backdrop-blur-sm">
        <Sparkles size={15} className="text-store-primary" />
        <p className="text-sm font-semibold text-store-fg">Get the Insanjo app</p>
        <p className="text-xs leading-relaxed text-store-muted-fg">
          Discover more vendors near you, on the go.
        </p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-store-primary">
          Download
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function BrandMark({ collapsed }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-store-control bg-store-fg">
        <InsanjoMark size={18} className="brightness-0 invert dark:invert-0" />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-store-fg">Insanjo</p>
          <p className="truncate text-[11px] text-store-muted">Vendor Marketplace</p>
        </div>
      )}
    </Link>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }) {
  const { pathname } = useLocation();

  return (
    <Tooltip.Provider delayDuration={200}>
      {/* ── Desktop fixed sidebar ─────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-store-border bg-store-surface px-3 py-5 lg:flex"
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between px-1")}>
          <BrandMark collapsed={collapsed} />
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          <NavGroups pathname={pathname} collapsed={collapsed} />
          {!collapsed && <SidebarPromo />}
        </div>

        <div className="flex flex-col gap-0.5 border-t border-store-border pt-3">
          <Tooltip.Root delayDuration={200}>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-pressed={collapsed}
                className={cn(
                  "flex items-center gap-3 rounded-store-control px-3 py-2 text-sm font-medium text-store-muted-fg transition-colors hover:bg-store-surface-hover hover:text-store-fg",
                  collapsed && "justify-center px-0",
                )}
              >
                {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
                {!collapsed && "Collapse"}
              </button>
            </Tooltip.Trigger>
            {collapsed && (
              <Tooltip.Portal>
                <Tooltip.Content side="right" sideOffset={10} className="z-80 rounded-store-control border border-store-border bg-store-surface px-2.5 py-1.5 text-xs font-medium text-store-fg shadow-md">
                  Expand sidebar
                  <Tooltip.Arrow className="fill-store-surface" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </div>
      </motion.aside>

      {/* ── Mobile drawer ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-70 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-75 flex w-72 max-w-[80vw] flex-col border-r border-store-border bg-store-surface px-4 py-5 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <BrandMark collapsed={false} />
                <button
                  type="button"
                  onClick={onMobileClose}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full border border-store-border text-store-muted-fg transition-colors hover:bg-store-surface-hover hover:text-store-fg"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-8 flex-1 overflow-y-auto">
                <NavGroups pathname={pathname} collapsed={false} onNavigate={onMobileClose} />
                <SidebarPromo />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Tooltip.Provider>
  );
}
