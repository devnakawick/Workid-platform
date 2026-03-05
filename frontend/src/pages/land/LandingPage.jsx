import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Workid.jpeg";

export default function LandingPage({ onLearnMore }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignupTypeOpen, setIsSignupTypeOpen] = useState(false);

  const handleLearn = () => {
    if (typeof onLearnMore === "function") onLearnMore();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logo} alt="WorkID" className="w-10 h-10 rounded-lg" />
          <span className="font-extrabold text-lg">WorkID</span>
        </div>

        <nav className="flex gap-6 items-center text-sm font-semibold">
          <button onClick={handleLearn} className="hover:text-blue-600">
            Home
          </button>
          <button onClick={handleLearn} className="hover:text-blue-600">
            Features
          </button>
          <button onClick={handleLearn} className="hover:text-blue-600">
            How It Works
          </button>
          <button onClick={() => setIsOpen(true)} className="hover:text-blue-600">
            Login
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative text-center py-24 px-6 bg-gradient-to-br from-blue-700 to-blue-500 text-white overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold max-w-3xl mx-auto leading-tight">
          Empowering Every Worker With Skills, Identity & Better Jobs
        </h1>
        <p className="mt-4 text-blue-100 max-w-xl mx-auto">
          Verify your skills, build your reputation, and access fair job
          opportunities.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Get Started
          </button>
          <button
            onClick={handleLearn}
            className="border border-white px-6 py-3 rounded-lg hover:bg-white/10"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Why Workers Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Verified Identity", "Proof-backed profiles employers trust."],
            ["Skill Badges", "Showcase capabilities at a glance."],
            ["Smart Job Matching", "Get matched to the right jobs fast."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-slate-500 mt-2 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHALLENGES VS SOLUTIONS */}
      <section className="bg-slate-100 py-14 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 text-sm">
          <div>
            <h3 className="font-semibold mb-4">The Challenges Workers Face</h3>
            <ul className="space-y-2 text-slate-600">
              <li>❌ No verified identity</li>
              <li>❌ Low wages from lack of trust</li>
              <li>❌ Limited access to fair jobs</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">How We Solve It</h3>
            <ul className="space-y-2 text-slate-600">
              <li>✅ Verified profiles</li>
              <li>✅ Reputation score</li>
              <li>✅ Fair job access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Everything You Need To Grow
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Digital Identity",
            "Reputation Score",
            "Job Matching",
            "Learning Tasks",
            "Wage Transparency",
            "Profile Badges",
          ].map((item) => (
            <div key={item} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold">{item}</h3>
              <p className="text-slate-500 text-sm mt-2">
                Lorem ipsum description placeholder.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-100 py-14 px-8 text-center">
        <h2 className="text-2xl font-bold mb-8">How It Works</h2>
        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-600">
          {[
            "Create Profile",
            "Get Verified",
            "Apply for Jobs",
            "Track Work",
            "Build Reputation",
          ].map((step) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                ✓
              </div>
              {step}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-16 px-6">
        <h2 className="text-2xl md:text-3xl font-bold max-w-xl mx-auto">
          Join thousands of workers improving their livelihoods.
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-6 bg-white text-blue-700 font-bold px-6 py- rounded-lg hover:bg-blue-50"
        >
          Get Started
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-sm text-slate-500">
        © {new Date().getFullYear()} WorkID
      </footer>

      {/* DIALOGS */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Started</DialogTitle>
            <DialogDescription>
              Choose how you'd like to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                setIsSignupTypeOpen(true);
              }}
            >
              Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSignupTypeOpen} onOpenChange={setIsSignupTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Who would you like to signup as?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsSignupTypeOpen(false);
                navigate("/signup-employer");
              }}
            >
              Employer
            </Button>
            <Button
              onClick={() => {
                setIsSignupTypeOpen(false);
                navigate("/signup-worker");
              }}
            >
              Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}