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
  const [allProjects, setAllProjects] = useState([]); // Hold all projects
  const [appliedPrj, setAppliedPrj] = useState([]); // Applied projects
  const [assignedPrj, setAssignedPrj] = useState([]); // Assigned projects
  const [newSkill, setNewSkill] = useState("");

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
        console.log(response.data.student);
        setAlumni(response.data.student.isAlumni);
      }
    } catch (error) {
      toast.error("Error fetching student profile");
      console.log("Error fetching student profile:", error);
    }
  }, []);

  // Fetch all projects and filter based on applied/assigned
  const getAllProjects = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/getAppliedAndAssignedProjects",
        {
          token: localStorage["authToken"], // Include token in request body
        }
      );
      if (response.status !== 200) {
        toast.error("Error fetching projects!");
      } else {
        console.log(response.data);
        const projects = response.data;
        setAllProjects(projects);

        // Filter projects where the student has applied or has been assigned
        const applied = projects.appliedProjects;
        const assigned = projects.assignedProjects;

        setAppliedPrj(applied); // Set applied projects
        setAssignedPrj(assigned); // Set assigned projects
      }
    } catch (error) {
      console.log("Error fetching projects:", error);
    }
  }, []);

  useEffect(() => {
    getStudent();
    getAllProjects();
  }, []);

  // Add skill
  const addSkill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/updateSkill", {
        skill: newSkill,
        id: user._id,
        action: "add",
      });
      if (response.status !== 200) {
        toast.error("Error adding skill!");
      } else {
        toast.success("Skill added successfully!");
        if (newSkill && !user.skills.includes(newSkill)) {
          setUser((prev) => ({
            ...prev,
            skills: [...prev.skills, newSkill],
          }));
          setNewSkill("");
        }
      }
    } catch (error) {
      toast.error("Error adding skill");
      console.log("Error adding skill:", error);
    }
  };

  // Remove skill
  const removeSkill = async (skillToRemove) => {
    try {
      const response = await axios.post("http://localhost:5001/updateSkill", {
        skill: skillToRemove,
        id: user._id,
        action: "delete",
      });
      if (response.status !== 200) {
        toast.error("Error removing skill!");
      } else {
        toast.success("Skill removed successfully!");
        setUser((prev) => ({
          ...prev,
          skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
      }
    } catch (error) {
      toast.error("Error removing skill");
      console.log("Error removing skill:", error);
    }
  };

  // Change alumni status
  const changeAlumni = async (al) => {
    try {
      const response = await axios.post("http://localhost:5001/changeAlumni", {
        token: localStorage["authToken"],
        alumni: al,
      });
      if (response.status !== 200) {
        toast.error("Error updating alumni status!");
      } else {
        setAlumni(response.data.student.isAlumni);
      }
    } catch (error) {
      toast.error("Error updating alumni status");
      console.log("Error updating alumni status:", error);
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
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
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
                        <li
                          key={application._id}
                          className="border-b pb-4 last:border-b-0 last:pb-0"
                        >
                          <h3 className="font-semibold text-lg mb-2">
                            {application.title}{" "}
                            {/* Changed projectTitle to title */}
                          </h3>
                          <p>{application.description}</p>{" "}
                          {/* Changed projectDescription to description */}
                          
                          <p> Proposed By: {application.assignedBy.name}</p>
                          {/* Ensure status exists */}
                        </li>
                      ))
                    ) : (
                      <p>No applied projects.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assigned Projects</CardTitle>
                  <CardDescription>Projects you are working on</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {assignedPrj.length > 0 ? (
                      assignedPrj.map((project) => (
                        <li
                          key={project._id}
                          className="border-b pb-4 last:border-b-0 last:pb-0"
                        >
                          <h3 className="font-semibold text-lg mb-2">
                            {project.title}
                          </h3>{" "}
                          {/* Changed projectTitle to title */}
                          <p>{project.description}</p>{" "}
                          {/* Changed projectDescription to description */}
                          <p>Assigned by: {project.assignedBy.name}</p>{" "}
                          {/* Accessing the assignedBy's name */}
                          <p>
                            Start Date:{" "}
                            {new Date(project.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            Expected Deadline:{" "}
                            {new Date(
                              project.expectedDeadline
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            Weekly Progress: {project.weeklyProgress || "N/A"}
                          </p>{" "}
                          {/* Added fallback in case weeklyProgress is undefined */}
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
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
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

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Courses</CardTitle>
                  <CardDescription>
                    Courses you have taken and their associated skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {user.enrolledCourses.length > 0 ? (
                      user.enrolledCourses.map((course) => (
                        <li
                          key={course.id}
                          className="border-b pb-4 last:border-b-0 last:pb-0"
                        >
                          <h3 className="font-semibold text-lg mb-2">
                            {course.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {course.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No enrolled courses.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
