
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { useParams } from 'react-router-dom'

// Fetch application details using application ID
async function getApplicationDetails() {
    const { application_id, student_id } = useParams();
  const res = await fetch(`http://localhost:5001/application/${application_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ application_id: application_id }),
  })

  if (!res.ok) return null
  return res.json()
}

export default async function ApplicationDetailsPage({ params }) {
  const application = await getApplicationDetails(params.applicationId)

  if (!application) {
     return (<div> No Details</div>)
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
            {application.weeklyProgress.map((progress, index) => (
              <div key={index}>
                <p><strong>Week {progress.weekNumber}:</strong> {progress.progressDescription}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
