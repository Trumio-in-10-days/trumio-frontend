'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { MessageCircle, Send, CheckCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

// Mock data
const projectData = {
  title: "AI-Powered Smart City Management System",
  description: "Develop an AI-driven platform to optimize urban resource allocation, traffic management, and public services for a more efficient and sustainable city.",
  techStack: [
    "Python",
    "TensorFlow",
    "React",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "AWS",
    "GraphQL"
  ],
  applicants: {
    students: [
      { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    alumni: [
      { id: 4, name: "Diana Prince", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 5, name: "Ethan Hunt", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 6, name: "Fiona Gallagher", avatar: "/placeholder.svg?height=40&width=40" },
    ]
  },
  weeklyProgress: [
    { week: 1, summary: "Project kickoff and initial planning" },
    { week: 2, summary: "Research on AI algorithms for urban management" },
    { week: 3, summary: "Design of system architecture" },
    { week: 4, summary: "Implementation of core data processing modules" },
    { week: 5, summary: "Integration with city infrastructure APIs" },
  ]
}

export default function ProjectDetailsPage() {
    const {project_id} = useParams();
    const [project, setProject] = useState();
    const [student, setStudent] = useState(null);
    const [alumni, setAlumni] = useState(null);
    const [students, setStudents] = useState(null);
    const [alumnis, setAlumnis] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedAlumni, setSelectedAlumni] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')

  const handleSelection = async (type, id) => {
    try {
        const response = await axios.post('http://localhost:5000/selectStudentsforProject',{
            projectId: project_id,
            studentId: id,
        });
        // console.log(response);
        if(response.status!==200){
        //   toast.success("Error fetching Project!");
        }else{
           if(response.data.student.isAlumni){
            setSelectedAlumni(id);
           }else{
            setSelectedStudent(id);
           }

        }
    
      } catch (error) {
        // toast.error(error);
        console.log('Error during selecting students', error);
      }
  }

  const sendMessage = () => {
    if (messageInput.trim()) {
      setChatMessages([...chatMessages, { sender: 'Client', message: messageInput }])
      setMessageInput('')
    }
  }
  const getProject = useCallback(async () => {
    try {
        const response = await axios.post('http://localhost:5000/getProjectById',{
            project_id,
        });
        console.log(response);
        if(response.status!==200){
        //   toast.success("Error fetching Project!");
        }else{
            setProject(response.data.project);
            if(response.data.project.assignedStudents.length===1){
                console.log(1);
                if(response.data.project.assignedStudents[0].isAlumni===false){
                    setStudent(response.data.project.assignedStudents[0]);
                    const AlumniStudents = response.data.project.applicants.filter(
                        (student) => student.isAlumni
                      );
                      setAlumnis(AlumniStudents);
                }else{
                    // console.log(response.data.project.assignedStudents[0])
                    setAlumni(response.data.project.assignedStudents[0]);
                    const nonAlumniStudents = response.data.project.applicants.filter(
                        (student) => !student.isAlumni
                      );
                    //   console.log(nonAlumniStudents)
                      setStudents(nonAlumniStudents);
                }
            }else if(response.data.project.assignedStudents.length===2){
                console.log(2);
                setStudent(response.data.project.assignedStudents.find((student) => !student.isAlumni));
                setAlumni(response.data.project.assignedStudents.find((student) => student.isAlumni));
            }else{
                console.log(3);
                const nonAlumniStudents = response.data.project.applicants.filter(
                    (student) => !student.isAlumni
                  );
                //   console.log(nonAlumniStudents)
                  setStudents(nonAlumniStudents);
                  const AlumniStudents = response.data.project.applicants.filter(
                    (student) => student.isAlumni
                  );
                  setAlumnis(AlumniStudents);
            }

        }
    
      } catch (error) {
        // toast.error(error);
        console.log('Error during fetching courses', error);
      }
  },[]);
  useEffect(() => {
    getProject();
  },[getProject])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{project && project.title}</h1>
      <p className="text-lg mb-6">{project && project.description}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Required Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project && project.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Select one student for the project</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {student===null ? (students && students.map((student) => (
                <div key={student._id} className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={student?.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{student.name}</span>
                  </div>
                  <Button
                    variant={selectedStudent === student._id ? "default" : "outline"}
                    onClick={() => handleSelection('student', student._id)}
                    className="relative"
                  >
                    {selectedStudent === student._id ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </div>
              ))): <div key={student._id} className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="ml-2">{student.name}</span>
              </div>
              <Button
                variant={selectedStudent === student._id ? "default" : "outline"}
                onClick={() => handleSelection('student', student._id)}
                className="relative"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Selected
              </Button>
            </div>}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alumni</CardTitle>
            <CardDescription>Select one alumni for the project</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {alumni===null ? (alumnis && alumnis.map((alumni) => (
                <div key={alumni._id} className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={alumni.avatar} alt={alumni.name} />
                      <AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{alumni.name}</span>
                  </div>
                  <Button
                    variant={selectedAlumni === alumni._id ? "default" : "outline"}
                    onClick={() => handleSelection('alumni', alumni._id)}
                    className="relative"
                  >
                    {selectedAlumni === alumni._id ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </div>
              ))) : <div key={alumni._id} className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={alumni.avatar} alt={alumni.name} />
                  <AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="ml-2">{alumni.name}</span>
              </div>
              <Button
                variant={"default"}
                className="relative"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Selected
              </Button>
            </div>}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {projectData.weeklyProgress.map((week) => (
                <div key={week.week} className="mb-4">
                  <h3 className="font-semibold">Week {week.week}</h3>
                  <p>{week.summary}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button>Check Progress</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>Communicate with the selected student and alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{msg.sender}: </span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </ScrollArea>
            <div className="flex">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}