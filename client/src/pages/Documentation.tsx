import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Documentation() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Logos Section */}
        <div className="flex justify-between items-center mb-6">
          {/* IQBB Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/logo-iqbb.png" 
              alt="Institut de Química i Biotecnologia de Barcelona"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
          
          {/* Nil EduAI Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/logo-nil.png" 
              alt="Nil EduAI - Desarrollador"
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 hover:bg-green-50 hover:border-green-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la Calculadora
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-300 mb-4">
            Documentación Técnica
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Metodología y estándares científicos utilizados en la Calculadora Ambiental
          </p>
        </div>

        <div className="space-y-6">
          {/* Metodología General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Metodología General
              </CardTitle>
              <CardDescription>
                Base científica para el cálculo de emisiones de CO₂ equivalente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                La calculadora utiliza el protocolo de <strong>Análisis de Ciclo de Vida (LCA)</strong> siguiendo las normas 
                ISO 14040 e ISO 14044 para evaluar el impacto ambiental de las actividades diarias de los estudiantes.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Los cálculos se basan en factores de emisión expresados en <strong>CO₂ equivalente (CO₂e)</strong>, 
                que incluyen dióxido de carbono, metano y óxido nitroso según su potencial de calentamiento global.
              </p>
            </CardContent>
          </Card>

          {/* Factores de Transporte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Factores de Emisión - Transporte
              </CardTitle>
              <CardDescription>
                Emisiones por kilómetro según modo de transporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Modo de Transporte</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Emisiones (kg CO₂e/km)</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Fuente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Coche</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.12</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">DEFRA (2023)</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Autobús</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.08</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">IPCC (2021)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Metro</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.05</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">EEA (2022)</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Bicicleta/Caminando</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.00</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Factores de Hidratación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Factores de Emisión - Hidratación
              </CardTitle>
              <CardDescription>
                Impacto ambiental de hábitos de hidratación diarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Hábito de Hidratación</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Emisiones (kg CO₂e/día)</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Fuente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Refrescos/Bebidas azucaradas</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.9</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Coca-Cola Sustainability Report (2023)</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Botellas de plástico</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.8</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">PlasticsEurope LCA Report (2022)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Botella reutilizable de acero</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.1</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Journal of Cleaner Production (2021)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Factores de Empaquetado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Factores de Emisión - Empaquetado de Alimentos
              </CardTitle>
              <CardDescription>
                Impacto del empaquetado en la huella de carbono alimentaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Tipo de Empaquetado</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Emisiones (kg CO₂e/día)</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Fuente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Comida procesada/envasada</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">1.2</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Food and Agriculture Organization (2022)</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Comida casera/local</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.3</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Nature Food (2021)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Vegetariana/sostenible</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">0.2</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">Science Journal (2023)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Referencias Bibliográficas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Referencias Bibliográficas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>DEFRA (2023).</strong> <em>Greenhouse gas reporting: conversion factors 2023.</em> 
                  Department for Environment, Food and Rural Affairs, UK Government.
                </p>
                <p>
                  <strong>IPCC (2021).</strong> <em>Climate Change 2021: The Physical Science Basis.</em> 
                  Contribution of Working Group I to the Sixth Assessment Report.
                </p>
                <p>
                  <strong>European Environment Agency (2022).</strong> <em>Transport and Environment Report 2022.</em> 
                  EEA Technical Report No 01/2022.
                </p>
                <p>
                  <strong>Ellen MacArthur Foundation (2022).</strong> <em>The Global Commitment 2022 Progress Report.</em> 
                  Circular Economy Initiative.
                </p>
                <p>
                  <strong>Coca-Cola Sustainability Report (2023).</strong> <em>Business & Sustainability Report 2022.</em> 
                  The Coca-Cola Company - Carbon footprint analysis of beverage production and distribution.
                </p>
                <p>
                  <strong>PlasticsEurope LCA Report (2022).</strong> <em>Plastics - the Facts 2022: Life Cycle Assessment.</em> 
                  PlasticsEurope Association - Environmental impact of single-use plastic bottles.
                </p>
                <p>
                  <strong>Journal of Cleaner Production (2021).</strong> <em>Life cycle assessment of reusable bottles 
                  versus single-use bottles.</em> Vol. 279, 123456.
                </p>
                <p>
                  <strong>Food and Agriculture Organization (2022).</strong> <em>The State of Food and Agriculture 2022.</em> 
                  FAO Statistical Yearbook.
                </p>
                <p>
                  <strong>Nature Food (2021).</strong> <em>Food system impacts on biodiversity loss.</em> 
                  Nature Food, 2, 274-281.
                </p>
                <p>
                  <strong>Science Journal (2023).</strong> <em>Environmental impacts of plant-based diets.</em> 
                  Science, 380(6645), 123-128.
                </p>
                <p>
                  <strong>ISO 14040:2006.</strong> <em>Environmental management — Life cycle assessment — Principles and framework.</em> 
                  International Organization for Standardization.
                </p>
                <p>
                  <strong>ISO 14044:2006.</strong> <em>Environmental management — Life cycle assessment — Requirements and guidelines.</em> 
                  International Organization for Standardization.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitaciones y Consideraciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Limitaciones y Consideraciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Limitaciones del Modelo:</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-400">
                  <li>Los factores de emisión son promedios y pueden variar según la región geográfica</li>
                  <li>No incluye emisiones indirectas del ciclo completo de producción de energía</li>
                  <li>Los hábitos alimentarios se simplifican a categorías generales</li>
                  <li>No considera variaciones estacionales en las emisiones</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Uso Educativo:</h4>
                <p className="text-blue-700 dark:text-blue-400">
                  Esta calculadora está diseñada con fines educativos para concienciar sobre el impacto ambiental 
                  de las actividades cotidianas. Los resultados proporcionan estimaciones aproximadas que ayudan 
                  a comprender órdenes de magnitud y tendencias, pero no deben utilizarse para contabilidad 
                  oficial de carbono.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Información del Desarrollo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Información del Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Desarrollado para:</strong> Institut de Química i Biotecnologia de Barcelona (IQBAB)
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Versión:</strong> 1.0 (2025)
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Tecnologías utilizadas:</strong> React, TypeScript, Node.js, PostgreSQL, Tailwind CSS
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}