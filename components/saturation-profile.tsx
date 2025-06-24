"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SaturationProfileProps {
  solids: number
  water: number
  air: number
}

export default function SaturationProfile({ solids, water, air }: SaturationProfileProps) {
  const data = [
    {
      name: "Composición",
      Sólidos: solids,
      Agua: water,
      Aire: air,
    },
  ]

  const colors = {
    Sólidos: "#8B4513",
    Agua: "#4A90E2",
    Aire: "#F5F5DC",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Saturación</CardTitle>
        <CardDescription>Distribución volumétrica normalizada al 100%</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "Porcentaje (%)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
              labelFormatter={() => "Composición Volumétrica"}
            />
            <Bar dataKey="Sólidos" stackId="a" fill={colors.Sólidos} />
            <Bar dataKey="Agua" stackId="a" fill={colors.Agua} />
            <Bar dataKey="Aire" stackId="a" fill={colors.Aire} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.Sólidos }}></div>
            <span>Sólidos: {solids.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.Agua }}></div>
            <span>Agua: {water.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.Aire }}></div>
            <span>Aire: {air.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
