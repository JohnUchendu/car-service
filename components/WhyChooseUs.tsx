"use client";

import { Shield, Clock, Award, ThumbsUp, Sparkles, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Satisfaction Guaranteed",
    description: "We fix it free until you're thrilled with your brand-new look. No traces, no excuses.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Painting 3-7 days, detailing 1-2 days. We keep you updated and work fast without rushing quality.",
  },
  {
    icon: Award,
    title: "Expert Team",
    description: "Our skilled technicians specialize in flawless painting and perfect chrome delete finishes.",
  },
  {
    icon: ThumbsUp,
    title: "21+ Happy Reviews",
    description: "Glowing Google reviews from happy drivers across Port Harcourt. See what customers say.",
  },
  {
    icon: Sparkles,
    title: "Oven-Baked Finish",
    description: "Factory-quality oven-baked painting that erases fades and scratches completely.",
  },
  {
    icon: MapPin,
    title: "Port Harcourt Based",
    description: "Serving all of Rivers State with mobile detailing options available.",
  },
];

const WhyChooseUs = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);
    
    // Add staggered animation for cards
    const timeout = setTimeout(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          card.style.animationDelay = `${index * 0.1}s`;
          card.classList.add("animate-fade-in");
        }
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    cardsRef.current[index] = el;
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm">
            Why Choose Us
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-4 mb-6">
            THE <span className="text-gradient-gold">REFINISH PRO</span> DIFFERENCE
          </h2>
          <p className="text-muted-foreground text-lg">
            We don't just service cars—we make them heroes. Here's why car owners 
            across Port Harcourt trust us with their vehicles.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => addToRefs(el, index)}
              className={`group p-8 rounded-2xl glass-light hover:glass transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6 shadow-gold">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              <h3 className="font-display text-2xl mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;