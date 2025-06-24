"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TernaryDiagramProps {
  solids: number
  water: number
  air: number
}

export default function TernaryDiagram({ solids, water, air }: TernaryDiagramProps) {
  // Normalizar los valores para que sumen 100
  const total = solids + water + air
  const normalizedSolids = (solids / total) * 100
  const normalizedWater = (water / total) * 100
  const normalizedAir = (air / total) * 100

  // Convertir coordenadas ternarias a cartesianas
  const height = Math.sqrt(3) / 2
  const x = (normalizedWater + normalizedAir / 2) / 100
  const y = (normalizedAir * height) / 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagrama Ternario</CardTitle>
        <CardDescription>Representación trifásica del suelo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-80 flex items-center justify-center">
          <svg viewBox="0 0 1 1" className="w-full h-full max-w-80 max-h-80">
            {/* Triángulo base */}
            <polygon points="0,1 1,1 0.5,0.134" fill="none" stroke="#333" strokeWidth="0.01" />

            {/* Líneas de cuadrícula */}
            {[0.2, 0.4, 0.6, 0.8].map((t) => (
              <g key={t}>
                {/* Líneas horizontales */}
                <line
                  x1={t / 2}
                  y1={1 - t * height}
                  x2={1 - t / 2}
                  y2={1 - t * height}
                  stroke="#ddd"
                  strokeWidth="0.005"
                />
                {/* Líneas diagonales izquierda */}
                <line x1={t} y1={1} x2={0.5 + t / 2} y2={1 - t * height} stroke="#ddd" strokeWidth="0.005" />
                {/* Líneas diagonales derecha */}
                <line x1={1 - t} y1={1} x2={0.5 - t / 2} y2={1 - t * height} stroke="#ddd" strokeWidth="0.005" />
              </g>
            ))}

            {/* Punto de muestra */}
            <circle cx={x} cy={1 - y} r="0.02" fill="#e74c3c" stroke="#fff" strokeWidth="0.005" />

            {/* Etiquetas de los vértices */}
            <text x="0" y="1.05" textAnchor="middle" fontSize="0.04" fill="#8B4513">
              Sólidos
            </text>
            <text x="1" y="1.05" textAnchor="middle" fontSize="0.04" fill="#4A90E2">
              Agua
            </text>
            <text x="0.5" y="0.1" textAnchor="middle" fontSize="0.04" fill="#F5A623">
              Aire
            </text>
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-600"></div>
            <span>Sólidos: {normalizedSolids.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span>Agua: {normalizedWater.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-400"></div>
            <span>Aire: {normalizedAir.toFixed(1)}%</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-center">
          <strong>Coordenadas:</strong> ({x.toFixed(3)}, {(1 - y).toFixed(3)})
        </div>
      </CardContent>
    </Card>
  )
}
