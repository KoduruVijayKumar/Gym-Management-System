import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  trend: string
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{icon}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-xs text-primary">{trend}</p>
      </CardContent>
    </Card>
  )
}
