import {Link} from 'react-router-dom';
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { BookOpen, Users, Settings, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            AILearn
          </Link>
          <div className="space-x-4">
            {/* <Link to="/courses" className="text-sm font-medium hover:text-primary">
              Courses
            </Link>
            <Link to="/alumni" className="text-sm font-medium hover:text-primary">
              Alumni
            </Link>
            <Link to="/admin" className="text-sm font-medium hover:text-primary">
              Admin
            </Link> */}
            <Link to="/auth">
            <Button>Sign Up</Button>
            </Link>

          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-foreground text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Empower Your Learning with AI</h1>
            <p className="text-xl mb-8">Personalized courses, intelligent admin tools, and AI-driven alumni engagement</p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started
            </Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our AI-Powered Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BookOpen className="w-12 h-12 text-primary" />}
                title="Adaptive Courses"
                description="AI-tailored learning paths that adapt to your progress and learning style."
              />
              <FeatureCard
                icon={<Settings className="w-12 h-12 text-primary" />}
                title="Intelligent Admin"
                description="Streamlined course management with AI-assisted content creation and student analytics."
              />
              <FeatureCard
                icon={<Users className="w-12 h-12 text-primary" />}
                title="Alumni Engagement"
                description="AI-driven networking and career development opportunities for graduates."
              />
            </div>
          </div>
        </section>

        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number={1}
                title="Choose Your Course"
                description="Browse our AI-recommended courses tailored to your interests and goals."
              />
              <StepCard
                number={2}
                title="Learn at Your Pace"
                description="Engage with adaptive content that adjusts to your learning speed and style."
              />
              <StepCard
                number={3}
                title="Connect and Grow"
                description="Join our AI-matched alumni network for ongoing support and opportunities."
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Learning Experience?</h2>
            <div className="max-w-md mx-auto">
              <form className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="flex-grow" />
                <Button type="submit">Get Started</Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 AILearn. All rights reserved.
            </div>
            {/* <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center items-center w-12 h-12 bg-primary text-white rounded-full text-xl font-bold mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}