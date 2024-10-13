'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Loader2, Search, ChevronRight } from "lucide-react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { format } from 'date-fns';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [issue, setIssue] = useState('');
  const [generatedSkills, setGeneratedSkills] = useState([]);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [openProjects, setOpenProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Function to handle applying to a project
  const handleApply = (projectId) => {
    navigate(`/apply/${projectId}`);
  };

  // Function to handle completing a course
  const completeCourse = async (id) => {
    try {
      const response = await axios.post('http://localhost:5001/completeCourse', {
        _id: id,
        token: localStorage.getItem('authToken'),
      });
      if(response.status === 200){
        toast.success("Course completed!");
        // Refresh courses and student info
        await getCourses();
        await getStudent();
      } else {
        throw new Error("Failed to complete course");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error completing course: ${error.response.status} ${error.response.statusText}`);
        console.error('Error response:', error.response);
      } else if (error.request) {
        toast.error('Error completing course: No response from server');
        console.error('Error request:', error.request);
      } else {
        toast.error(`Error completing course: ${error.message}`);
        console.error('Error message:', error.message);
      }
    }
  };

  // Function to find matching courses based on skills
  const findMatchingCourses = (skills, coursesList) => {
    return coursesList
      // .filter(course => 
      //   course.skills.some(skill => skills.includes(skill.toLowerCase()))
      // )
      // .sort((a, b) => {
      //   const aMatchCount = a.skills.filter(skill => skills.includes(skill.toLowerCase())).length;
      //   const bMatchCount = b.skills.filter(skill => skills.includes(skill.toLowerCase())).length;
      //   return bMatchCount - aMatchCount;
      // });
  };

  // Logging updated courses for debugging
  useEffect(() => {
    console.log("Updated courses:", courses);
  }, [courses]);

  // Fetch courses with the correct formatting
  const getCourses = useCallback(async (searchQuery) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5001/getAllCourses', {
        headers: {
          // Remove Authorization header if not needed
          // Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        params: {
          searchQuery
        }
      });
  
      if (response.status === 200) {
        const formattedCourses = response.data;
  
        console.log("Formatted courses:", formattedCourses);
        setCourses(formattedCourses);
        return formattedCourses;
      } else {
        throw new Error("Failed to fetch courses");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error fetching courses: ${error.response.status} ${error.response.statusText}`);
        console.error('Error response:', error.response);
      } else if (error.request) {
        toast.error('Error fetching courses: No response from server');
        console.error('Error request:', error.request);
      } else {
        toast.error(`Error fetching courses: ${error.message}`);
        console.error('Error message:', error.message);
      }
      return []; // Return empty array on error to prevent further issues
    } finally {
      setIsLoading(false);
    }
  }, []);
  
 
  function isAssigned(applicants, studentId) {
    console.log({ applicants ,studentId });
    return applicants.some((applicant) => applicant.student === studentId);
  }
 
  // Fetch student information
  const getStudent = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/getStudent', {
        token: localStorage.getItem('authToken')
      });
      if(response.status === 201){
        setUser(response.data.student);
      } else {
        throw new Error("Failed to fetch student info");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error fetching student info: ${error.response.status} ${error.response.statusText}`);
        console.error('Error response:', error.response);
      } else if (error.request) {
        toast.error('Error fetching student info: No response from server');
        console.error('Error request:', error.request);
      } else {
        toast.error(`Error fetching student info: ${error.message}`);
        console.error('Error message:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch open projects
  const getOpenProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5001/getAllOpenProjects', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include if required by backend
        },
      });
      if (response.status === 200) {
        console.log(response.data.reqProjects);
        setOpenProjects(response.data.reqProjects);
      } else {
        throw new Error("Failed to fetch projects");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error fetching projects: ${error.response.status} ${error.response.statusText}`);
        console.error('Error response:', error.response);
      } else if (error.request) {
        toast.error('Error fetching projects: No response from server');
        console.error('Error request:', error.request);
      } else {
        toast.error(`Error fetching projects: ${error.message}`);
        console.error('Error message:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    Promise.all([getStudent(), getOpenProjects()])
      .catch(error => {
        console.error("Error initializing dashboard:", error);
        toast.error("Error initializing dashboard. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [getStudent, getOpenProjects]);

  // Submit issue to get skills and recommend courses
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setIsGeneratingSkills(true);
    setGeneratedSkills([]);
    setRecommendedCourses([]);
    setCurrentPage(1); // Reset to first page on new search
  
    try {
      const response = await axios.post('http://localhost:5001/findSkillfromIssue', {
        issue: issue,
      });
  
      if (response.status === 200) {
        const finalSkills = response.data.data.map(element => element.toLowerCase().trim());
        setGeneratedSkills(finalSkills);
        console.log("Generated Skills:", finalSkills);
  
        // Combine default search terms with final skills
        const searchQuery = `${finalSkills.join(', ')}`;
  
        // Fetch courses using the dynamic search query
        const fetchedCourses = await getCourses(searchQuery);
        const matchingCourses = findMatchingCourses(finalSkills, fetchedCourses);
        setRecommendedCourses(matchingCourses);
        console.log("Recommended Courses:", matchingCourses);
      } else {
        throw new Error("Failed to get skills from issue");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error getting skills from issue: ${error.response.status} ${error.response.statusText}`);
        console.error('Error response:', error.response);
      } else if (error.request) {
        toast.error('Error getting skills from issue: No response from server');
        console.error('Error request:', error.request);
      } else {
        toast.error(`Error getting skills from issue: ${error.message}`);
        console.error('Error message:', error.message);
      }
    } finally {
      setIsGeneratingSkills(false);
    }
  };
  function isApplicant(applicants, studentId) {
    return applicants.some((applicant) => applicant.student === studentId);
  }
  // Placeholder ProjectCard component (ensure it receives correct props)
  const ProjectCard = ({ project }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {project.title}
        </CardTitle>
        <CardDescription>{project.assignedBy?.name || 'Unknown'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map((skill, index) => (
            <Badge key={index} variant="outline">{skill}</Badge>
          ))}
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">
            Expected Deadline
          </Label>
          <p className="text-gray-600">
            {project.expectedDeadline 
              ? format(new Date(project.expectedDeadline), 'MMMM do, yyyy') 
              : "Not Specified"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => handleApply(project._id)}
          disabled={((isApplicant(project.applicants,user._id))||(isAssigned(project.assignedStudents,user._id)))}
        >
          {isApplicant(project.applicants,user._id)||((isAssigned(project.assignedStudents,user._id))) ? 'Applied' : 'Apply Now'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Filter and search logic for projects
  const filteredProjects = openProjects.filter(project => {
    const matchesFilter = filter === 'all' || (filter === 'recommended' && project.skills.some(skill => user?.skills?.includes(skill.toLowerCase())));
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
  
  console.log({"filetred":filteredProjects});

  // Calculate total pages
  const totalPages = Math.ceil(recommendedCourses.length / ITEMS_PER_PAGE);

  // Get current courses for the page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = recommendedCourses.slice(startIndex, endIndex);

  // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      {user && (
        <Link to={`/student/${user._id}`}>
          <Button className="mb-6 ">Profile</Button>
        </Link>
      )}

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
                  {currentCourses.map((course) => (
                    <li key={course.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                        <Button onClick={() => completeCourse(course.id)}>Complete</Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                      <Link to={`/course-detail/${course.id}`} state={{ course }}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                          View Details
                        </Button>
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {course.skills.map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={generatedSkills.includes(skill.toLowerCase()) ? 'bg-primary/20' : ''}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p><strong>Instructor:</strong> {course.instructor}</p>
                      <p><strong>Language:</strong> {course.language}</p>
                      <p><strong>Price:</strong> {course.price}</p>
                      <img src={course.image} alt={course.title} className="w-60 mt-2" />
                    </li>
                  ))}
                </ul>

                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                  <Button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects">
          <div className="container mx-auto p-4">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
