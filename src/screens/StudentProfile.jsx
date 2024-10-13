"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { PlusCircle, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "../../components/ui/switch";

export default function StudentProfile() {
  const [user, setUser] = useState();
  const [alumni, setAlumni] = useState();
  const [allProjects, setAllProjects] = useState([]);
  const [appliedPrj, setAppliedPrj] = useState([]);
  const [assignedPrj, setAssignedPrj] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newProgress, setNewProgress] = useState(""); // For updating progress
  const [currentWeek, setCurrentWeek] = useState(null); // To calculate the current week
  const [canEdit, setCanEdit] = useState(false); // To control edit access for progress
  const [application_id, setApplicationId] = useState({});
  const [progressData, setProgressData] = useState({});
  // Fetch student details
  const getStudent = useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:5001/getStudent", {
        token: localStorage["authToken"],
      });
      if (response.status !== 201) {
        toast.error("Error fetching Profile!");
      } else {
        setUser(response.data.student);
        console.log(response.data);
        let arr = [];
        let projectToApplicationMap={};
        response.data.student.projects.forEach((project) => {
          projectToApplicationMap[project.project] = project.application;
        });
        
        setApplicationId(projectToApplicationMap);
        setAlumni(response.data.student.isAlumni);
      }
    } catch (error) {
      toast.error("Error fetching student profile");
    }
  }, []);

  // Fetch all projects and filter applied/assigned projects
  const getAllProjects = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/getAppliedAndAssignedProjects",
        { token: localStorage["authToken"] }
      );
      if (response.status === 200) {
        const projects = response.data;
        setAllProjects(projects);
        console.log(projects);
        setAppliedPrj(projects.appliedProjects);
        setAssignedPrj(projects.assignedProjects);
       await fetchProgressForProjects(projects.assignedProjects);
        calculateCurrentWeek(projects.assignedProjects[0]?.startDate); // Calculate week for first assigned project
      } else {
        toast.error("Error fetching projects!");
      }
    } catch (error) {
      toast.error("Error fetching projects");
    }
  }, []);

  // Calculate current week based on start date
  const calculateCurrentWeek = (startDate) => {
    if (!startDate) return;
    const start = new Date(startDate);
    const today = new Date();
    const diffInMs = today - start;
    const weekNumber = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;
    setCurrentWeek(weekNumber);

    // Logic to determine if the current user can edit progress for the current week
    setCanEdit(true); // Adjust this condition based on who can edit
  };
  const fetchProgressForProjects = async (projects) => {
    const progressMap = {};
    for (const project of projects) {
      const appId = application_id[project._id];
      if (appId) {
        const progress = await getApplication(appId);
        console.log(progress);
        progressMap[project._id] = progress;
      }
    }
    setProgressData(progressMap);
  };
  // Update weekly progress
  const updateProgress = async (projectId) => {
    try {
      const response = await axios.post("http://localhost:5001/updateProgress", {
        token: localStorage["authToken"],
        projectId,
        weekNumber: currentWeek,
        progressDescription: newProgress,
      });
      if (response.status === 200) {
        toast.success("Progress updated successfully!");
        setNewProgress("");
        await getAllProjects(); // Refresh project data after updating progress
      } else {
        toast.error("Error updating progress!");
      }
    } catch (error) {
      toast.error("Error updating progress");
    }
  };
  
  useEffect(() => {
    getStudent();
    console.log(application_id);
   getAllProjects();
    console.log({'call':getApplication(`670a3c8a7781920681a74f00`)});
  }, []);
  async function getApplication(id) {
    try {
      const response = await axios.post("http://localhost:5001/getapplication", {
        application_id: id,
      });
      if (response.status === 200) {
        const data = response.data.application.weeklyProgress;
        console.log("Weekly Progress Data:", data);
        return data;
      } else {
        console.error("Failed to fetch application. Status:", response.status);
        return null; // Return a default value or handle as needed
      }
    } catch (error) {
      console.error("Error fetching application:", error.message);
      return null; // Return a default value or handle as needed
    }
  }
  
  // Add skill functionality
  const addSkill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/updateSkill", {
        skill: newSkill,
        id: user._id,
        action: "add",
      });
      if (response.status === 200) {
        toast.success("Skill added successfully!");
        setUser((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
        setNewSkill("");
      } else {
        toast.error("Error adding skill!");
      }
    } catch (error) {
      toast.error("Error adding skill");
    }
  };

  // Remove skill functionality
  const removeSkill = async (skillToRemove) => {
    try {
      const response = await axios.post("http://localhost:5001/updateSkill", {
        skill: skillToRemove,
        id: user._id,
        action: "delete",
      });
      if (response.status === 200) {
        toast.success("Skill removed successfully!");
        setUser((prev) => ({
          ...prev,
          skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
      } else {
        toast.error("Error removing skill!");
      }
    } catch (error) {
      toast.error("Error removing skill");
    }
  };

  // Change alumni status
  const changeAlumni = async (al) => {
    try {
      const response = await axios.post("http://localhost:5001/changeAlumni", {
        token: localStorage["authToken"],
        alumni: al,
      });
      if (response.status === 200) {
        setAlumni(response.data.student.isAlumni);
      } else {
        toast.error("Error updating alumni status!");
      }
    } catch (error) {
      toast.error("Error updating alumni status");
    }
  };

  return (
    <>
      {user && (
        <div className="container mx-auto p-4">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="alumni"
                    checked={alumni}
                    onCheckedChange={() => changeAlumni(!alumni)}
                  />
                  <Label htmlFor="alumni">Alumni</Label>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              {/* Applied Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Applied Projects</CardTitle>
                  <CardDescription>
                    Projects you have applied for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {appliedPrj.length > 0 ? (
                      appliedPrj.map((application) => (
                        <li key={application._id}>
                          <h3 className="font-semibold text-lg mb-2">
                            {application.title}
                          </h3>
                          <p>{application.description}</p>
                          <p>Proposed By: {application.assignedBy?.name}</p>
                        </li>
                      ))
                    ) : (
                      <p>No applied projects.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Assigned Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Projects</CardTitle>
                  <CardDescription>
                    Projects you are working on
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {assignedPrj.length > 0 ? (
                      assignedPrj.map((project) => (
                        <li key={project._id}>
                          <h3 className="font-semibold text-lg mb-2">
                            {project.title}
                          </h3>
                          <p>{project.description}</p>
                          <p>Assigned by: {project.assignedBy.name}</p>
                          <p>
                            Start Date: {new Date(project.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Expected Progress:</strong>
                            <ul>
                              {progressData[project._id]? 
                                (progressData[project._id].map((week, index) => (
                                  <li key={index}>
                                    Week {index + 1}: {week.progressDescription}
                                  </li>
                                ))
                              ) : (
                                <li>No progress recorded yet.</li>
                              )}
                            </ul>
                          </p>
                          <p>
                            <strong>Weekly Progress:</strong>
                            <ul>
                              {project.progress&&project.progress.length > 0 ? (
                                project.progress.map((week, index) => (
                                  <li key={index}>
                                    Week {index + 1}: {week.progressDescription}
                                  </li>
                                ))
                              ) : (
                                <li>No progress recorded yet.</li>
                              )}
                            </ul>
                          </p>
                          {canEdit && currentWeek && (
                            <div className="mt-4">
                               Week : {currentWeek}
                              <Input
                                type="text"
                                placeholder="Update Progress"
                                value={newProgress}
                                onChange={(e) => setNewProgress(e.target.value)}
                              />
                              <Button
                                onClick={() => updateProgress(project._id)}
                                className="mt-2"
                              >
                                Update Progress
                              </Button>
                            </div>
                          )}
                        </li>
                      ))
                    ) : (
                      <p>No assigned projects.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <form onSubmit={addSkill} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Add a new skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <Button type="submit">Add Skill</Button>
                  </form>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {user.skills.map((skill) => (
                      <li key={skill} className="flex justify-between">
                        <span>{skill}</span>
                        <Button
                          onClick={() => removeSkill(skill)}
                          variant="destructive"
                        >
                          <X />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Courses</CardTitle>
                  <CardDescription>
                    Courses completed and in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>No courses added yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
