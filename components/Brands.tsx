"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const brands = [
  {
    name: "Lamborghini",
    logo: "https://i0.wp.com/blackoutdetails.com/wp-content/uploads/2015/10/lamborghini.png?fit=77%2C87&ssl=1",
    width: 77,
    height: 87,
  },
  {
    name: "Mercedes-Benz",
    logo: "https://i0.wp.com/blackoutdetails.com/wp-content/uploads/2015/10/mercedes-benz.png?fit=77%2C77&ssl=1",
    width: 77,
    height: 77,
  },
  {
    name: "McLaren",
    logo: "https://i0.wp.com/blackoutdetails.com/wp-content/uploads/2015/10/mclaren-logo.png?fit=77%2C42&ssl=1",
    width: 77,
    height: 42,
  },
  {
    name: "Porsche",
    logo: "https://i0.wp.com/blackoutdetails.com/wp-content/uploads/2023/10/client-01-2.png?fit=104%2C78&ssl=1",
    width: 104,
    height: 78,
  },
  {
    name: "Ferrari",
    logo: "https://i0.wp.com/blackoutdetails.com/wp-content/uploads/2015/10/ferrari.png?fit=77%2C103&ssl=1",
    width: 77,
    height: 103,
  },
  {
    name: "Audi",
    logo: "https://i0.wp.com/blackoutdetails.com/wp-content/uploads/2023/10/client-02.png?fit=77%2C77&ssl=1",
    width: 77,
    height: 77,
  },
];

const Brands = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationId: number;
    let position = 0;
    const speed = 0.5; // pixels per frame (adjust for speed)
    const brandsCount = brands.length;

    const animate = () => {
      if (!isPaused && containerRef.current) {
        position -= speed;
        
        // Reset position when we've scrolled through one set of brands
        const containerWidth = containerRef.current.scrollWidth / 3; // Since we have 3 copies
        if (position <= -containerWidth) {
          position = 0;
        }
        
        containerRef.current.style.transform = `translateX(${position}px)`;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  // Create duplicated array for seamless animation
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-background overflow-hidden" aria-label="Brands we work with">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground text-center">
          Leaders in <span className="text-gradient-gold">Car Protection Film</span> and{" "}
          <span className="text-gradient-gold">Ceramic Coating</span> Services
        </h2>
      </div>

      {/* Brands Marquee */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div 
          ref={containerRef}
          className="flex items-center gap-8 md:gap-16 px-4 md:px-8 will-change-transform"
          aria-live="polite"
        >
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              aria-label={brand.name}
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={brand.width}
                height={brand.height}
                className="h-12 md:h-16 w-auto object-contain"
                loading="lazy"
                unoptimized={true}
              />
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for smooth edges */}
        <div className="absolute top-0 left-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        
        {/* Pause indicator (optional) */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/50 text-white text-xs">
              Paused
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Brands;