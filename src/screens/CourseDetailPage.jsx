import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function CourseDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {}; // Retrieve course from state
  console.log(course);

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Course not found.</p>
        <Button onClick={() => navigate('/')}>Go back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
          <CardDescription className="text-gray-600">{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-auto mb-6 rounded-lg shadow-md" 
          />
          <div className="space-y-2">
            <p className="text-lg"><strong>Instructor:</strong> {course.instructor}</p>
            <p className="text-lg"><strong>Language:</strong> {course.language}</p>
            <p className="text-lg"><strong>Price:</strong> {course.price}</p>
            <p className="text-lg"><strong>Uploaded Date:</strong> {new Date(course.uploadedDate).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {course.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="px-2 py-1 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button 
            as="a" 
            href={course.courseLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Go to Course
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
