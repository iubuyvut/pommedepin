import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "reports">("overview");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de Bord
            </h1>
            <p className="text-muted-foreground mt-1">
              Bienvenue, {user?.name || "Utilisateur"}
            </p>
          </div>
          <Button className="btn-primary btn-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Dépense
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dépenses</p>
                <p className="text-2xl font-bold text-foreground mt-2">€0.00</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold text-foreground mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solde Net</p>
                <p className="text-2xl font-bold text-secondary mt-2">€0.00</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex-center">
                <AlertCircle className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Aperçu" },
              { id: "transactions", label: "Transactions" },
              { id: "reports", label: "Rapports" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card className="p-8">
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-lg bg-muted/50 flex-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Aucune dépense pour le moment
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Commencez par ajouter une dépense pour voir votre tableau de bord se remplir.
                  </p>
                  <Button className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une Dépense
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "transactions" && (
            <Card className="p-8">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Aucune transaction enregistrée
                </p>
              </div>
            </Card>
          )}

          {activeTab === "reports" && (
            <Card className="p-8">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Les rapports seront disponibles une fois des dépenses ajoutées
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
