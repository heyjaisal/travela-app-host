
import React, { useEffect, useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import axios from "axios"
import { useOnceEffect } from "@/hooks/useeffectOnce"

const chartConfig = {
  views: { label: "People Booked" },
  Property: {
    label: "Property",
    color: "hsl(var(--chart-1))",
  },
  Event: {
    label: "Event",
    color: "hsl(var(--chart-2))",
  },
}

export default function BarChartBookings() {
  const [activeChart, setActiveChart] = useState("Property")
  const [chartData, setChartData] = useState([])

  useOnceEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/graphs/line-graph",{withCredentials:true})
        setChartData(res.data)
      } catch (error) {
        console.error("Error fetching chart data", error)
      }
    }
    fetchData()
  })

  const total = useMemo(() => {
    return {
      Property: chartData.reduce((acc, curr) => acc + curr.Property, 0),
      Event: chartData.reduce((acc, curr) => acc + curr.Event, 0),
    }
  }, [chartData])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Booking Bar Chart</CardTitle>
          <CardDescription>
            Showing total bookings in the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["Property", "Event"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[key]?.toLocaleString() || 0}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent title={label}>
          {payload.map((entry, i) => (
            <div key={i} className="flex items-center justify-between">
              <span>{chartConfig[entry.dataKey]?.label}</span>
              <span>{entry.value}</span>
            </div>
          ))}
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }
  return null
}
