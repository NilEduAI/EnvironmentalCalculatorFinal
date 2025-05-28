import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { 
  Car, 
  Bike, 
  Footprints, 
  Users, 
  Bike as Motorcycle, 
  Bus, 
  Train, 
  Zap 
} from "lucide-react";
import { EMISSION_FACTORS, type TransportMethod } from "@shared/schema";

interface TransportationStepProps {
  distance: number;
  setDistance: (distance: number) => void;
  transportMethod: TransportMethod | '';
  setTransportMethod: (method: TransportMethod) => void;
  onNext: () => void;
}

const transportOptions = [
  { 
    value: 'walking' as TransportMethod, 
    icon: Footprints, 
    color: 'text-green-600',
    bgColor: 'hover:bg-green-50'
  },
  { 
    value: 'bicycle' as TransportMethod, 
    icon: Bike, 
    color: 'text-green-600',
    bgColor: 'hover:bg-green-50'
  },
  { 
    value: 'car-solo' as TransportMethod, 
    icon: Car, 
    color: 'text-orange-500',
    bgColor: 'hover:bg-orange-50'
  },
  { 
    value: 'car-shared' as TransportMethod, 
    icon: Users, 
    color: 'text-yellow-500',
    bgColor: 'hover:bg-yellow-50'
  },
  { 
    value: 'motorcycle' as TransportMethod, 
    icon: Motorcycle, 
    color: 'text-orange-500',
    bgColor: 'hover:bg-orange-50'
  },
  { 
    value: 'public-transport' as TransportMethod, 
    icon: Bus, 
    color: 'text-blue-600',
    bgColor: 'hover:bg-blue-50'
  },
  { 
    value: 'train' as TransportMethod, 
    icon: Train, 
    color: 'text-blue-600',
    bgColor: 'hover:bg-blue-50'
  },
  { 
    value: 'electric-car' as TransportMethod, 
    icon: Zap, 
    color: 'text-green-500',
    bgColor: 'hover:bg-green-50'
  },
];

export function TransportationStep({
  distance,
  setDistance,
  transportMethod,
  setTransportMethod,
  onNext,
}: TransportationStepProps) {
  const { t } = useTranslation();

  const getTransportLabel = (method: TransportMethod) => {
    const labels: Record<TransportMethod, string> = {
      walking: t('walking'),
      bicycle: t('bicycle'),
      'car-solo': t('carSolo'),
      'car-shared': t('carShared'),
      motorcycle: t('motorcycle'),
      'public-transport': t('publicTransport'),
      train: t('train'),
      'electric-car': t('electricCar'),
    };
    return labels[method];
  };

  const isFormValid = distance > 0 && transportMethod !== '';

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center mb-6">
        <Car className="text-green-600 text-2xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">{t('transportTitle')}</h2>
      </div>

      {/* Distance Input */}
      <div className="mb-8">
        <Label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <span className="mr-2">📏</span>
          {t('distanceLabel')}
        </Label>
        <Input
          type="number"
          step="0.1"
          min="0"
          value={distance || ''}
          onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
          className="w-full"
          placeholder={t('distancePlaceholder')}
        />
      </div>

      {/* Transportation Method */}
      <div className="mb-8">
        <Label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Car className="text-green-600 mr-2" size={16} />
          {t('selectTransport')}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transportOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = transportMethod === option.value;
            
            return (
              <div
                key={option.value}
                onClick={() => setTransportMethod(option.value)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : `border-gray-200 ${option.bgColor}`
                }`}
              >
                <div className="text-center">
                  <Icon className={`mx-auto mb-2 ${option.color}`} size={32} />
                  <p className="font-medium text-gray-800">
                    {getTransportLabel(option.value)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {EMISSION_FACTORS[option.value]} {t('kgCO2eKm')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!isFormValid}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {t('next')}
          <span className="ml-2">→</span>
        </Button>
      </div>
    </Card>
  );
}
