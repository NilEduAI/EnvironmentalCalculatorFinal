import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_CONFIG } from "@/lib/config";
import { 
  BarChart, 
  Cloud, 
  Calendar, 
  Users, 
  Lightbulb, 
  Mail, 
  ThumbsUp,
  RotateCcw,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsStepProps {
  calculationId?: number;
  dailyEmissions: number;
  weeklyEmissions: number;
  yearlyEmissions: number;
  onPrevious: () => void;
  onRestart: () => void;
}

export function ResultsStep({
  calculationId,
  dailyEmissions,
  weeklyEmissions,
  yearlyEmissions,
  onPrevious,
  onRestart,
}: ResultsStepProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Get average emissions for comparison
  const { data: averageData } = useQuery({
    queryKey: [API_CONFIG.endpoints.averageEmissions],
  });

  const averageDaily = (averageData as { averageDaily?: number })?.averageDaily || 3.2;
  const comparisonPercentage = Math.round(((averageDaily - dailyEmissions) / averageDaily) * 100);
  const progressPercentage = Math.min((dailyEmissions / averageDaily) * 100, 100);

  // Register student mutation
  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; calculationId: number }) => {
      const response = await apiRequest('POST', API_CONFIG.endpoints.registerStudent, data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "¡Registro exitoso!",
        description: "Recibirás tu informe personalizado por email.",
      });
      setName('');
      setEmail('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo completar el registro. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSendReport = () => {
    if (!name.trim() || !email.trim() || !calculationId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      calculationId,
    });
  };

  const homeRecommendations = [
    "Usa LED de bajo consumo energético",
    "Desenchufa dispositivos cuando no los uses",
    "Optimiza la calefacción (18-20°C)",
    "Aprovecha la luz natural durante el día",
  ];

  const schoolRecommendations = [
    "Usa transporte compartido cuando sea posible",
    "Lleva botella reutilizable",
    "Recicla papel y plástico correctamente",
    "Participa en iniciativas verdes del instituto",
  ];

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center mb-6">
        <BarChart className="text-green-600 text-2xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">{t('resultsTitle')}</h2>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl p-6 text-center">
          <Cloud className="mx-auto mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">{t('dailyEmissions')}</h3>
          <p className="text-3xl font-bold">{dailyEmissions.toFixed(2)}</p>
          <p className="text-sm opacity-90">{t('kgCO2eDay')}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-6 text-center">
          <Calendar className="mx-auto mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">{t('weeklyEmissions')}</h3>
          <p className="text-3xl font-bold">{weeklyEmissions.toFixed(2)}</p>
          <p className="text-sm opacity-90">{t('kgCO2eWeek')}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-xl p-6 text-center">
          <Calendar className="mx-auto mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">{t('yearlyEmissions')}</h3>
          <p className="text-3xl font-bold">{Math.round(yearlyEmissions)}</p>
          <p className="text-sm opacity-90">{t('kgCO2eYear')}</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="text-green-600 mr-2" />
          {t('comparison')}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('yourImpact')}</p>
            <p className="text-2xl font-bold text-green-600">{dailyEmissions.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{t('kgCO2eDay')}</p>
          </div>
          <div className="flex-1 mx-6">
            <div className="bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-green-600 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              ></div>
              <div 
                className="absolute top-0 right-0 w-1 h-4 bg-red-500 rounded-r-full" 
                title={`${t('average')}: ${averageDaily}`}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{t('average')}: {averageDaily}</span>
              <span>5 kg</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('average')}</p>
            <p className="text-2xl font-bold text-red-500">{averageDaily}</p>
            <p className="text-xs text-gray-500">{t('kgCO2eDay')}</p>
          </div>
        </div>
        {comparisonPercentage > 0 && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
            <ThumbsUp className="inline text-green-600 mr-2" size={20} />
            <span className="text-green-600 font-medium">
              {t('congratulations', { percentage: comparisonPercentage })}
            </span>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Lightbulb className="text-green-600 mr-2" />
          {t('recommendationsTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">🏠 {t('atHome')}</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {homeRecommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">🏫 {t('atSchool')}</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {schoolRecommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Mail className="text-green-600 mr-2" />
          {t('registrationTitle')}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('registrationDesc')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="name">{t('namePlaceholder')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">{t('emailPlaceholder')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="mt-1"
            />
          </div>
        </div>
        <Button 
          onClick={handleSendReport}
          disabled={registerMutation.isPending || !name.trim() || !email.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {registerMutation.isPending ? (
            "Enviando..."
          ) : (
            <>
              <Send className="mr-2" size={16} />
              {t('sendReport')}
            </>
          )}
        </Button>
      </div>

      <div className="flex justify-between">
        <Button 
          onClick={onPrevious}
          variant="outline"
          className="border-gray-500 text-gray-600 hover:bg-gray-50"
        >
          <span className="mr-2">←</span>
          {t('previous')}
        </Button>
        <Button 
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <RotateCcw className="mr-2" size={16} />
          {t('restart')}
        </Button>
      </div>
    </Card>
  );
}
