'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { PlusCircle, X } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Switch } from "../../components/ui/switch"
import { Link } from 'react-router-dom'


export default function StudentProfile() {
    const [user, setUser] = useState();
    const [alumni, setAlumni] = useState();
    const [appliedPrj, setAppliedPrj] = useState([]);
  const [newSkill, setNewSkill] = useState('')
  const getStudent = useCallback(async () => {
    try {
        const response = await axios.post('http://localhost:5001/getStudent', {
            token: localStorage['authToken']
        });
        console.log(response);
        if(response.status!==201){
          toast.success("Error fetching Profile!");
        }else{
            setUser(response.data.student);
            setAlumni(response.data.student.isAlumni);
        }
    
      } catch (error) {
        toast.error(error);
        console.log('Error during fetching courses', error);
      }
},[]);
const getAppliedProjects = useCallback(async () => {
  try {
      const response = await axios.post('http://localhost:5001/getAppliedProjecs', {
          token: localStorage['authToken']
      });
      console.log(response);
      if(response.status!==200){
        toast.success("Error fetching Profile!");
      }else{
        setAppliedPrj(response.data.projects);x
      }
  
    } catch (error) {
      toast.error(error);
      console.log('Error during fetching courses', error);
    }
},[]);
useEffect(() => {
    getStudent(); getAppliedProjects();
},[getStudent, getAppliedProjects])
  const addSkill = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5001/updateSkill', {
            skill: newSkill,
            id: user._id,
            action: 'add'
        });
        console.log(response);
        if(response.status!==200){
          toast.error("Error adding Skill!");
        }else{
            toast.success("hi");
            if (newSkill && !user.skills.includes(newSkill)) {
                setUser(prev => ({
                  ...prev,
                  skills: [...prev.skills, newSkill]
                }))
                setNewSkill('')
              }
        }
    
      } catch (error) {
        toast.error(error);
        console.log('Error adding Skill', error);
      }
  }

  const removeSkill = async (skillToRemove) => {
    try {
        const response = await axios.post('http://localhost:5001/updateSkill', {
            skill: newSkill,
            id: user._id,
            action: 'delete'
        });
        console.log(response);
        if(response.status!==200){
          toast.error("Error adding Skill!");
        }else{
            toast.success("hi");
            setUser(prev => ({
                ...prev,
                skills: prev.skills.filter(skill => skill !== skillToRemove)
              }))
        }
      } catch (error) {
        toast.error(error);
        console.log('Error adding Skill', error);
      }

  }

  const changeAlumni = async (al) => {
    console.log(al);
    try {
      const response = await axios.post('http://localhost:5001/changeAlumni', {
          token: localStorage['authToken'],
          alumni: al,
      });
      console.log(response);
      if(response.status!==200){
        toast.success("Error fetching Profile!");
      }else{
          setAlumni(response.data.student.isAlumni);
      }
  
    } catch (error) {
      toast.error(error);
      console.log('Error during fetching courses', error);
    }
  }
 
  return (
    <>
   {user && <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder.svg" alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="alumni" checked={alumni} onCheckedChange={() => changeAlumni(!alumni)}/>
              <Label htmlFor="alumni">Alumni{alumni}</Label>
          </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Courses you have taken and their associated skills</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {user.enrolledCourses.length>0 && user.enrolledCourses.map((course) => (
                  <li key={course.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
              <CardDescription>Manage and edit your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addSkill} className="flex space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Add a new skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </form>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-xs bg-primary-foreground rounded-full p-1"
                      aria-label={`Remove ${skill} skill`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            {user.projects.length>0 && <><CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>Your projects with alumni and client</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {user.projects.length>0 && user.projects.map((prj) => (
                   <Link to={`/project/${prj._id}`}>
                  <li key={prj._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-lg mb-2">{prj.title}</h3>
                    <h3 className="font-semibold text-base mb-2">{prj.description}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Client: {prj.assignedBy.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {prj.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </li></Link>
                ))}
              </ul>
              </CardContent></>}
              {appliedPrj.length>0 && <><CardHeader><CardTitle>Applied Projects</CardTitle><CardDescription>The Projects you applied for!</CardDescription></CardHeader>
              <CardContent>
              <ul className="space-y-4">
                {appliedPrj.length>0 && appliedPrj.map((prj) => (
                  <Link to={`/project/${prj._id}`}>
                  <li key={prj._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-lg mb-2">{prj.title}</h3>
                    <h3 className="font-semibold text-base mb-2">{prj.description}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Client: {prj.assignedBy.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {prj.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </li></Link>
                ))}
              </ul>
              </CardContent></>}
              

          </Card>
        </TabsContent>
      </Tabs>
    </div>}
    </>
  )
}