import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

// Fetch application details using application ID
async function getApplicationDetails(application_id) {
  const res = await fetch('http://localhost:5001/getapplication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ application_id }),
  })

  if (!res.ok) return null
  return res.json()
}

export default function ApplicationDetailsPage() {
  const { application_id, student_id } = useParams() // Get params from the URL
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getApplicationDetails(application_id)
        setApplication(data.application)
        console.log(data);
      } catch (err) {
        setError("Error fetching application details.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [application_id]) // Re-fetch if application_id changes

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!application) {
    return <div>No Details Available</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>{application.studentName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Email:</strong> {application.email}</p>
          <p className="mb-2"><strong>Project Title:</strong> {application.projectTitle}</p>
          <p className="mb-2"><strong>Project Description:</strong> {application.projectDescription}</p>
          <p className="mb-2"><strong>Start Date:</strong> {new Date(application.startDate).toLocaleDateString()}</p>
          <p className="mb-2"><strong>Expected Deadline:</strong> {new Date(application.expectedDeadline).toLocaleDateString()}</p>
          <p className="mb-2"><strong>Status:</strong> {application.status}</p>
          <p className="mb-2"><strong>Contact Number:</strong> {application.contactNumber}</p>
          
          {/* Weekly progress */}
          <div>
            <h3 className="text-xl font-semibold mt-4">Weekly Progress</h3>
            {application.weeklyProgress && application.weeklyProgress.length > 0 ? (
              application.weeklyProgress.map((progress, index) => (
                <div key={index}>
                  <p><strong>Week {progress.weekNumber}:</strong> {progress.progressDescription}</p>
                </div>
              ))
            ) : (
              <p>No weekly progress available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
