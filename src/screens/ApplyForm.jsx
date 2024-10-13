"use client";

import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ProjectApplicationForm() {
    const { projectId } = useParams();
    const [formData, setFormData] = useState({
        startDate: new Date(),
        weeklyProgress: [],
        contactNumber: "",  // Added contactNumber here
        bidAmount: "" // Added bidAmount here
    });
    const [errors, setErrors] = useState({});
    const [weeks, setWeeks] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state when fetching project details
    const [fetchError, setFetchError] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null); // For storing project details
    const [submitLoading, setSubmitLoading] = useState(false); // Track submission loading state
    const [successMessage, setSuccessMessage] = useState(""); // For success message
    const [assignedBy, setAssignedBy] = useState(""); 

    useEffect(() => {
        const fetchProjectDetails = async () => {  
            try {
                const response = await axios.post("http://localhost:5001/getProjectById", { project_id: projectId });
                const data = response.data.project;
                console.log(data);
                // Populate form data with the fetched project details
                setProjectDetails(data);
                setAssignedBy(data.assignedBy);
                setWeeks(data.totalWeeks); // Assuming totalWeeks is provided
            } catch (error) {
                setFetchError(error.response?.data?.msg || "Failed to fetch project details");
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    useEffect(() => {
        if (formData.startDate && projectDetails?.expectedDeadline) {
            const start = new Date(formData.startDate);
            const end = new Date(projectDetails.expectedDeadline);
            const diffTime = Math.abs(end - start);
            if (start > end) {
                alert("Invalid Start Date");
            } else {
                const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
                setWeeks(diffWeeks);
                setFormData((prev) => ({
                    ...prev,
                    weeklyProgress: Array(diffWeeks).fill(""),
                }));
            }
        }
    }, [formData.startDate, projectDetails]);

    const handleWeeklyProgressChange = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            weeklyProgress: prev.weeklyProgress.map((item, i) => (i === index ? value : item)),
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.startDate) {
            formErrors.startDate = "Start date is required";
        } else {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(projectDetails?.expectedDeadline);

            if (endDate <= startDate) {
                formErrors.endDate = "End date must be after start date";
            }

            const maxStartDate = new Date(endDate);
            maxStartDate.setDate(endDate.getDate() - 1);

            if (startDate > maxStartDate) {
                formErrors.startDate = "Start date must be at most one day before the end date";
            }
        }

        formData.weeklyProgress.forEach((progress, index) => {
            if (!progress.trim()) {
                formErrors[`week${index + 1}`] = `Week ${index + 1} progress is required`;
            }
        });

        if (!formData.contactNumber) {
            formErrors.contactNumber = "Contact number is required";
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
            formErrors.contactNumber = "Please enter a valid 10-digit contact number";
        }

        if (!formData.bidAmount) {
            formErrors.bidAmount = "Bid amount is required";
        } else if (isNaN(formData.bidAmount) || formData.bidAmount <= 0) {
            formErrors.bidAmount = "Please enter a valid positive number for bid amount";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmitLoading(true); // Set loading state to true
            try {
                const response = await axios.post("http://localhost:5001/applications", {
                    projectTitle: projectDetails.title,
                    projectId, 
                    projectDescription: projectDetails.description,
                    startDate: formData.startDate,
                    expectedDeadline: projectDetails.expectedDeadline,
                    weeklyProgress: formData.weeklyProgress.map((progress, index) => ({
                        weekNumber: index + 1,  // Add weekNumber based on index
                        progressDescription: progress
                    })),
                    contactNumber: formData.contactNumber,  // Sending contact number
                    bidAmount: formData.bidAmount, // Sending bid amount
                    token: localStorage.getItem("authToken"),
                    assignedBy // Use stored auth token for authentication
                });
                setSuccessMessage("Application submitted successfully!");
                console.log("Form submitted successfully:", response.data);
            } catch (error) {
                console.error("Error submitting form:", error.response?.data || error.message);
                setFetchError("Failed to submit application. Please try again.");
            } finally {
                setSubmitLoading(false); // Set loading state back to false
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Student Project Application</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <p>Loading project details...</p>
                    </div>
                ) : fetchError ? (
                    <p className="text-red-500">{fetchError}</p>
                ) : projectDetails ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Project Name</Label>
                            <p>{projectDetails.name}</p>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <p>{projectDetails.description}</p>
                        </div>
                        <div>
                            <Label>Expected Deadline</Label>
                            <p>{formatDate(projectDetails.expectedDeadline)}</p>
                        </div>
                        <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className={errors.startDate ? "border-red-500" : ""}
                            />
                            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                        </div>
                        <div>
                            <Label htmlFor="contactNumber">Contact Number</Label>
                            <Input
                                id="contactNumber"
                                name="contactNumber"
                                type="text"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                className={errors.contactNumber ? "border-red-500" : ""}
                            />
                            {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                        </div>
                        <div>
                            <Label htmlFor="bidAmount">Bid Amount ($)</Label>
                            <Input
                                id="bidAmount"
                                name="bidAmount"
                                type="text"
                                value={formData.bidAmount}
                                onChange={(e) => setFormData({ ...formData, bidAmount: e.target.value })}
                                className={errors.bidAmount ? "border-red-500" : ""}
                            />
                            {errors.bidAmount && <p className="text-red-500 text-sm mt-1">{errors.bidAmount}</p>}
                        </div>
                        {weeks > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Weekly Progress</h3>
                                {formData.weeklyProgress.map((progress, index) => (
                                    <div key={index}>
                                        <Label htmlFor={`week${index + 1}`}>{`Week ${index + 1} Progress`}</Label>
                                        <Input
                                            id={`week${index + 1}`}
                                            value={progress}
                                            onChange={(e) => handleWeeklyProgressChange(index, e.target.value)}
                                            className={errors[`week${index + 1}`] ? "border-red-500" : ""}
                                        />
                                        {errors[`week${index + 1}`] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[`week${index + 1}`]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                ) : null}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} className="w-full" disabled={submitLoading}>
                    {submitLoading ? "Submitting..." : "Submit Application"}
                </Button>
            </CardFooter>
            {successMessage && (
                <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> Please correct the errors above before submitting.</span>
                    <AlertCircle className="absolute top-0 right-0 mt-4 mr-4" />
                </div>
            )}
        </Card>
    );
}
