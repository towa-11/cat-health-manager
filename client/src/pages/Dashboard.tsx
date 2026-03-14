import { useAuth } from "@/_core/hooks/useAuth";
import { CatDashboardLayout } from "@/components/CatDashboardLayout";
import { CatProfileForm } from "@/components/CatProfileForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Activity, Droplet, Heart, Utensils } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCatId, setSelectedCatId] = useState<number | undefined>();
  const [showAddCatDialog, setShowAddCatDialog] = useState(false);

  // Queries
  const catsQuery = trpc.cats.list.useQuery(undefined, {
    enabled: isAuthenticated && !loading,
  });

  // Mutations
  const createCatMutation = trpc.cats.create.useMutation({
    onSuccess: () => {
      catsQuery.refetch();
      setShowAddCatDialog(false);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold gradient-text">ねこの体調管理</h1>
          <p className="text-muted-foreground text-lg">
            あなたの大切な猫ちゃんの健康を優雅に管理しましょう
          </p>
        </div>
        <Button
          onClick={() => navigate("/login")}
          className="btn-elegant-primary"
        >
          ログインして始める
        </Button>
      </div>
    );
  }

  const cats = catsQuery.data || [];
  const selectedCat = cats.find((c) => c.id === selectedCatId);

  return (
    <CatDashboardLayout
      selectedCatId={selectedCatId}
      onSelectCat={setSelectedCatId}
      cats={cats}
      onAddCat={() => setShowAddCatDialog(true)}
    >
      {/* Main Content */}
      <div className="space-y-8">
        {/* Welcome Section */}
        {cats.length === 0 ? (
          <Card className="card-elegant text-center py-12">
            <div className="space-y-4">
              <div className="text-5xl">🐱</div>
              <h2 className="text-2xl font-semibold">ようこそ！</h2>
              <p className="text-muted-foreground">
                まずは、あなたの猫ちゃんを登録してください。
              </p>
              <Button
                onClick={() => setShowAddCatDialog(true)}
                className="btn-elegant-primary"
              >
                最初の猫ちゃんを登録
              </Button>
            </div>
          </Card>
        ) : selectedCat ? (
          <>
            {/* Cat Header */}
            <div className="card-elegant">
              <div className="flex items-start gap-6">
                {selectedCat.photoUrl && (
                  <img
                    src={selectedCat.photoUrl}
                    alt={selectedCat.name}
                    className="w-32 h-32 rounded-lg object-cover border border-border"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold gradient-text mb-2">
                    {selectedCat.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedCat.age && (
                      <div>
                        <span className="text-muted-foreground">年齢</span>
                        <p className="font-medium">{selectedCat.age}歳</p>
                      </div>
                    )}
                    {selectedCat.breed && (
                      <div>
                        <span className="text-muted-foreground">品種</span>
                        <p className="font-medium">{selectedCat.breed}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard
                icon={<Utensils className="h-6 w-6" />}
                title="食事を記録"
                description="今日の食事"
                onClick={() => navigate("/records/meal")}
              />
              <QuickActionCard
                icon={<Droplet className="h-6 w-6" />}
                title="排泄を記録"
                description="トイレの状態"
                onClick={() => navigate("/records/excretion")}
              />
              <QuickActionCard
                icon={<Heart className="h-6 w-6" />}
                title="体調を記録"
                description="元気度・食欲"
                onClick={() => navigate("/records/health")}
              />
              <QuickActionCard
                icon={<Activity className="h-6 w-6" />}
                title="体重を記録"
                description="体重管理"
                onClick={() => navigate("/records/weight")}
              />
            </div>

            {/* Recent Records */}
            <Card className="card-elegant">
              <h3 className="text-xl font-semibold mb-4">最近の記録</h3>
              <div className="text-center py-8 text-muted-foreground">
                <p>記録がまだありません</p>
              </div>
            </Card>
          </>
        ) : (
          <Card className="card-elegant text-center py-12">
            <p className="text-muted-foreground">
              左から猫ちゃんを選択してください
            </p>
          </Card>
        )}
      </div>

      {/* Add Cat Dialog */}
      <Dialog open={showAddCatDialog} onOpenChange={setShowAddCatDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新しい猫ちゃんを登録</DialogTitle>
          </DialogHeader>
          <CatProfileForm
            onSubmit={async (data) => {
              await createCatMutation.mutateAsync(data);
            }}
            isLoading={createCatMutation.isPending}
            onCancel={() => setShowAddCatDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </CatDashboardLayout>
  );
}

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickActionCard({
  icon,
  title,
  description,
  onClick,
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="card-elegant text-left hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}
