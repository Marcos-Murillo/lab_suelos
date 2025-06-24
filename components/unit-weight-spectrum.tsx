"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UnitWeightSpectrumProps {
  gammaSat: number
  gammaDry: number
  gammaSolids: number
}

export default function UnitWeightSpectrum({ gammaSat, gammaDry, gammaSolids }: UnitWeightSpectrumProps) {
  const data = [
    {
      property: "γ sat",
      value: gammaSat,
      fullMark: Math.max(gammaSat, gammaDry, gammaSolids) * 1.2,
    },
    {
      property: "γ dry",
      value: gammaDry,
      fullMark: Math.max(gammaSat, gammaDry, gammaSolids) * 1.2,
    },
    {
      property: "γ solids",
      value: gammaSolids,
      fullMark: Math.max(gammaSat, gammaDry, gammaSolids) * 1.2,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Espectro de Pesos Unitarios</CardTitle>
        <CardDescription>Comparación radial de pesos unitarios (g/cm³)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="property" />
            <PolarRadiusAxis
              angle={90}
              domain={[0, Math.max(gammaSat, gammaDry, gammaSolids) * 1.2]}
              tick={{ fontSize: 12 }}
            />
            <Radar
              name="Peso Unitario"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 4, fill: "#8884d8" }}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-blue-600">{gammaSat.toFixed(2)}</div>
            <div className="text-gray-600">γ saturado</div>
          </div>
          <div>
            <div className="font-semibold text-green-600">{gammaDry.toFixed(2)}</div>
            <div className="text-gray-600">γ seco</div>
          </div>
          <div>
            <div className="font-semibold text-purple-600">{gammaSolids.toFixed(2)}</div>
            <div className="text-gray-600">γ sólidos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
