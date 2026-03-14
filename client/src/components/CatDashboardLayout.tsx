import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Plus, Settings } from "lucide-react";
import { ReactNode } from "react";
import { useLocation } from "wouter";

interface CatDashboardLayoutProps {
  children: ReactNode;
  selectedCatId?: number;
  onSelectCat?: (catId: number) => void;
  cats?: Array<{ id: number; name: string }>;
  onAddCat?: () => void;
}

export function CatDashboardLayout({
  children,
  selectedCatId,
  onSelectCat,
  cats = [],
  onAddCat,
}: CatDashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">🐱</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">ねこの体調管理</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-sidebar p-6 space-y-6">
          {/* Cat Selection */}
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground mb-4">
              あなたの猫ちゃん
            </h2>
            <div className="space-y-2">
              {cats.length === 0 ? (
                <p className="text-xs text-sidebar-foreground/60">
                  猫ちゃんを追加してください
                </p>
              ) : (
                cats.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCat?.(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                      selectedCatId === cat.id
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                    }`}
                  >
                    <span className="text-lg mr-2">🐾</span>
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Add Cat Button */}
          <Button
            onClick={onAddCat}
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            新しい猫を追加
          </Button>

          {/* Navigation */}
          <nav className="space-y-2 pt-6 border-t border-sidebar-border">
            <NavLink href="/dashboard" label="ダッシュボード" />
            <NavLink href="/records" label="記録一覧" />
            <NavLink href="/analytics" label="分析" />
            <NavLink href="/settings" label="設定" icon={<Settings className="h-4 w-4" />} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon?: ReactNode;
}

function NavLink({ href, label, icon }: NavLinkProps) {
  const [location, navigate] = useLocation();
  const isActive = location === href;

  return (
    <button
      onClick={() => navigate(href)}
      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/20"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
