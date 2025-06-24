"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Mail, Calendar, MapPin } from "lucide-react"

interface ReportData {
  projectName: string
  sampleId: string
  location: string
  date: string
  technician: string
  client: string
  observations: string
  reportType: string
}

export default function ReportGenerator() {
  const [reportData, setReportData] = useState<ReportData>({
    projectName: "",
    sampleId: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    technician: "",
    client: "",
    observations: "",
    reportType: "complete",
  })

  const handleInputChange = (field: keyof ReportData, value: string) => {
    setReportData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generatePDFReport = () => {
    // Simulación de generación de PDF
    console.log("Generando reporte PDF con datos:", reportData)
    alert("Reporte PDF generado exitosamente")
  }

  const generateCSVData = () => {
    // Simulación de exportación CSV
    console.log("Exportando datos CSV:", reportData)
    alert("Datos exportados a CSV exitosamente")
  }

  const sendByEmail = () => {
    // Simulación de envío por email
    console.log("Enviando reporte por email:", reportData)
    alert("Reporte enviado por email exitosamente")
  }

  return (
    <div className="space-y-6">
      {/* Información del proyecto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información del Proyecto
          </CardTitle>
          <CardDescription>Complete los datos del proyecto para generar el reporte técnico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nombre del Proyecto</Label>
              <Input
                id="projectName"
                placeholder="Estudio Geotécnico - Edificio Central"
                value={reportData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sampleId">ID de Muestra</Label>
              <Input
                id="sampleId"
                placeholder="M-001-2024"
                value={reportData.sampleId}
                onChange={(e) => handleInputChange("sampleId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                placeholder="Bogotá, Colombia"
                value={reportData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha de Ensayo</Label>
              <Input
                id="date"
                type="date"
                value={reportData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Técnico Responsable</Label>
              <Input
                id="technician"
                placeholder="Ing. María González"
                value={reportData.technician}
                onChange={(e) => handleInputChange("technician", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Input
                id="client"
                placeholder="Constructora ABC S.A.S."
                value={reportData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              placeholder="Observaciones adicionales sobre la muestra o el ensayo..."
              value={reportData.observations}
              onChange={(e) => handleInputChange("observations", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuración del reporte */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Reporte</CardTitle>
          <CardDescription>Seleccione el tipo de reporte y formato de exportación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportData.reportType} onValueChange={(value) => handleInputChange("reportType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Reporte Completo</SelectItem>
                  <SelectItem value="summary">Resumen Ejecutivo</SelectItem>
                  <SelectItem value="technical">Solo Datos Técnicos</SelectItem>
                  <SelectItem value="graphs">Solo Gráficos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={generatePDFReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Generar PDF
              </Button>

              <Button onClick={generateCSVData} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>

              <Button onClick={sendByEmail} variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Enviar por Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vista previa del reporte */}
      <Card>
        <CardHeader>
          <CardTitle>Vista Previa del Reporte</CardTitle>
          <CardDescription>Estructura del reporte que será generado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Encabezado */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">REPORTE DE LABORATORIO DE SUELOS</h3>
                <Badge variant="outline">INV E-128-11</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{reportData.location || "Ubicación no especificada"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{reportData.date}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Secciones del reporte */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">1. Resumen Ejecutivo</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Clasificación del suelo</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Validación ASTM/INV E-128-11</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">2. Datos de Entrada</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Tabla de masas y volúmenes</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">3. Resultados Calculados</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Propiedades índice con fórmulas aplicadas</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium">4. Visualizaciones</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Perfil de saturación</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Espectro de pesos unitarios</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Diagrama ternario</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">5. Banderas de Calidad</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">✓ Consistencia en relación de vacíos</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-600">✗ Parafina {"<"} 0.5% masa muestra</span>
              </div>
            </div>

            <Separator />

            {/* Pie del reporte */}
            <div className="text-center text-sm text-gray-600">
              <p>Reporte generado automáticamente por el Sistema de Laboratorio de Suelos</p>
              <p>
                Técnico: {reportData.technician || "No especificado"} | Cliente:{" "}
                {reportData.client || "No especificado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
