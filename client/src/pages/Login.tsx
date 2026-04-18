import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-6">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestion de Flux Financiers
          </h1>
          <p className="text-muted-foreground">
            Plateforme SaaS B2B pour la répartition de charges professionnelle
          </p>
        </div>

        {/* Card */}
        <div className="card border-border/50 shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Bienvenue
              </h2>
              <p className="text-sm text-muted-foreground">
                Connectez-vous pour accéder à votre tableau de bord de gestion
                financière.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Fonctionnalités Premium
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Gestion centralisée des dépenses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Justificatifs et pièces jointes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Répartition avancée par pourcentage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Rapports PDF/CSV professionnels
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="w-full btn-primary btn-lg"
              >
                Se connecter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Plateforme sécurisée avec authentification OAuth
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2026 Gestion de Flux Financiers. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
