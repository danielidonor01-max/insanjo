import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import { cn } from "../../utils/cn";

const COLLAPSE_KEY = "insanjo_sidebar_collapsed";

function getInitialCollapsed() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function StoreLayout({ children, searchValue, onSearchChange }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* storage unavailable — collapse state just won't persist */
    }
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-store-bg">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div
        className={cn(
          "min-w-0 transition-[padding] duration-200 ease-out",
          collapsed ? "lg:pl-17" : "lg:pl-64",
        )}
      >
        <TopHeader
          sidebarCollapsed={collapsed}
          onExpandSidebar={() => setCollapsed(false)}
          onMobileMenuClick={() => setMobileNavOpen(true)}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        {children}
      </div>
    </div>
  );
}
