"use client";

import { Paintbrush, Sparkles, Droplets, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: Paintbrush,
    title: "Car Painting",
    headline: "Get That Brand New Look Without Traces of Old Paint",
    description: "Our satisfactory painting erases fades and scratches completely. Your car comes out looking like it just rolled off the lot—no traces left behind.",
    image: "/service-painting.jpg",
    features: ["Factory Finish", "No Traces", "Color Matching"],
  },
  {
    icon: Sparkles,
    title: "Chrome Delete",
    headline: "Achieve Perfect Chrome Delete for a Sleek Style",
    description: "Tired of shiny chrome? We expertly dechrome for a modern, midnight black look that stands out perfectly on Port Harcourt roads.",
    image: "/service-detailing.jpg",
    features: ["Midnight Black", "Modern Look", "Premium Finish"],
  },
  {
    icon: Droplets,
    title: "Deep Cleaning & Detailing",
    headline: "Enjoy Spotless Deep Cleaning and Detailing Inside Out",
    description: "Grime and dust vanish with our thorough detailing. Your interior feels fresh, making every drive comfortable and effortless.",
    image: "/service-cleaning.jpg",
    features: ["Interior Revival", "Exterior Shine", "Odor Removal"],
  },
  {
    icon: Wrench,
    title: "Body Work",
    headline: "Professional Body Work & Repairs",
    description: "From dents to collision damage, our experts restore your vehicle's body to perfect condition with precision craftsmanship.",
    image: "/service-bodywork.jpg",
    features: ["Dent Removal", "Panel Repair", "Collision Repair"],
  },
];

const Services = () => {
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
    <section id="services" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm">
            What We Offer
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-4 mb-6">
            OUR <span className="text-gradient-gold">SERVICES</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Expert painting, chrome delete, body work, deep cleaning, and detailing 
            that transforms your vehicle in Port Harcourt.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => addToRefs(el, index)}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image || "/placeholder.jpg"}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold z-10">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="font-display text-2xl mb-2 text-primary">
                  {service.title}
                </h3>
                <h4 className="font-display text-xl mb-3 group-hover:text-primary transition-colors">
                  {service.headline}
                </h4>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:bg-transparent">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;