"use client";

import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const problems = [
  "Your car's paint is fading from the harsh sun and dusty roads here in Port Harcourt",
  "Scratches and dings build up fast, chrome looks tired",
  "The interior traps grime that won't budge no matter how you try",
  "Bad past paint jobs leave traces that embarrass you on the road",
];

const ProblemSolution = () => {
  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problem Side */}
          <div>
            <span className="text-destructive font-medium uppercase tracking-widest text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              The Problem
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-4 mb-8">
              IS YOUR CAR LOSING <span className="text-destructive">ITS SHINE?</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              {problems.map((problem, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                >
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">✕</span>
                  </div>
                  <p className="text-muted-foreground">{problem}</p>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground text-lg italic">
              It makes you hesitate to give lifts to friends. Lowers your ride's value. 
              And those bad past paint jobs leave traces that embarrass you on the road.
            </p>
          </div>

          {/* Solution Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
            <div className="relative glass rounded-3xl p-8 md:p-10">
              <span className="text-primary font-medium uppercase tracking-widest text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                The Solution
              </span>
              <h3 className="font-display text-3xl md:text-4xl mt-4 mb-6">
                WE MAKE YOUR CAR <span className="text-gradient-gold">THE HERO</span>
              </h3>
              
              <p className="text-muted-foreground text-lg mb-8">
                At <span className="text-primary font-semibold">Refinish Pro Cleaning Solutions</span>, 
                our skilled team in Port Harcourt specializes in expert painting, perfect chrome delete, 
                body work, deep cleaning, and detailing.
              </p>

              <p className="text-foreground text-lg font-medium mb-8">
                Customers always love our painting jobs because we deliver flawless results 
                with satisfaction guaranteed.
              </p>

              <Button variant="hero" size="xl">
                Get Your Free Quote
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;