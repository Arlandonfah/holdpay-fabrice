import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/layout/navigation";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Calendar, Euro, User, Briefcase, ArrowLeft } from "lucide-react";

export default function CreatePaymentLink() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    projectName: "",
    description: "",
    amount: "",
    expirationDays: "7",
    pdfFile: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Format incorrect",
          description: "Seuls les fichiers PDF sont acceptés",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: "Fichier trop volumineux",
          description: "Le fichier ne doit pas dépasser 10MB",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, pdfFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation basique
    if (!formData.clientName || !formData.clientEmail || !formData.projectName || !formData.amount) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simulation de création de lien - à remplacer par l'API Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Lien créé avec succès !",
        description: "Votre lien de paiement a été généré et est prêt à être partagé"
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du lien",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-primary">Nouveau lien de paiement</h1>
          <p className="text-muted-foreground">
            Créez un lien sécurisé pour recevoir un paiement escrow
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Informations du projet
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations client */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations client
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nom du client *</Label>
                    <Input
                      id="clientName"
                      placeholder="Marie Dubois"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email du client *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="marie@example.com"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informations projet */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Détails du projet</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="projectName">Nom du projet *</Label>
                  <Input
                    id="projectName"
                    placeholder="Site vitrine restaurant"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    placeholder="Développement d'un site vitrine responsive avec système de réservation..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </div>

              {/* Montant et expiration */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Montant (€) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="2500"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expirationDays" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expiration (jours)
                  </Label>
                  <Input
                    id="expirationDays"
                    type="number"
                    min="1"
                    max="90"
                    value={formData.expirationDays}
                    onChange={(e) => handleInputChange("expirationDays", e.target.value)}
                  />
                </div>
              </div>

              {/* Upload PDF */}
              <div className="space-y-2">
                <Label htmlFor="pdfFile" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Document joint (PDF, optionnel)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="pdfFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {formData.pdfFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{formData.pdfFile.name}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Joignez votre devis, contrat ou cahier des charges (max 10MB)
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Annuler
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Créer le lien de paiement
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}