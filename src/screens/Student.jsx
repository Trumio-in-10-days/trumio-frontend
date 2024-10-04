'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Briefcase, Star, ChevronRight, Search } from "lucide-react"


// Mock video courses data
const mockCourses = [
  { id: 1, title: "Introduction to React", skills: ["react", "javascript", "frontend"] },
  { id: 2, title: "Advanced Python Programming", skills: ["python", "algorithms", "backend"] },
  { id: 3, title: "Data Structures and Algorithms", skills: ["algorithms", "data structures", "problem solving"] },
  { id: 4, title: "UI/UX Design Principles", skills: ["ui design", "ux design", "wireframing"] },
  { id: 5, title: "Machine Learning Basics", skills: ["machine learning", "python", "data analysis"] },
]
const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Platform Development',
    description: 'Develop a full-stack e-commerce platform with React and Node.js.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    client: 'TechCorp Inc.',
    duration: '3 months',
    recommended: true,
  },
  {
    id: '2',
    title: 'Mobile App for Fitness Tracking',
    description: 'Create a cross-platform mobile app for tracking fitness and nutrition.',
    skills: ['React Native', 'Firebase', 'UI/UX Design'],
    client: 'FitLife Solutions',
    duration: '2 months',
    recommended: false,
  },
  {
    id: '3',
    title: 'AI-powered Chatbot',
    description: 'Implement an AI chatbot for customer support using natural language processing.',
    skills: ['Python', 'Machine Learning', 'NLP', 'API Integration'],
    client: 'SupportAI',
    duration: '4 months',
    recommended: true,
  },
  {
    id: '4',
    title: 'Blockchain-based Supply Chain System',
    description: 'Develop a supply chain management system using blockchain technology.',
    skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js'],
    client: 'ChainTrack Solutions',
    duration: '6 months',
    recommended: false,
  },
  {
    id: '5',
    title: 'Data Visualization Dashboard',
    description: 'Create an interactive data visualization dashboard for business analytics.',
    skills: ['D3.js', 'React', 'Data Analysis', 'SQL'],
    client: 'DataViz Corp',
    duration: '3 months',
    recommended: true,
  },
]

export default function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState();
  const [issue, setIssue] = useState('')
  const [generatedSkills, setGeneratedSkills] = useState([])
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [openProjects, setOpenProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleApply = (projectId) => {
    if (!appliedProjects.includes(projectId)) {
      setAppliedProjects([...appliedProjects, projectId])
    }
  }

  const filteredProjects = openProjects.filter(project => {
    const matchesFilter = filter === 'all' || (filter === 'recommended' && project.skills.some(skill => skill.toLowerCase().includes(user.skills)))
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

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
const getOpenProjects = useCallback(async () => {
  try {
      const response = await axios.get('http://localhost:5000/getAllOpenProjects');
      console.log(response);
      if(response.status!==200){
        toast.success("Error fetching Projects!");
      }else{
          setOpenProjects(response.data.reqProjects);
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
    getOpenProjects()
}, [getCourses, getStudent, getOpenProjects])

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

  const ProjectCard = ({ project }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {project.title}
          {project.recommended && (
            <Badge variant="secondary" className="ml-2">
              <Star className="mr-1 h-3 w-3" /> Recommended
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{project.client} • {project.duration}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map((skill, index) => (
            <Badge key={index} variant="outline">{skill}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => handleApply(project.id)}
          disabled={appliedProjects.includes(project.id)}
        >
          {appliedProjects.includes(project.id) ? 'Applied' : 'Apply Now'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      {user && <Link to={`/student/${user._id}`}><Button>Profile</Button></Link>}

      <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          
          <TabsContent value="courses">
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
          </TabsContent>
          <TabsContent value="projects">
          <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="recommended">Recommended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-center text-gray-500">No projects found matching your criteria.</p>
        )}
      </ScrollArea>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            My Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appliedProjects.length > 0 ? (
            <ul className="list-disc list-inside">
              {appliedProjects.map((projectId) => {
                const project = mockProjects.find(p => p.id === projectId)
                return project ? (
                  <li key={projectId} className="mb-2">
                    {project.title} - {project.client}
                  </li>
                ) : null
              })}
            </ul>
          ) : (
            <p>You haven't applied to any projects yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
          </TabsContent>
          </Tabs>

    </div>
  )
}