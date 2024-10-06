'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../..//components/ui/button"
import axios from 'axios'

export default function ApplicantsList({ applicants, projectId }) {
  const [applicantDetails, setApplicantDetails] = useState([])

   
  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const fetchedDetails = await Promise.all(
          applicants.map(async (applicant) => {
            // Fetch student details by passing student ID in the body
            const studentRes = await axios.post('http://localhost:5001/getStudentById', { id: applicant.student })
            const studentData = studentRes.data

            // Fetch application details by passing application ID
            const applicationRes = await axios.get(`http://localhost:5001/applications/${applicant.application}`)
            const applicationData = applicationRes.data

            return { student: studentData, application: applicationData }
          })
        )
        setApplicantDetails(fetchedDetails)
      } catch (error) {
        console.error("Error fetching applicant details:", error)
      }
    }

    fetchApplicantDetails()
  }, [applicants])

  const [selectedApplicants, setSelectedApplicants] = useState([])

  const handleSelect = (applicationId) => {
    setSelectedApplicants(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    )
  }

  return ( <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applicantDetails.map(({ student, application }) => (
        <Card key={application._id}>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
            <p className="text-sm text-gray-600 mb-2">Skills: {student.skills.join(', ')}</p>
            <p className="text-sm text-gray-600 mb-2">Email: {student.email}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              onClick={() => handleSelect(application._id)}
              variant={selectedApplicants.includes(application._id) ? "secondary" : "default"}
            >
              {selectedApplicants.includes(application._id) ? 'Deselect' : 'Select'}
            </Button>
            <Link href={`/projects/${student._id}/applicants/${application._id}`}>
              <Button variant="outline">View Application</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
