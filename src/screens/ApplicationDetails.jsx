// ApplicationDetailsPage.js
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function ApplicationDetailsPage({ application }) {
  if (!application) {
    return <div className="text-center text-gray-500">No Details Available</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Application Details</h1>

      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="bg-gray-100 p-4">
          <CardTitle className="text-2xl font-semibold">{application.studentName}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="mb-2 text-lg"><strong>Email:</strong> {application.email}</p>
            <p className="mb-2 text-lg"><strong>Project Title:</strong> {application.projectTitle}</p>
            <p className="mb-2 text-lg"><strong>Project Description:</strong> {application.projectDescription}</p>
          </div>
          <div className="border-t border-gray-300 my-4"></div>
          <div className="mb-4">
            <p className="mb-2 text-lg"><strong>Start Date:</strong> {new Date(application.startDate).toLocaleDateString()}</p>
            <p className="mb-2 text-lg"><strong>Expected Deadline:</strong> {new Date(application.expectedDeadline).toLocaleDateString()}</p>
            <p className="mb-2 text-lg"><strong>Status:</strong> {application.status}</p>
            <p className="mb-2 text-lg"><strong>Contact Number:</strong> {application.contactNumber}</p>
          </div>

          {/* Conditional rendering of Bid Amount */}
          {application.bidAmount && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-lg"><strong>Bid Amount:</strong> ${application.bidAmount}</p>
            </div>
          )}

          {/* Weekly progress */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Weekly Progress</h3>
            {application.weeklyProgress && application.weeklyProgress.length > 0 ? (
              application.weeklyProgress.map((progress, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded mb-3">
                  <p><strong>Week {progress.weekNumber}:</strong> {progress.progressDescription}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No weekly progress available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
