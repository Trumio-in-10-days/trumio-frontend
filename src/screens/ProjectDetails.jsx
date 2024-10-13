import { useParams } from 'react-router-dom';
import ApplicantsList from './ApplicationList';
import WeeklyProgress from './WeeklyProgress';
import axios from 'axios';
import { useEffect, useState } from 'react';

async function getProjectData(id) {
  try {
    const response = await axios.post('http://localhost:5001/getProjectById', {
      project_id: id // Sending project ID in the request body
    });
    console.log(response.data);
    return response.data.project; // Return the data from the response
  } catch (error) {
    console.error("Error fetching project details:", error);
    return null; // Handle error appropriately
  }
}

export default function ProjectPage() {
  const { project_id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      const projectData = await getProjectData(project_id);
      setProject(projectData);
    };

    fetchProjectData();
  }, [project_id]);

  if (!project) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      {project.assignedStudents.length === 2 ? (
         <WeeklyProgress project={project} />
        
      ) : (
        <ApplicantsList applicants={project.applicants} projectId={project_id} assigned={project.assignedStudents} />
      )}
    </div>
  );
}
