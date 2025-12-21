"use client";

import { Star, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Kelah Kay",
    quote: "Got my car painted and it looks like brand new. Thanks to Refinish Pro. This guys are good.",
    rating: 5,
  },
  {
    name: "MAIDORC LTD",
    quote: "My car looks new with no traces of being painted. These guys are genius.",
    rating: 5,
  },
  {
    name: "Nwafor Chibuike Phada",
    quote: "Super perfect paint job on my car. Midnight black style. Perfectly done chrome delete. I will recommend, anytime.",
    rating: 5,
  },
];

const Testimonials = () => {
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
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm">
            Customer Love
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-4 mb-6">
            WHAT OUR <span className="text-gradient-gold">CUSTOMERS SAY</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-lg font-medium">21+ glowing Google reviews from happy drivers in Port Harcourt</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              ref={(el) => addToRefs(el, index)}
              className={`group p-8 rounded-2xl glass-light hover:glass transition-all duration-500 hover:-translate-y-2 relative ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <Quote className="w-12 h-12 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground text-lg mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-display text-xl">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">Happy Customer</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;