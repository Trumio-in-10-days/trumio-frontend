import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import axios from 'axios'
import Modal from '../../components/ui/modal' // Import the Modal component
import ApplicationDetailsPage from './ApplicationDetails' // Import the Application Details component

export default function ApplicantsList({ applicants, projectId, assigned }) {
  const [applicantDetails, setApplicantDetails] = useState([])
  const [assignedDetails, setAssignedDetails] = useState([])
  const [selectedApplicants, setSelectedApplicants] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility
  const [selectedApplication, setSelectedApplication] = useState(null) // State for selected application

  // Fetch applicants' details
  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const fetchedDetails = await Promise.all(
          applicants.map(async (applicant) => {
            if (applicant.student && applicant.application) {
              const studentRes = await axios.post('http://localhost:5001/getStudentById', { id: applicant.student })
              const studentData = studentRes.data.student

              const applicationRes = await axios.post('http://localhost:5001/getapplication', { application_id: applicant.application })
              const applicationData = applicationRes.data.application

              return { student: studentData, application: applicationData }
            } else {
              return null
            }
          })
        )

        setApplicantDetails(fetchedDetails.filter((detail) => detail !== null))
      } catch (error) {
        console.error("Error fetching applicant details:", error)
      }
    }

    fetchApplicantDetails()
  }, [applicants])

  // Fetch assigned students' details
  useEffect(() => {
    const fetchAssignedDetails = async () => {
      try {
        const fetchedAssigned = await Promise.all(
          assigned.map(async (assignedStudent) => {
            if (assignedStudent.student && assignedStudent.application) {
              const studentRes = await axios.post('http://localhost:5001/getStudentById', { id: assignedStudent.student })
              const studentData = studentRes.data.student

              const applicationRes = await axios.post('http://localhost:5001/getapplication', { application_id: assignedStudent.application })
              const applicationData = applicationRes.data.application

              return { student: studentData, application: applicationData }
            } else {
              return null
            }
          })
        )

        setAssignedDetails(fetchedAssigned.filter((detail) => detail !== null))
      } catch (error) {
        console.error("Error fetching assigned students:", error)
      }
    }

    fetchAssignedDetails()
  }, [assigned])

  // Function to open the modal with selected application details
  const handleViewApplication = (application) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedApplication(null)
  }

  const handleSelect = async (applicationId, studentId) => {
    setSelectedApplicants(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    )

    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.post('http://localhost:5001/applyProject', {
        projectId,
        student_id: studentId,
        application_id: applicationId,
        token,
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

  // Separate the applicants into alumni and students
  const alumniApplicants = applicantDetails.filter(({ student }) => student.isAlumni)
  const studentApplicants = applicantDetails.filter(({ student }) => !student.isAlumni)

  // Separate assigned students into alumni and students
  const assignedAlumni = assignedDetails.filter(({ student }) => student.isAlumni)
  const assignedStudents = assignedDetails.filter(({ student }) => !student.isAlumni)

  return (
    <div>
      <div className="mb-6">
        {/* Assigned Alumni Section */}
        <h3 className="text-lg font-semibold mb-4">Assigned Alumni</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {assignedAlumni.length > 0 ? (
            assignedAlumni.map(({ student, application }) => (
              <Card key={application._id}>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">Skills: {student.skills.join(', ')}</p>
                  <p className="text-sm text-gray-600 mb-2">Email: {student.email}</p>
                  {application.bidAmount && (
                    <p className="text-sm text-gray-600 mb-2">Bid Amount: ${application.bidAmount}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No alumni assigned.</p>
          )}
        </div>

        {/* Assigned Students Section */}
        <h3 className="text-lg font-semibold mb-4">Assigned Students</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {assignedStudents.length > 0 ? (
            assignedStudents.map(({ student, application }) => (
              <Card key={application._id}>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">Skills: {student.skills.join(', ')}</p>
                  <p className="text-sm text-gray-600 mb-2">Email: {student.email}</p>
                  {application.bidAmount && (
                    <p className="text-sm text-gray-600 mb-2">Bid Amount: ${application.bidAmount}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No students assigned.</p>
          )}
        </div>

        {/* Alumni Applicants Section */}
        {assignedAlumni.length===0&&(<><h3 className="text-lg font-semibold mb-4">Alumni Applicants</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {alumniApplicants.length > 0 ? (
            alumniApplicants.map(({ student, application }) => (
              <Card key={application._id}>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">Skills: {student.skills.join(', ')}</p>
                  <p className="text-sm text-gray-600 mb-2">Email: {student.email}</p>
                  {application.bidAmount && (
                    <p className="text-sm text-gray-600 mb-2">Bid Amount: ${application.bidAmount}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    onClick={() => handleSelect(application._id, student._id)}
                    variant={selectedApplicants.includes(application._id) ? "secondary" : "default"}
                  >
                    {selectedApplicants.includes(application._id) ? 'Deselect' : 'Select'}
                  </Button>
                  <Button onClick={() => handleViewApplication(application)} variant="outline">
                    View Application
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No alumni applicants.</p>
          )}
        </div></>)}

        {/* Student Applicants Section */}
        {assignedStudents.length === 0 && (<><h3 className="text-lg font-semibold mb-4">Student Applicants</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studentApplicants.length > 0 ? (
            studentApplicants.map(({ student, application }) => (
              <Card key={application._id}>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">Skills: {student.skills.join(', ')}</p>
                  <p className="text-sm text-gray-600 mb-2">Email: {student.email}</p>
                  {application.bidAmount && (
                    <p className="text-sm text-gray-600 mb-2">Bid Amount: ${application.bidAmount}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    onClick={() => handleSelect(application._id, student._id)}
                    variant={selectedApplicants.includes(application._id) ? "secondary" : "default"}
                  >
                    {selectedApplicants.includes(application._id) ? 'Deselect' : 'Select'}
                  </Button>
                  <Button onClick={() => handleViewApplication(application)} variant="outline">
                    View Application
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No student applicants.</p>
          )}
        </div></>)}
      </div>

      {/* Modal for Application Details */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedApplication && <ApplicationDetailsPage application={selectedApplication} />}
      </Modal>
    </div>
  )
}
