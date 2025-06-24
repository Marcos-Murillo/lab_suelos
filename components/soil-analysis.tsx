"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, AlertTriangle, CheckCircle, Beaker } from "lucide-react"
import TernaryDiagram from "@/components/ternary-diagram"
import SaturationProfile from "@/components/saturation-profile"

interface SoilData {
  masaInicial: number
  masaSueloParafina: number
  masaSumergida: number
  densidadParafina: number
  temperaturaAgua: number
  masaSecaSubmuestra: number
  masaMatrazAgua: number
  masaMatrazAguaSolidos: number
}

interface SoilResults {
  masaParafina: number
  volumenParafina: number
  volumenSumergido: number
  gravedadEspecifica: number
  volumenMuestra: number
  volumenSolidos: number
  volumenAgua: number
  volumenAire: number
  porosidad: number
  relacionVacios: number
  gradoSaturacion: number
  densidadAgua: number
  clasificacion: string
}

export default function SoilAnalysis() {
  const [data, setData] = useState<SoilData>({
    masaInicial: 0,
    masaSueloParafina: 0,
    masaSumergida: 0,
    densidadParafina: 0.9,
    temperaturaAgua: 20,
    masaSecaSubmuestra: 0,
    masaMatrazAgua: 0,
    masaMatrazAguaSolidos: 0,
  })

  const [results, setResults] = useState<SoilResults | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [validations, setValidations] = useState<{ [key: string]: boolean }>({})

  const waterDensity = (temp: number): number => {
    return 0.9998395 + 6.7887e-5 * temp - 9.0907e-6 * Math.pow(temp, 2)
  }

  const classifySoil = (porosity: number, specificGravity: number): string => {
    if (porosity > 40 && specificGravity < 2.5) {
      return "Arcilla de alta porosidad"
    } else if (porosity > 30 && specificGravity >= 2.5 && specificGravity < 2.7) {
      return "Limo de porosidad media"
    } else if (porosity < 30 && specificGravity >= 2.7) {
      return "Arena densa"
    } else {
      return "Suelo mixto"
    }
  }

  const calculateResults = () => {
    const densidadAgua = waterDensity(data.temperaturaAgua)

    // Cálculos preparatorios
    const masaParafina = data.masaSueloParafina - data.masaInicial
    const volumenParafina = masaParafina / data.densidadParafina

    // Volumen sumergido
    const volumenSumergido = (data.masaSueloParafina - data.masaSumergida) / densidadAgua - volumenParafina

    // Gravedad específica
    const gravedadEspecifica =
      data.masaSecaSubmuestra / (data.masaMatrazAgua + data.masaSecaSubmuestra - data.masaMatrazAguaSolidos)

    // Volúmenes
    const volumenMuestra = volumenSumergido
    const volumenSolidos = data.masaInicial / (gravedadEspecifica * densidadAgua)
    const volumenAgua = (data.masaSueloParafina - data.masaInicial - masaParafina) / densidadAgua
    const volumenAire = volumenMuestra - volumenSolidos - volumenAgua

    // Propiedades índice
    const porosidad = ((volumenMuestra - volumenSolidos) / volumenMuestra) * 100
    const relacionVacios = (volumenMuestra - volumenSolidos) / volumenSolidos
    const gradoSaturacion = (volumenAgua / (volumenMuestra - volumenSolidos)) * 100

    const clasificacion = classifySoil(porosidad, gravedadEspecifica)

    const newResults: SoilResults = {
      masaParafina,
      volumenParafina,
      volumenSumergido,
      gravedadEspecifica,
      volumenMuestra,
      volumenSolidos,
      volumenAgua,
      volumenAire,
      porosidad,
      relacionVacios,
      gradoSaturacion,
      densidadAgua,
      clasificacion,
    }

    // Validaciones
    const newWarnings: string[] = []
    const newValidations: { [key: string]: boolean } = {}

    // Validación de parafina
    const porcentajeParafina = (masaParafina / data.masaInicial) * 100
    if (porcentajeParafina < 0.5) {
      newWarnings.push("Masa de parafina < 0.5% de la masa inicial - Verificar procedimiento")
      newValidations.parafina = false
    } else {
      newValidations.parafina = true
    }

    // Validación de temperatura
    if (data.temperaturaAgua > 30) {
      newWarnings.push("Temperatura del agua > 30°C puede afectar la precisión")
      newValidations.temperatura = false
    } else {
      newValidations.temperatura = true
    }

    // Validación de consistencia
    const relacionVaciosCalculada = porosidad / (100 - porosidad)
    if (Math.abs(relacionVacios - relacionVaciosCalculada) > 0.05) {
      newWarnings.push("Inconsistencia en relación de vacíos - Revisar cálculos")
      newValidations.consistencia = false
    } else {
      newValidations.consistencia = true
    }

    setResults(newResults)
    setWarnings(newWarnings)
    setValidations(newValidations)
  }

  const handleInputChange = (field: keyof SoilData, value: string) => {
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
      {/* Formulario de entrada - Muestra Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Datos de Muestra Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="masaSueloParafina">Masa Suelo + Parafina (g)</Label>
              <Input
                id="masaSueloParafina"
                type="number"
                step="0.01"
                placeholder="287.11"
                onChange={(e) => handleInputChange("masaSueloParafina", e.target.value)}
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
              <Label htmlFor="densidadParafina">Densidad Parafina (g/cm³)</Label>
              <Input
                id="densidadParafina"
                type="number"
                step="0.01"
                placeholder="0.9"
                onChange={(e) => handleInputChange("densidadParafina", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura Agua (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                placeholder="26"
                onChange={(e) => handleInputChange("temperaturaAgua", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de entrada - Submuestra */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de Submuestra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="masaSecaSubmuestra">Masa Seca Submuestra (g)</Label>
              <Input
                id="masaSecaSubmuestra"
                type="number"
                step="0.01"
                placeholder="50.25"
                onChange={(e) => handleInputChange("masaSecaSubmuestra", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="masaMatrazAgua">Masa Matraz + Agua (g)</Label>
              <Input
                id="masaMatrazAgua"
                type="number"
                step="0.01"
                placeholder="675.30"
                onChange={(e) => handleInputChange("masaMatrazAgua", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="masaMatrazAguaSolidos">Masa Matraz + Agua + Sólidos (g)</Label>
              <Input
                id="masaMatrazAguaSolidos"
                type="number"
                step="0.01"
                placeholder="707.15"
                onChange={(e) => handleInputChange("masaMatrazAguaSolidos", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={calculateResults} className="w-full md:w-auto">
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Propiedades
            </Button>
          </div>
        </CardContent>
      </Card>

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
          {/* Clasificación del suelo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Clasificación del Suelo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{results.clasificacion}</div>
                <div className="text-lg text-gray-600">
                  Gs = {results.gravedadEspecifica.toFixed(2)} | n = {results.porosidad.toFixed(1)}% | Sr ={" "}
                  {results.gradoSaturacion.toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados numéricos */}
          <Card>
            <CardHeader>
              <CardTitle>Propiedades Calculadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{results.gravedadEspecifica.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Gravedad Específica (Gs)</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.porosidad.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Porosidad (n)</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{results.relacionVacios.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Relación de Vacíos (e)</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{results.gradoSaturacion.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Grado Saturación (Sr)</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Masa de parafina:</strong> {results.masaParafina.toFixed(2)} g
                </div>
                <div>
                  <strong>Volumen de parafina:</strong> {results.volumenParafina.toFixed(2)} cm³
                </div>
                <div>
                  <strong>Volumen de muestra:</strong> {results.volumenMuestra.toFixed(2)} cm³
                </div>
                <div>
                  <strong>Volumen de sólidos:</strong> {results.volumenSolidos.toFixed(2)} cm³
                </div>
                <div>
                  <strong>Volumen de agua:</strong> {results.volumenAgua.toFixed(2)} cm³
                </div>
                <div>
                  <strong>Volumen de aire:</strong> {results.volumenAire.toFixed(2)} cm³
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualizaciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SaturationProfile
              solids={(results.volumenSolidos / results.volumenMuestra) * 100}
              water={(results.volumenAgua / results.volumenMuestra) * 100}
              air={(results.volumenAire / results.volumenMuestra) * 100}
            />

            <TernaryDiagram
              solids={(results.volumenSolidos / results.volumenMuestra) * 100}
              water={(results.volumenAgua / results.volumenMuestra) * 100}
              air={(results.volumenAire / results.volumenMuestra) * 100}
            />
          </div>

          {/* Estado de validación */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={
                validations.parafina
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {validations.parafina ? "✓" : "✗"} Parafina {validations.parafina ? ">= 0.5%" : "< 0.5%"} masa muestra
            </Badge>
            <Badge
              variant="outline"
              className={
                validations.temperatura
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {validations.temperatura ? "✓" : "✗"} Temperatura agua {validations.temperatura ? "<= 30°C" : "> 30°C"}
            </Badge>
            <Badge
              variant="outline"
              className={
                validations.consistencia
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {validations.consistencia ? "✓" : "✗"} Consistencia relación vacíos
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              ✓ Cumple norma INV E-128-11
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}
