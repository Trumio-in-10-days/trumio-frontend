'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { GoogleGenerativeAI } from "@google/generative-ai";


// Mock video courses data
const mockCourses = [
  { id: 1, title: "Introduction to React", skills: ["react", "javascript", "frontend"] },
  { id: 2, title: "Advanced Python Programming", skills: ["python", "algorithms", "backend"] },
  { id: 3, title: "Data Structures and Algorithms", skills: ["algorithms", "data structures", "problem solving"] },
  { id: 4, title: "UI/UX Design Principles", skills: ["ui design", "ux design", "wireframing"] },
  { id: 5, title: "Machine Learning Basics", skills: ["machine learning", "python", "data analysis"] },
]

export default function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState();
  const [issue, setIssue] = useState('')
  const [generatedSkills, setGeneratedSkills] = useState([])
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState([])

  const getCourses = useCallback(async () => {
    try {
        const response = await axios.get('http://localhost:5000/getAllCourses');
        console.log(response);
        if(response.status!==201){
          toast.success("Error fetching Courses!");
        }else{
            setCourses(response.data.courses);
        }
    
      } catch (error) {
        toast.error(error);
        console.log('Error during fetching courses', error);
      }
},[]);
const getStudent = useCallback(async () => {
    try {
        const response = await axios.post('http://localhost:5000/getStudent', {
            token: localStorage['authToken']
        });
        console.log(response);
        if(response.status!==201){
          toast.success("Error fetching Courses!");
        }else{
            setUser(response.data.student);
        }
    
      } catch (error) {
        toast.error(error);
        console.log('Error during fetching courses', error);
      }
},[]);
    const completeCourse = async (id) => {
        try {
            const response = await axios.post('http://localhost:5000/completeCourse', {
                _id: id,
                token: localStorage['authToken'],
            });
            console.log(response);
            if(response.status!==200){
              toast.success("Error completing Courses!");
            }else{
                toast.success("Course taken!");
            }
        
          } catch (error) {
            toast.error(error);
            console.log('Error during completing courses', error);
          }
    }
useEffect(() => {
    getCourses();
    getStudent();
}, [getCourses, getStudent])

  const handleIssueSubmit = async (e) => {
    e.preventDefault()
    setIsGeneratingSkills(true)
    setGeneratedSkills([])
    setRecommendedCourses([])

    try {
        const response = await axios.post('http://localhost:5000/findSkillfromIssue', {
            issue:issue
        });
        console.log(response);
        if(response.status!==200){
          toast.success("Error getting skills from issue!");
        }else{
            const final = response.data.data.map(element => element.toLowerCase().trim());
            setGeneratedSkills(final);
        }
    
      } catch (error) {
        toast.error(error);
        console.log('Error getting skills from issue', error);
      }
    

    // Find matching courses based on generated skills
    const matchingCourses = findMatchingCourses();
    setRecommendedCourses(matchingCourses)

    setIsGeneratingSkills(false)
  }

  const findMatchingCourses = () => {
    return courses
      .filter(course => course.skills.some(skill => generatedSkills.includes(skill.trim())))
      .sort((a, b) => {
        const aMatchCount = a.skills.filter(skill => generatedSkills.includes(skill.toLowerCase())).length
        const bMatchCount = b.skills.filter(skill => generatedSkills.includes(skill)).length
        return bMatchCount - aMatchCount
      })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      {user && <Link to={`/student/${user._id}`}><Button>Profile</Button></Link>}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Describe Your Issue</CardTitle>
          <CardDescription>Tell us about the problem you're facing, and we'll suggest relevant skills and courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issue">Your Issue</Label>
              <Textarea 
                id="issue" 
                value={issue} 
                onChange={(e) => setIssue(e.target.value)} 
                placeholder="Describe the problem you're trying to solve..." 
                className="min-h-[100px]"
                required 
              />
            </div>
            <Button type="submit" disabled={isGeneratingSkills}>
              {isGeneratingSkills ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Submit Issue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedSkills.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Relevant Skills</CardTitle>
            <CardDescription>Based on your issue, these skills might be helpful to develop:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generatedSkills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Courses</CardTitle>
            <CardDescription>These courses can help you develop the skills you need:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recommendedCourses.map((course) => (
                <li key={course._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className='flex justify-between'>
                        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                        <Button onClick = {() => completeCourse(course._id)}>Complete</Button>
                    </div>

                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className={generatedSkills.includes(skill) ? 'bg-primary/20' : ''}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}