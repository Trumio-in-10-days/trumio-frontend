'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Loader2 } from "lucide-react"
import { useFormik } from 'formik'
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useToast } from "../../hooks/use-toast"
import { Textarea } from "../../components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Plus } from "lucide-react"
import { Link } from 'react-router-dom'



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
  const getRequiredSkills = async (description) => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    return ['React', 'Node.js', 'TypeScript', 'API Integration', 'UI/UX Design']
  }
  
  // Mock function to simulate saving to database
  const saveProject = async (project) => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { ...project, id: Math.random().toString(36).substr(2, 9) }
  }
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
    const getProjects = useCallback( async () => {
      try {
          const response = await axios.post('http://localhost:5000/getProjects', {
            token: localStorage['authToken']
          });
          console.log(response);
          if(response.status!==200){
            toast.success("Error fetching projects!");
          }else{
              setProjects(response.data.projects);
          }
      
        } catch (error) {
          // toast.error(error.response.data);
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
        // getCourses();
        getStudents();
        getProjects();
    },[ getStudents, getProjects])
    const formik = useFormik({
        initialValues: {
          title: '',
          description: '',
        },
        validationSchema: Yup.object({
            title: Yup.string()
          .required("Title is required")
          .max(100, 'Name cannot exceed 100 characters'),
    
            description: Yup.string()
            .required('Description is Required'),
        }),
        onSubmit: async values => {
          setIsLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/addProject', {
                  title: values.title,
                  description: values.description,
                  token: localStorage['authToken']
                });
                console.log(response);
            
                if(response.status===200){
                  toast({
                    title: "Project uploaded successfully!",
                  })
                  getProjects();
                  setIsDialogOpen(false);
                }
            
              } catch (error) {
                toast.error(error.response.data);
                console.error('Error during uploading course', error.response.data);
              }
              setIsLoading(false);
        },
      });
      const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({ title: '', description: '' })
  // const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  const handleAssign = (projectId, applicantId) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, status: 'Assigned', assignedTo: applicantId }
        : project
    ))
  }
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
        
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="pairing">Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <div className="space-y-4">
  
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
          <div className="container mx-auto p-4">
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details of your new project. Our AI will suggest required skills based on your description.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Add Project'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link to={`/project/${project._id}`}>
          <Card key={project._id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>Status: {project.assignedStudents.length>0 ? `Taken`: `Open`}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{project.description}</p>
              <h4 className="font-semibold mb-1">Required Skills:</h4>
              <ul className="list-disc list-inside mb-4">
                {project.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              {project.assignedStudents.length>0 && (
                <div>
                  <h4 className="font-semibold mb-1">Applicants:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.assignedStudents.map((applicant) => (
                        <TableRow key={applicant._id}>
                          <TableCell>{applicant.name}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleAssign(project._id, applicant._id)} size="sm">
                              Assign
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {project.assignedStudents>0 && (
                <p className="text-sm text-muted-foreground">
                  Assigned to: {project.assignedStudents[0].name}
                </p>
              )}
            </CardFooter>
          </Card></Link>
        ))}
      </div>
    </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }