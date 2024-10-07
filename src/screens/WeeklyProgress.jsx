'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'

export default function WeeklyProgress({ project }) {
  const [assignedStudents, setAssignedStudents] = useState([])
  const [expandedWeeks, setExpandedWeeks] = useState([])
    
  // Function to toggle week expansion
  const toggleWeek = (week) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    )
  }

  // Fetch the project details including assigned students and their applications
  useEffect(() => {
    const fetchProjectDetails = async () => {
      console.log(project);
      try {
         

        // Populate student and application details for assigned students
        const assignedStudentsWithDetails = await Promise.all(
          project.assignedStudents.map(async (studentData) => {
            // Fetch student details
            const studentRes = await axios.post('http://localhost:5001/getStudentById', {
              id: studentData.student
            })

            // Fetch application details (which includes weekly progress)
            const applicationRes = await axios.post('http://localhost:5001/getapplication', {
              application_id: studentData.application
            })

            return {
              student: studentRes.data.student,
              application: applicationRes.data.application
            }
          })
        )

        setAssignedStudents(assignedStudentsWithDetails)
      } catch (error) {
        console.error("Error fetching project details:", error)
      }
    }

    fetchProjectDetails()
  }, [])

  return (
    <div className="space-y-4">
      {assignedStudents.map(({ student, application }) => (
        <div key={student._id}>
          <h2 className="text-xl font-semibold mb-4">Student: {student.name}</h2>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Skills:</strong> {student.skills.join(', ')}</p>

          <h3 className="text-lg font-medium mt-4">Weekly Progress</h3>
          {application.weeklyProgress.map(({ weekNumber, progressDescription }) => (
            <Card key={weekNumber}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Week {weekNumber}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleWeek(weekNumber)}
                >
                  {expandedWeeks.includes(weekNumber) ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CardHeader>
              {expandedWeeks.includes(weekNumber) && (
                <CardContent>
                  <p>{progressDescription}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}
