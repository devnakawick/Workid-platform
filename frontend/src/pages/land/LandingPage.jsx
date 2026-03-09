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
import logo from '@/images/logo.jpeg';
import { Menu, X } from "lucide-react";

export default function LandingPage({ onLearnMore }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignupTypeOpen, setIsSignupTypeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLearn = () => {
    if (typeof onLearnMore === "function") {
      onLearnMore();
    } else {
      // Fallback: Scroll to features section
      const featuresSection = document.getElementById('features-section');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 md:px-8 py-4 bg-white shadow-sm sticky top-0 z-[60]">
        <div className="flex items-center">
          <img src={logo} alt="WorkID" className="h-8 md:h-10 w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-semibold">
          <button onClick={handleLearn} className="hover:text-blue-600 transition-colors">
            Home
          </button>
          <button onClick={handleLearn} className="hover:text-blue-600 transition-colors">
            Features
          </button>
          <button onClick={handleLearn} className="hover:text-blue-600 transition-colors">
            How It Works
          </button>
          <button onClick={() => setIsOpen(true)} className="hover:text-blue-600 transition-colors">
            Login
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-blue-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl flex flex-col p-6 gap-4 z-50 animate-in slide-in-from-top duration-200">
            <button onClick={handleLearn} className="text-left font-semibold py-2">Home</button>
            <button onClick={handleLearn} className="text-left font-semibold py-2">Features</button>
            <button onClick={handleLearn} className="text-left font-semibold py-2">How It Works</button>
            <button
              onClick={() => { setIsOpen(true); setIsMobileMenuOpen(false); }}
              className="text-left font-semibold py-2"
            >
              Login
            </button>
            <button
              onClick={() => { setIsOpen(true); setIsMobileMenuOpen(false); }}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-center"
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative text-center py-16 md:py-24 px-6 bg-gradient-to-br from-blue-700 to-blue-500 text-white overflow-hidden">
        <h1 className="text-3xl md:text-5xl font-extrabold max-w-3xl mx-auto leading-tight">
          Empowering Every Worker With Skills, Identity & Better Jobs
        </h1>
        <p className="mt-4 text-blue-100 text-sm md:text-base max-w-xl mx-auto px-4">
          Verify your skills, build your reputation, and access fair job
          opportunities.
        </p>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4 px-8 md:px-0">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-lg hover:bg-blue-50 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            Get Started
          </button>
          <button
            onClick={handleLearn}
            className="border border-white/40 px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="features-section" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-12 text-slate-900">
          Why Workers Choose Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            ["Verified Identity", "Proof-backed profiles that local employers trust instantly."],
            ["Skill Badges", "Showcase your real-world capabilities at a single glance."],
            ["Smart Job Matching", "Stop hunting. Get matched to the right local jobs fast."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-bold text-xl">
                {title[0]}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
              <p className="text-slate-500 mt-4 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHALLENGES VS SOLUTIONS */}
      <section className="bg-slate-100 py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="bg-white/50 p-8 rounded-3xl border border-white scroll-mt-20">
            <h3 className="font-black text-xl mb-6 text-slate-900">Challenges Workers Face</h3>
            <ul className="space-y-4 text-slate-600 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                No verified identity or history
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                Low trust leads to lower wages
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">✕</span>
                Difficulty finding fair, local work
              </li>
            </ul>
          </div>
          <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
            <h3 className="font-black text-xl mb-6">How WorkID Solves It</h3>
            <ul className="space-y-4 font-medium">
              <li className="flex items-start gap-3">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✓</span>
                Secure, verified digital profiles
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✓</span>
                Reputation scores build instant trust
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✓</span>
                Direct access to fair opportunities
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-12 text-slate-900">
          Everything You Need To Grow
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            ["Digital Identity", "Your secure, portable digital resume."],
            ["Reputation Score", "Trust metrics based on real work history."],
            ["Job Matching", "Smart AI that finds the perfect jobs for you."],
            ["Learning Tasks", "Upskill and earn verified badges."],
            ["Wage Transparency", "Fair payment tracking for every gig."],
            ["Profile Badges", "Visual proof of your professional skills."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-100 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-10">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto text-xs md:text-sm font-medium text-slate-600">
          {[
            "Create Profile",
            "Get Verified",
            "Apply for Jobs",
            "Track Work",
            "Build Reputation",
          ].map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {idx + 1}
              </div>
              <span className="leading-tight">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-20 px-6">
        <h2 className="text-2xl md:text-4xl font-black max-w-2xl mx-auto leading-tight">
          Join thousands of workers improving their livelihoods.
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-10 bg-white text-blue-700 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
        >
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="WorkID" className="h-6 w-auto" />
            <span className="font-bold text-slate-900">WorkID</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} WorkID Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-semibold text-slate-400">
            <button className="hover:text-blue-600">Privacy</button>
            <button className="hover:text-blue-600">Terms</button>
          </div>
        </div>
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