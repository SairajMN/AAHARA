import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
  permissions?: string[];
}

interface AdvancedTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: "default" | "pills" | "underlined" | "modern";
  size?: "sm" | "md" | "lg";
  searchable?: boolean;
  persistent?: boolean;
  closable?: boolean;
  lazy?: boolean;
  showScrollButtons?: boolean;
  className?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  allowedTabs?: string[];
}

export const AdvancedTabs: React.FC<AdvancedTabsProps> = ({
  tabs,
  defaultTab,
  variant = "default",
  size = "md",
  searchable = false,
  persistent = false,
  closable = false,
  lazy = true,
  showScrollButtons = true,
  className,
  onTabChange,
  onTabClose,
  allowedTabs = [],
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleTabs, setVisibleTabs] = useState<TabItem[]>(tabs);
  const [scrolled, setScrolled] = useState(false);

  // Filter tabs based on search query and permissions
  useEffect(() => {
    let filtered = tabs;
    
    if (searchQuery) {
      filtered = tabs.filter(tab =>
        tab.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (allowedTabs.length > 0) {
      filtered = filtered.filter(tab => 
        allowedTabs.includes(tab.id) || !tab.permissions
      );
    }
    
    setVisibleTabs(filtered);
  }, [tabs, searchQuery, allowedTabs]);

  // Tab persistence
  useEffect(() => {
    if (persistent && activeTab) {
      localStorage.setItem("advanced-tabs-active", activeTab);
    }
  }, [activeTab, persistent]);

  // Load persisted tab
  useEffect(() => {
    if (persistent) {
      const saved = localStorage.getItem("advanced-tabs-active");
      if (saved && tabs.find(tab => tab.id === saved)) {
        setActiveTab(saved);
      }
    }
  }, [persistent, tabs]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [onTabChange]);

  const handleTabClose = useCallback((tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onTabClose?.(tabId);
    
    // If closing active tab, switch to first available tab
    if (tabId === activeTab && visibleTabs.length > 1) {
      const currentIndex = visibleTabs.findIndex(tab => tab.id === tabId);
      const nextTab = visibleTabs[currentIndex + 1] || visibleTabs[currentIndex - 1];
      if (nextTab) {
        setActiveTab(nextTab.id);
      }
    }
  }, [activeTab, visibleTabs, onTabClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      
      const currentIndex = visibleTabs.findIndex(tab => tab.id === activeTab);
      
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (currentIndex > 0) {
            handleTabChange(visibleTabs[currentIndex - 1].id);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentIndex < visibleTabs.length - 1) {
            handleTabChange(visibleTabs[currentIndex + 1].id);
          }
          break;
        case "Home":
          e.preventDefault();
          handleTabChange(visibleTabs[0].id);
          break;
        case "End":
          e.preventDefault();
          handleTabChange(visibleTabs[visibleTabs.length - 1].id);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visibleTabs, activeTab, handleTabChange]);

  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base"
  };

  const variantClasses = {
    default: "bg-muted p-1 rounded-lg",
    pills: "bg-transparent space-x-1",
    underlined: "bg-transparent border-b border-border",
    modern: "bg-gradient-to-r from-primary/10 to-primary/5 p-1 rounded-xl"
  };

  const scrollToTab = (direction: "left" | "right") => {
    const container = document.getElementById("tabs-container");
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header with search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 flex items-center gap-4">
          {searchable && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tabs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
          
          <span className="text-sm text-muted-foreground">
            {visibleTabs.length} of {tabs.length} tabs
          </span>
        </div>
        
        {showScrollButtons && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToTab("left")}
              className="p-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToTab("right")}
              className="p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="relative">
          <TabsList className={cn(variantClasses[variant], "w-full justify-start overflow-x-auto scrollbar-hide", sizeClasses[size])}>
            <div
              id="tabs-container"
              className="flex gap-1 min-w-full"
              onScroll={() => setScrolled(true)}
            >
              <AnimatePresence>
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      disabled={tab.disabled}
                      className={cn(
                        "relative inline-flex items-center gap-2 whitespace-nowrap transition-all duration-200",
                        variant === "pills" && "rounded-full px-4",
                        variant === "underlined" && "rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                        variant === "modern" && "rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span className="truncate max-w-32">{tab.label}</span>
                      {tab.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                          {tab.badge}
                        </span>
                      )}
                      {closable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0.5 h-auto ml-1 opacity-60 hover:opacity-100"
                          onClick={(e) => handleTabClose(tab.id, e)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </TabsTrigger>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsList>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {visibleTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {lazy ? (
                  <LazyContent
                    content={tab.content}
                    isActive={tab.id === activeTab}
                  />
                ) : (
                  tab.content
                )}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

// Lazy loading component
const LazyContent: React.FC<{ content: React.ReactNode; isActive: boolean }> = ({
  content,
  isActive,
}) => {
  const [shouldRender, setShouldRender] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!shouldRender) return null;

  return <>{content}</>;
};

// Hook for tab state management
export const useAdvancedTabs = (initialTabs: TabItem[]) => {
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs);
  const [activeTab, setActiveTab] = useState(initialTabs[0]?.id || "");

  const addTab = useCallback((tab: TabItem) => {
    setTabs(prev => [...prev, tab]);
    setActiveTab(tab.id);
  }, []);

  const removeTab = useCallback((tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId && tabs.length > 1) {
      const currentIndex = tabs.findIndex(tab => tab.id === tabId);
      const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1];
      if (nextTab) {
        setActiveTab(nextTab.id);
      }
    }
  }, [activeTab, tabs]);

  const updateTab = useCallback((tabId: string, updates: Partial<TabItem>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  }, []);

  return {
    tabs,
    activeTab,
    setActiveTab,
    addTab,
    removeTab,
    updateTab,
    setTabs,
  };
};

export default AdvancedTabs;
