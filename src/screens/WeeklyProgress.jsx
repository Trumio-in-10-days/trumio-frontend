'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function WeeklyProgress({ weeklyProgress }) {
  const [expandedWeeks, setExpandedWeeks] = useState([])

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    )
  }

  return (
    <div className="space-y-4">
      {weeklyProgress.map(({ week, summary }) => (
        <Card key={week}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Week {week}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleWeek(week)}
            >
              {expandedWeeks.includes(week) ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CardHeader>
          {expandedWeeks.includes(week) && (
            <CardContent>
              <p>{summary}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
