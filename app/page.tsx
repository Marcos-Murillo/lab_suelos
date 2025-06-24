"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, FileText, Calculator } from "lucide-react"
import RockAnalysis from "@/components/rock-analysis"
import SoilAnalysis from "@/components/soil-analysis"
import ReportGenerator from "@/components/report-generator"

export default function SoilLabAnalyzer() {
  const [activeTab, setActiveTab] = useState("rock")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FlaskConical className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Laboratorio de Suelos</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema de análisis para propiedades índice de suelos según normas ASTM/INV E-128-11
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✓ Norma INV E-128-11
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Calculator className="h-3 w-3 mr-1" />
              Cálculos Automáticos
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <FileText className="h-3 w-3 mr-1" />
              Reportes PDF
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="rock" className="text-sm font-medium">
              Análisis de Rocas
            </TabsTrigger>
            <TabsTrigger value="soil" className="text-sm font-medium">
              Análisis de Suelos
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-sm font-medium">
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rock">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Propiedades Índice - Muestras de Roca
                </CardTitle>
                <CardDescription>
                  Ingrese los datos de masa y temperatura para calcular las propiedades físicas de la muestra de roca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RockAnalysis />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soil">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Propiedades Índice - Muestras de Suelo
                </CardTitle>
                <CardDescription>Análisis completo de suelos con parafina y validación de consistencia</CardDescription>
              </CardHeader>
              <CardContent>
                <SoilAnalysis />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generador de Reportes
                </CardTitle>
                <CardDescription>Genere reportes técnicos en formato PDF con validaciones ASTM</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
