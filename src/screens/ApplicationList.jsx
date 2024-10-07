'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button" // Fixed import path
import axios from 'axios'

export default function ApplicantsList({ applicants, projectId }) {
  const [applicantDetails, setApplicantDetails] = useState([])
  const [selectedApplicants, setSelectedApplicants] = useState([])

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const fetchedDetails = await Promise.all(
          applicants.map(async (applicant) => {
            // Check if both applicant.student and applicant.application are defined
            if (applicant.student && applicant.application) {
              const studentRes = await axios.post('http://localhost:5001/getStudentById', { id: applicant.student })
              const studentData = studentRes.data.student
              console.log(studentData)

              // Fetch application details by sending applicationId in the request body
              const applicationRes = await axios.post(`http://localhost:5001/getapplication`, { application_id: applicant.application })
              const applicationData = applicationRes.data.application

              return { student: studentData, application: applicationData }
            } else {
              // Return null or an empty object when either student or application is missing
              return null
            }
          })
        )

        // Filter out null values from the results and set the applicant details
        setApplicantDetails(fetchedDetails.filter((detail) => detail !== null))
      } catch (error) {
        console.error("Error fetching applicant details:", error)
      }
    }

    fetchApplicantDetails()
  }, [applicants])

  const handleSelect = async (applicationId, studentId) => {
    setSelectedApplicants(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    )

    try {
      
      const token = localStorage.getItem('authToken') // Assuming token is stored in localStorage
      const response = await axios.post('http://localhost:5001/applyProject', {
        projectId,
        student_id: studentId,
        application_id: applicationId,
        token, // Include the token for authentication
      })

      if (response.status === 200) {
        console.log('Project assigned successfully')
        window.location.reload() 
      } else {
        console.error('Failed to assign project')
      }
    } catch (error) {
      console.error('Error applying project:', error)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applicantDetails&&applicantDetails.map(({ student, application }) => {
        // Ensure both student and application are available before rendering
        if (student && application) {
          return (
            <Card key={application._id}>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
                <p className="text-sm text-gray-600 mb-2">Skills: {student.skills.join(', ')}</p>
                <p className="text-sm text-gray-600 mb-2">Email: {student.email}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => handleSelect(application._id, student._id)} // Pass applicationId and studentId
                  variant={selectedApplicants.includes(application._id) ? "secondary" : "default"}
                >
                  {selectedApplicants.includes(application._id) ? 'Deselect' : 'Select'}
                </Button>
                <Link to={`/projects/${student._id}/applicants/${application._id}`}>
                  <Button variant="outline">View Application</Button>
                </Link>
              </CardFooter>
            </Card>
          )
        } else {
          return null // Skip rendering if either student or application is missing
        }
      })}
    </div>
  )
}
