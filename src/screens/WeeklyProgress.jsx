'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function WeeklyProgress({ project }) {
  const [assignedStudents, setAssignedStudents] = useState([])
  const [expandedWeeks, setExpandedWeeks] = useState([])

  // Toggle the expansion of weekly progress
  const toggleWeek = (week) => {
    setExpandedWeeks((prev) => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    )
  }

  // Fetch project details and assigned student information
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch student and application details for assigned students
        const assignedStudentsWithDetails = await Promise.all(
          project.assignedStudents.map(async (studentData) => {
            const studentRes = await axios.post('http://localhost:5001/getStudentById', {
              id: studentData.student
            })

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
  }, [project.assignedStudents])

  // Separate students into alumni and regular students
  const alumni = assignedStudents.filter(({ student }) => student.isAlumni)
  const students = assignedStudents.filter(({ student }) => !student.isAlumni)

  // Function to render weekly progress
  const renderWeeklyProgress = (weeklyProgress) => {
    return weeklyProgress.map(({ weekNumber, progressDescription }) => (
      <Card key={weekNumber} className="mb-4 border border-gray-300 rounded-lg shadow-md">
        <CardHeader className="flex justify-between items-center p-4 bg-gray-100 border-b">
          <CardTitle className="text-lg font-semibold">Week {weekNumber}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => toggleWeek(weekNumber)}>
            {expandedWeeks.includes(weekNumber) ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CardHeader>
        {expandedWeeks.includes(weekNumber) && (
          <CardContent className="p-4 bg-white">
            <p className="text-gray-700">{progressDescription}</p>
          </CardContent>
        )}
      </Card>
    ))
  }

  return (
    <div className="space-y-8">
      {/* Project Progress Section */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Project Weekly Progress</h2>
        {project.progress && project.progress.length > 0 ? (
          <div className="space-y-4">
            {renderWeeklyProgress(project.progress)}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No project progress recorded yet.</p>
        )}
      </div>

      {/* Alumni Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Alumni</h2>
        {alumni.length > 0 ? (
          <div className="grid gap-6">
            {alumni.map(({ student, application }) => (
              <Card key={student._id} className="border border-gray-300 rounded-lg shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{student.name}</h3>
                  <p className="text-gray-700"><strong>Email:</strong> {student.email}</p>
                  <p className="text-gray-700"><strong>Skills:</strong> {student.skills.join(', ')}</p>
                  <p className="text-gray-700"><strong>Expected Progress:</strong> {application.expectedProgress}</p>

                  <h4 className="mt-6 mb-4 text-lg font-medium text-gray-800">Weekly Progress</h4>
                  {renderWeeklyProgress(application.weeklyProgress)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No alumni assigned.</p>
        )}
      </div>

      {/* Students Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Students</h2>
        {students.length > 0 ? (
          <div className="grid gap-6">
            {students.map(({ student, application }) => (
              <Card key={student._id} className="border border-gray-300 rounded-lg shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{student.name}</h3>
                  <p className="text-gray-700"><strong>Email:</strong> {student.email}</p>
                  <p className="text-gray-700"><strong>Skills:</strong> {student.skills.join(', ')}</p>
                  <p className="text-gray-700"><strong>Expected Progress:</strong> {application.expectedProgress}</p>

                  <h4 className="mt-6 mb-4 text-lg font-medium text-gray-800">Weekly Progress</h4>
                  {renderWeeklyProgress(application.weeklyProgress)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No students assigned.</p>
        )}
      </div>
    </div>
  )
}
