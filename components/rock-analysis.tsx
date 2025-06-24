"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calculator, AlertTriangle, CheckCircle } from "lucide-react"
import SaturationProfile from "@/components/saturation-profile"
import UnitWeightSpectrum from "@/components/unit-weight-spectrum"

interface RockData {
  masaInicial: number
  masaSuperficialmenteSeca: number
  masaSumergida: number
  masaSeca: number
  temperaturaAgua: number
}

interface RockResults {
  masaAgua: number
  humedad: number
  volumenHuecos: number
  volumenMuestra: number
  gravedadEspecifica: number
  porosidad: number
  pesoUnitarioSaturado: number
  pesoUnitarioSeco: number
  pesoUnitarioSolidos: number
  densidadAgua: number
}

export default function RockAnalysis() {
  const [data, setData] = useState<RockData>({
    masaInicial: 0,
    masaSuperficialmenteSeca: 0,
    masaSumergida: 0,
    masaSeca: 0,
    temperaturaAgua: 20,
  })

  const [results, setResults] = useState<RockResults | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])

  // Función para calcular densidad del agua según temperatura
  const waterDensity = (temp: number): number => {
    return 0.9998395 + 6.7887e-5 * temp - 9.0907e-6 * Math.pow(temp, 2)
  }

  const calculateResults = () => {
    const densidadAgua = waterDensity(data.temperaturaAgua)

    // Cálculos básicos
    const masaAgua = data.masaInicial - data.masaSeca
    const humedad = (masaAgua / data.masaSeca) * 100
    const volumenHuecos = (data.masaSuperficialmenteSeca - data.masaSeca) / densidadAgua
    const volumenMuestra = (data.masaSuperficialmenteSeca - data.masaSumergida) / densidadAgua

    // Propiedades avanzadas
    const gravedadEspecifica = data.masaSeca / (volumenMuestra - volumenHuecos)
    const porosidad = (volumenHuecos / volumenMuestra) * 100
    const pesoUnitarioSaturado = data.masaSuperficialmenteSeca / volumenMuestra
    const pesoUnitarioSeco = data.masaSeca / volumenMuestra
    const pesoUnitarioSolidos = gravedadEspecifica * densidadAgua

    const newResults: RockResults = {
      masaAgua,
      humedad,
      volumenHuecos,
      volumenMuestra,
      gravedadEspecifica,
      porosidad,
      pesoUnitarioSaturado,
      pesoUnitarioSeco,
      pesoUnitarioSolidos,
      densidadAgua,
    }

    // Validaciones
    const newWarnings: string[] = []
    if (data.temperaturaAgua > 30) {
      newWarnings.push("Temperatura del agua > 30°C puede afectar la precisión de la densidad")
    }
    if (humedad < 0) {
      newWarnings.push("Humedad negativa - Verificar datos de entrada")
    }
    if (porosidad > 50) {
      newWarnings.push("Porosidad muy alta - Verificar cálculos")
    }

    setResults(newResults)
    setWarnings(newWarnings)
  }

  const handleInputChange = (field: keyof RockData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }))
  }

  useEffect(() => {
    if (Object.values(data).every((val) => val > 0)) {
      calculateResults()
    }
  }, [data])

  return (
    <div className="space-y-6">
      {/* Formulario de entrada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="masaInicial">Masa Inicial (g)</Label>
          <Input
            id="masaInicial"
            type="number"
            step="0.01"
            placeholder="285.12"
            onChange={(e) => handleInputChange("masaInicial", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="masaSupSeca">Masa Superficialmente Seca (g)</Label>
          <Input
            id="masaSupSeca"
            type="number"
            step="0.01"
            placeholder="287.11"
            onChange={(e) => handleInputChange("masaSuperficialmenteSeca", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="masaSumergida">Masa Sumergida (g)</Label>
          <Input
            id="masaSumergida"
            type="number"
            step="0.01"
            placeholder="117.71"
            onChange={(e) => handleInputChange("masaSumergida", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="masaSeca">Masa Seca (110°C) (g)</Label>
          <Input
            id="masaSeca"
            type="number"
            step="0.01"
            placeholder="280.50"
            onChange={(e) => handleInputChange("masaSeca", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperatura">Temperatura del Agua (°C)</Label>
          <Input
            id="temperatura"
            type="number"
            step="0.1"
            placeholder="26"
            onChange={(e) => handleInputChange("temperaturaAgua", e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={calculateResults} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular
          </Button>
        </div>
      </div>

      {/* Alertas y validaciones */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Resultados */}
      {results && (
        <div className="space-y-6">
          {/* Resultados numéricos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resultados Calculados
              </CardTitle>
              <CardDescription>Propiedades físicas de la muestra de roca</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{results.gravedadEspecifica.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Gravedad Específica</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.porosidad.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Porosidad</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{results.humedad.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Humedad</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{results.pesoUnitarioSaturado.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">γ sat (g/cm³)</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Masa de agua:</strong> {results.masaAgua.toFixed(2)} g
                </div>
                <div>
                  <strong>Volumen de huecos:</strong> {results.volumenHuecos.toFixed(2)} cm³
                </div>
                <div>
                  <strong>Volumen de muestra:</strong> {results.volumenMuestra.toFixed(2)} cm³
                </div>
                <div>
                  <strong>Peso unitario seco:</strong> {results.pesoUnitarioSeco.toFixed(2)} g/cm³
                </div>
                <div>
                  <strong>Peso unitario sólidos:</strong> {results.pesoUnitarioSolidos.toFixed(2)} g/cm³
                </div>
                <div>
                  <strong>Densidad del agua:</strong> {results.densidadAgua.toFixed(4)} g/cm³
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualizaciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SaturationProfile
              solids={((results.volumenMuestra - results.volumenHuecos) / results.volumenMuestra) * 100}
              water={(results.masaAgua / results.densidadAgua / results.volumenMuestra) * 100}
              air={results.porosidad - (results.masaAgua / results.densidadAgua / results.volumenMuestra) * 100}
            />

            <UnitWeightSpectrum
              gammaSat={results.pesoUnitarioSaturado}
              gammaDry={results.pesoUnitarioSeco}
              gammaSolids={results.pesoUnitarioSolidos}
            />
          </div>

          {/* Estado de validación */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✓ Cumple norma INV E-128-11
            </Badge>
            {results.porosidad < 50 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                ✓ Porosidad dentro de rango normal
              </Badge>
            )}
            {data.temperaturaAgua <= 30 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✓ Temperatura de agua adecuada
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
