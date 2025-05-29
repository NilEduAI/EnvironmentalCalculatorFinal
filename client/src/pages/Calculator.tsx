import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useMutation } from "@tanstack/react-query";
import { Link } from 'wouter';
import { BookOpen } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProgressStepper } from "@/components/ProgressStepper";
import { TransportationStep } from "@/components/TransportationStep";
import { HabitsStep } from "@/components/HabitsStep";
import { ResultsStep } from "@/components/ResultsStep";
import { type TransportMethod, type HydrationHabit, type PackagingHabit } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Calculator() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState<number>(0);
  const [transportMethod, setTransportMethod] = useState<TransportMethod | ''>('');
  const [hydrationHabit, setHydrationHabit] = useState<HydrationHabit | ''>('');
  const [packagingHabit, setPackagingHabit] = useState<PackagingHabit | ''>('');
  
  // Results state
  const [calculationId, setCalculationId] = useState<number>();
  const [dailyEmissions, setDailyEmissions] = useState<number>(0);
  const [weeklyEmissions, setWeeklyEmissions] = useState<number>(0);
  const [yearlyEmissions, setYearlyEmissions] = useState<number>(0);

  const steps = [t('transport'), t('habits'), t('results')];

  // Calculate emissions mutation
  const calculateMutation = useMutation({
    mutationFn: async (data: {
      distance: number;
      transportMethod: TransportMethod;
      hydrationHabit: HydrationHabit;
      packagingHabit: PackagingHabit;
    }) => {
      const response = await apiRequest('POST', '/api/calculate', data);
      return response.json();
    },
    onSuccess: (data) => {
      setCalculationId(data.calculationId);
      setDailyEmissions(data.dailyEmissions);
      setWeeklyEmissions(data.weeklyEmissions);
      setYearlyEmissions(data.yearlyEmissions);
      setCurrentStep(2);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo calcular las emisiones. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculate = () => {
    if (transportMethod && hydrationHabit && packagingHabit) {
      calculateMutation.mutate({
        distance,
        transportMethod: transportMethod as TransportMethod,
        hydrationHabit: hydrationHabit as HydrationHabit,
        packagingHabit: packagingHabit as PackagingHabit,
      });
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setDistance(0);
    setTransportMethod('');
    setHydrationHabit('');
    setPackagingHabit('');
    setCalculationId(undefined);
    setDailyEmissions(0);
    setWeeklyEmissions(0);
    setYearlyEmissions(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageSelector />
      
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/80 to-blue-600/70 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=1000')"
          }}
        ></div>
        
        <div className="relative z-20 max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex items-center justify-center space-x-4 text-white/80">
            <span className="text-2xl">🌱</span>
            <span className="text-lg">{t('tagline')}</span>
            <span className="text-2xl">🧮</span>
          </div>
          
          {/* Documentation Link */}
          <div className="mt-8">
            <Link href="/documentacion">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Documentación Técnica
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Application */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ProgressStepper currentStep={currentStep} steps={steps} />

        {currentStep === 0 && (
          <TransportationStep
            distance={distance}
            setDistance={setDistance}
            transportMethod={transportMethod}
            setTransportMethod={setTransportMethod}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 1 && (
          <HabitsStep
            hydrationHabit={hydrationHabit}
            setHydrationHabit={setHydrationHabit}
            packagingHabit={packagingHabit}
            setPackagingHabit={setPackagingHabit}
            onNext={handleCalculate}
            onPrevious={handlePrevStep}
          />
        )}

        {currentStep === 2 && (
          <ResultsStep
            calculationId={calculationId}
            dailyEmissions={dailyEmissions}
            weeklyEmissions={weeklyEmissions}
            yearlyEmissions={yearlyEmissions}
            onPrevious={handlePrevStep}
            onRestart={handleRestart}
          />
        )}

        {/* Footer Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center mt-8">
          <p className="text-sm text-gray-600 mb-2 flex items-center justify-center">
            <span className="text-green-600 mr-1">ℹ️</span>
            {t('footerInfo')}
          </p>
          <p className="text-xs text-gray-500">
            {t('footerData')}
          </p>
        </div>
      </main>
    </div>
  );
}
