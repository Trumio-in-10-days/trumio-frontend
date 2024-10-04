'use client'

import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


export default function AuthPage() {
    const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [alumni, setAlumni] = useState(false);
  const [action, setAction] = useState('signup');

  const studentSignUp  = async (name, email, password) => {
    // console.log(name, email, password, alumni);
    try {
      const response = await axios.post('http://localhost:5000/student/signup', {
        name,
        email,
        password,
        alumni,
      });
  
      if(response.status===200){
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        navigate('/student');
      }
  
      console.log('Sign-up successful', response.data);
    } catch (error) {
      console.error('Error during sign-up', error);
    }
  };
  const adminSignUp  = async (name, email, password) => {
    // console.log(name, email, password);
    try {
      const response = await axios.post('http://localhost:5000/admin/signup', {
        name,
        email,
        password,
      });
  

      if(response.status===200){
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        navigate('/client');
      }
  
      console.log('Sign-up successful', response.data);
    } catch (error) {
      console.error('Error during admin sign-up', error.response.data);
    }
  };
  const studentSignIn  = async (email, password) => {
    // console.log( email, password);
    try {
      const response = await axios.post('http://localhost:5000/student/signin', {
        email,
        password,
      });
      if(response.status===200){
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        navigate('/student');
      }


    } catch (error) {
      console.error('Error during student sign-in', error.response.data);
    }
  };
  const adminSignIn  = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/admin/signin', {
        email,
        password,
      });
  
      if(response.status===200){
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        navigate('/client');
      }
  
      console.log('Sign-in successful', response.data);
    } catch (error) {
      console.error('Error during admin sign-in', error.response.data);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(100, 'Name cannot exceed 100 characters'),

      email: Yup.string()
        .required('Email is Required')
        .email('Please enter a valid email'),
      password: Yup.string()
        .required('Password is Required')
        .min(6, 'Password must be atleast 6 characters'),
    }),
    onSubmit: async values => {
        if(role==='student'){
            if(action==='signin'){
                studentSignIn(values.email, values.password);
            }else{
                studentSignUp(values.name, values.email, values.password);
            }
        }else{
            if(action==='signin'){
                adminSignIn(values.email, values.password);
            }else{
                adminSignUp(values.name, values.email, values.password);
            }
        }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">Sign up or sign in to continue</p>
        </div>

        <RadioGroup defaultValue="student" className="flex justify-center space-x-4" onValueChange={setRole}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student">Student</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin">Client</Label>
          </div>
        </RadioGroup>

        <Tabs defaultValue="signup" className="w-full" onValueChange={setAction}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
              <div>
                  <Label htmlFor="signup-name" className="sr-only">Name</Label>
                  <Input type='text'
                      name='name'
                      id='signup-name'
                      placeholder='Name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="sr-only">Email address</Label>
                  <Input type='text'
                      name='email'
                      id='signup-email'
                      placeholder='Email'
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="sr-only">Password</Label>
                  <Input type='password'
                      name='password'
                      id='signup-password'
                      placeholder='Password'
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}/>
                </div>
                {role === 'student' && (
                  <>
                    <div className='my-2'>
                    <Checkbox id="alumni" onCheckedChange={() => setAlumni(!alumni)}/>
                    <label
                        htmlFor="alumni"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        
                    >
                        I am an Alumni
                    </label>
                    </div>
                  </>
                )}
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signin">
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <Label htmlFor="signin-email" className="sr-only">Email address</Label>
                  <Input type='text'
                      name='email'
                      id='signin-email'
                      placeholder='Email'
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}  />
                </div>
                <div>
                  <Label htmlFor="signin-password" className="sr-only">Password</Label>
                  <Input type='password'
                      name='password'
                      id='signin-password'
                      placeholder='Password'
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}