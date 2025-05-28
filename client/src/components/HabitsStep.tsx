import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { Droplets, Utensils, PillBottle, Coffee, Square, Recycle } from "lucide-react";
import { type HydrationHabit, type PackagingHabit } from "@shared/schema";

interface HabitsStepProps {
  hydrationHabit: HydrationHabit | '';
  setHydrationHabit: (habit: HydrationHabit) => void;
  packagingHabit: PackagingHabit | '';
  setPackagingHabit: (habit: PackagingHabit) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const hydrationOptions = [
  { 
    value: 'plastic-bottle' as HydrationHabit, 
    icon: PillBottle, 
    color: 'text-red-500',
    bgColor: 'hover:bg-red-50'
  },
  { 
    value: 'steel-bottle' as HydrationHabit, 
    icon: PillBottle, 
    color: 'text-green-500',
    bgColor: 'hover:bg-green-50'
  },
  { 
    value: 'soft-drinks' as HydrationHabit, 
    icon: Coffee, 
    color: 'text-yellow-500',
    bgColor: 'hover:bg-yellow-50'
  },
];

const packagingOptions = [
  { 
    value: 'aluminum-foil' as PackagingHabit, 
    icon: Square, 
    color: 'text-yellow-500',
    bgColor: 'hover:bg-yellow-50'
  },
  { 
    value: 'zero-waste' as PackagingHabit, 
    icon: Recycle, 
    color: 'text-green-500',
    bgColor: 'hover:bg-green-50'
  },
];

export function HabitsStep({
  hydrationHabit,
  setHydrationHabit,
  packagingHabit,
  setPackagingHabit,
  onNext,
  onPrevious,
}: HabitsStepProps) {
  const { t } = useTranslation();

  const getHydrationLabel = (habit: HydrationHabit) => {
    const labels: Record<HydrationHabit, string> = {
      'plastic-bottle': t('plasticBottle'),
      'steel-bottle': t('steelBottle'),
      'soft-drinks': t('softDrinks'),
    };
    return labels[habit];
  };

  const getHydrationDesc = (habit: HydrationHabit) => {
    const descriptions: Record<HydrationHabit, string> = {
      'plastic-bottle': t('plasticBottleDesc'),
      'steel-bottle': t('steelBottleDesc'),
      'soft-drinks': t('softDrinksDesc'),
    };
    return descriptions[habit];
  };

  const getPackagingLabel = (habit: PackagingHabit) => {
    const labels: Record<PackagingHabit, string> = {
      'aluminum-foil': t('aluminumFoil'),
      'zero-waste': t('zeroWaste'),
    };
    return labels[habit];
  };

  const getPackagingDesc = (habit: PackagingHabit) => {
    const descriptions: Record<PackagingHabit, string> = {
      'aluminum-foil': t('aluminumFoilDesc'),
      'zero-waste': t('zeroWasteDesc'),
    };
    return descriptions[habit];
  };

  const isFormValid = hydrationHabit !== '' && packagingHabit !== '';

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center mb-6">
        <Droplets className="text-green-600 text-2xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">{t('habitsTitle')}</h2>
      </div>

      {/* Hydration Habits */}
      <div className="mb-8">
        <Label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Droplets className="text-green-600 mr-2" size={16} />
          {t('hydrationQuestion')}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hydrationOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = hydrationHabit === option.value;
            
            return (
              <div
                key={option.value}
                onClick={() => setHydrationHabit(option.value)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : `border-gray-200 ${option.bgColor}`
                }`}
              >
                <div className="text-center">
                  <Icon className={`mx-auto mb-2 ${option.color}`} size={32} />
                  <p className="font-medium text-gray-800">
                    {getHydrationLabel(option.value)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getHydrationDesc(option.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Food Packaging */}
      <div className="mb-8">
        <Label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Utensils className="text-green-600 mr-2" size={16} />
          {t('packagingQuestion')}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packagingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = packagingHabit === option.value;
            
            return (
              <div
                key={option.value}
                onClick={() => setPackagingHabit(option.value)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : `border-gray-200 ${option.bgColor}`
                }`}
              >
                <div className="text-center">
                  <Icon className={`mx-auto mb-2 ${option.color}`} size={32} />
                  <p className="font-medium text-gray-800">
                    {getPackagingLabel(option.value)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getPackagingDesc(option.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
          onClick={onNext}
          disabled={!isFormValid}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {t('calculate')}
          <span className="ml-2">🧮</span>
        </Button>
      </div>
    </Card>
  );
}
