"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

const Hero = () => {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Add animation classes after component mounts
    const timeout = setTimeout(() => {
      elementsRef.current.forEach((element) => {
        if (element) {
          element.classList.remove("opacity-0");
        }
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const addToRefs = (el: HTMLElement | null, index: number) => {
    elementsRef.current[index] = el;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-car.jpg" // Image from public folder
          alt="Professional car detailing and painting service in Port Harcourt"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            ref={(el) => addToRefs(el, 0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 opacity-0 animate-fade-in"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Port Harcourt's Premier Auto Care
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={(el) => addToRefs(el, 1)}
            className="font-display text-5xl md:text-6xl lg:text-7xl leading-none mb-6 opacity-0 animate-fade-in"
          >
            <span className="text-foreground">MAKE YOUR CAR</span>
            <br />
            <span className="text-gradient-gold">LOOK BRAND NEW</span>
            <br />
            <span className="text-foreground">AGAIN</span>
          </h1>

          {/* Subheadline */}
          <p
            ref={(el) => addToRefs(el, 2)}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 opacity-0 animate-fade-in"
          >
            You deserve to drive a car that turns heads and feels fresh every day.
            We'll restore that showroom shine so you feel proud pulling up anywhere in Rivers State.
          </p>

          {/* CTA Buttons */}
          <div
            ref={(el) => addToRefs(el, 3)}
            className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in"
          >
            <Button variant="hero" size="xl">
              Get Your Free Quote Today
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" className="border-primary text-primary hover:bg-primary/10">
              View Our Work
            </Button>
          </div>

          {/* Stats */}
          <div
            ref={(el) => addToRefs(el, 4)}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50 opacity-0 animate-fade-in"
          >
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary">21+</div>
              <div className="text-sm text-muted-foreground mt-1">Google Reviews</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary">PH</div>
              <div className="text-sm text-muted-foreground mt-1">Rivers State</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={(el) => addToRefs(el, 5)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};

export default Hero;