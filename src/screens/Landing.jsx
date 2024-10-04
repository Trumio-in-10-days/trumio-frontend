import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { GraduationCap, Briefcase, Users, Building2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <GraduationCap className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">Trumio</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
          <Link to="/auth" className="text-sm font-medium hover:underline underline-offset-4 ">
          <Button className="bg-gradient-to-r to-purple-500 from-indigo-600">Sign Up</Button>
            
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Connect. Learn. Succeed.
              </h1>
              <p className="mx-auto max-w-[700px] text-lg sm:text-xl">
                Trumio bridges the gap between academia and industry, empowering students, clients, and universities to thrive together.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100" size="lg">
                Get Started
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">How Trumio Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <GraduationCap className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Gain real-world experience and skills to land your best first job.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Briefcase className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Accelerate project execution with teams versed in the latest expertise and tools.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Alumni</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Speed up project execution while contributing back to your university ecosystem.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Building2 className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Grow reputation, impact industry, and increase alumni engagement.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">What People Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sarah J.</CardTitle>
                  <CardDescription>Computer Science Student</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>"Trumio helped me land my dream internship. The real-world projects I worked on gave me invaluable experience."</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mark T.</CardTitle>
                  <CardDescription>Tech Startup Founder</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>"As an alumnus, I love giving back to my university while also getting help on cutting-edge projects."</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Dr. Emily R.</CardTitle>
                  <CardDescription>University Dean</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>"Trumio has significantly increased our industry partnerships and student job placement rates."</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join Trumio today and be part of the future of education and industry collaboration.
              </p>
              <Button className="bg-purple-600 text-white hover:bg-purple-700" size="lg">
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Trumio. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}