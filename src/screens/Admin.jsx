'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Loader2 } from "lucide-react"
import { useFormik } from 'formik'
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useToast } from "../../hooks/use-toast"



// Mock data for demonstration purposes
// const mockCourses = [
//     { id: 1, title: "Introduction to React", tags: ["react", "javascript", "frontend"] },
//     { id: 2, title: "Advanced Python Programming", tags: ["python", "backend", "algorithms"] },
//   ]
  
  const mockStudents = [
    { id: 1, name: "Alice Johnson", completedCourses: ["Introduction to React", "Web Design Fundamentals"] },
    { id: 2, name: "Bob Smith", completedCourses: ["Advanced Python Programming", "Data Structures and Algorithms"] },
  ]
  
  const mockAlumni = [
    { id: 1, name: "Carol White", skills: ["react", "nodejs", "database design"] },
    { id: 2, name: "David Brown", skills: ["python", "data science", "machine learning"] },
    { id: 3, name: "Eva Green", skills: ["javascript", "frontend", "ui design"] },
    { id: 4, name: "Frank Miller", skills: ["python", "algorithms", "backend"] },
  ]
  
  export default function AdminDashboard() {
    const {toast} = useToast();
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([])
    const [title, setTitle] = useState('')
    const [file, setFile] = useState(null)
    const [selectedStudent, setSelectedStudent] = useState()
    const [skills, setSkills] = useState([])
    const [matchedAlumni, setMatchedAlumni] = useState([])
    const [selectedAlumni, setSelectedAlumni] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
    const handleUpload = async (e) => {
      e.preventDefault()
      const newCourse = {
        id: courses.length + 1,
        title: title,
        tags: await simulateAITagging(title),
      }
      setCourses([...courses, newCourse])
      setTitle('')
      setFile(null)
    }
  
    const simulateAITagging = async (title) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return title.toLowerCase().split(' ').filter(word => word.length > 3)
    }
  
    const handleStudentSelect = async (studentName) => {
      setIsLoading(true)
      setSelectedStudent(studentName)
      try {
        const response = await axios.post('http://localhost:5000/findProjectPair',{
            name: studentName,
        });
        console.log(response);
        if(response.status!==200){
          toast.success("Error fetching Project Pairs!");
        }else{
            setMatchedAlumni(response.data.alumniWithSkillCounts);
        }
    
      } catch (error) {
        toast.error(error.response.data);
        console.error('Error during uploading course', error.response.data);
      }
      setIsLoading(false)
    }
  
  
  
    const handlePairing = async () => {
        try {
            const response = await axios.post('http://localhost:5000/PairforProject', {
                studentName: selectedStudent,
                alumniName: selectedAlumni,
                description: projectDescription,
            });
            console.log(response);
            if(response.status!==200){
              toast.error("Error Pairing for Projects!");
            }else{
                toast.success("Successfully paired");
            }
        
          } catch (error) {
            toast.error(error.response.data);
            console.error('Error during Pairing for Projects', error.response.data);
          }
    }
    const getCourses = useCallback( async () => {
        try {
            const response = await axios.get('http://localhost:5000/getAllCourses');
            console.log(response);
            if(response.status!==201){
              toast.success("Error fetching Courses!");
            }else{
                console.log(response.data.courses);
                setCourses(response.data.courses);
            }
        
          } catch (error) {
            toast.error(error.response.data);
            console.error('Error during uploading course', error.response.data);
          }
    },[]);
    const getStudents = useCallback( async () => {
        try {
            const response = await axios.get('http://localhost:5000/getAllStudents');
            console.log(response.data.students);
            if(response.status!==201){
              toast.success("Error fetching Students!");
            }else{
                setStudents(response.data.students);
            }
        
          } catch (error) {
            toast.error(error.response.data);
            console.error('Error during uploading course', error.response.data);
          }
    },[]);
    useEffect(() => {
        getCourses();
        getStudents();
    },[getCourses, getStudents])
    const formik = useFormik({
        initialValues: {
          title: '',
          description: '',
          link:'',
        },
        validationSchema: Yup.object({
            title: Yup.string()
          .required("Title is required")
          .max(100, 'Name cannot exceed 100 characters'),
    
            description: Yup.string()
            .required('Email is Required'),
            link: Yup.string()
                .required("Link is required"),
        }),
        onSubmit: async values => {
            try {
                const response = await axios.post('http://localhost:5000/upload', {
                  title: values.title,
                  description: values.description,
                  link: values.link,
                });
            
                if(response.status===200){
                  toast({
                    title: "Course uploaded successfully!",
                  })
                  getCourses();
                }
            
              } catch (error) {
                toast.error(error.response.data);
                console.error('Error during uploading course', error.response.data);
              }
        },
      });
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="pairing">Student-Alumni Pairing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Course</CardTitle>
                  <CardDescription>Add a new video course to the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input 
                        type='text'
                        name='title'
                        id='title'
                        placeholder='Title'
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        type='text'
                        name='description'
                        id='description'
                        placeholder='Description'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link">Link</Label>
                      <Input 
                        type='text'
                        name='link'
                        id='link'
                        placeholder='Link'
                        value={formik.values.link}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video">Course Video</Label>
                      <Input 
                        id="video" 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        accept="video/*" 
                      />
                    </div>
                    <Button type="submit">Generate Skills</Button>
                  </form>
                  {skills.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Relevant Skills</CardTitle>
            <CardDescription>Based on your issue, these skills might be helpful to develop:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>All Courses</CardTitle>
                  <CardDescription>View all uploaded courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                       
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Tags</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.description}</TableCell>
                          <TableCell>{course.courseLink}</TableCell>
                          <TableCell>
                            {course.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="mr-1">
                                {skill}
                              </Badge>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pairing">
            <Card>
              <CardHeader>
                <CardTitle>Student-Alumni Pairing</CardTitle>
                <CardDescription>Pair students with alumni for projects based on skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Select Student</Label>
                    <Select value={selectedStudent} onValueChange={handleStudentSelect}>
                      <SelectTrigger id="student">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student._id} value={student.name}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isLoading && (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing student skills...</span>
                      </div>
                    )}
                  </div>
                  {matchedAlumni && matchedAlumni.length>0 && (
                    <div className="space-y-2">
                      <Label htmlFor="alumni">Select Matching Alumni</Label>
                      <Select value={selectedAlumni} onValueChange={setSelectedAlumni}>
                        <SelectTrigger id="alumni">
                          <SelectValue placeholder="Select an alumni" />
                        </SelectTrigger>
                        <SelectContent>
                          {matchedAlumni.map((alumni) => (
                            <SelectItem key={alumni.name} value={alumni.name}>
                              {alumni.name} (Matching skills: {alumni.commonSkills.length})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedAlumni && (
                        <div className="mt-2">
                          <span className="font-semibold">Alumni Common Skills: </span>
                          {matchedAlumni.find(a => a.name === selectedAlumni)?.commonSkills.map((skill) => (
                            <Badge key={skill} variant="outline" className="mr-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Project Description</Label>
                    <Input 
                      id="project-description" 
                      value={projectDescription} 
                      onChange={(e) => setProjectDescription(e.target.value)} 
                      placeholder="Enter project description" 
                      required 
                    />
                  </div>
                  <Button onClick={handlePairing} disabled={!selectedStudent || !selectedAlumni || !projectDescription}>
                    Pair for Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }