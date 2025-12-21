"use client";

import { Facebook, Instagram, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      // If not on homepage, navigate to homepage with hash
      window.location.href = `/${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-charcoal border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
            <Image src="/logo2.png" alt="refinish footer logo" width={100} height={100} />
              <span className="font-display text-3xl text-gradient-gold">REFINISH</span>
              <span className="font-display text-md text-foreground">By PRO CLEANING SOLUTIONS</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Premium auto care, detailing, painting, and body work services in Port Harcourt. 
              Making your car the hero.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-6">QUICK LINKS</h4>
            <ul className="space-y-3">
              {["Home", "Services", "Reviews", "FAQ", "Contact"].map((link) => {
                const href = link === "Home" ? "/" : `#${link.toLowerCase().replace(" ", "-")}`;
                return (
                  <li key={link}>
                    {link === "Home" ? (
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(href)}
                        className="text-muted-foreground hover:text-primary transition-colors text-left"
                      >
                        {link}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-xl mb-6">SERVICES</h4>
            <ul className="space-y-3">
              {[
                "Car Painting",
                "Chrome Delete",
                "Deep Cleaning",
                "Detailing",
                "Body Work",
              ].map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollToSection("#services")}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl mb-6">CONTACT</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>Port Harcourt</li>
              <li>Rivers State, Nigeria</li>
              <li>
                <a href="mailto:info@refinishpro.ng" className="text-primary hover:underline">
                  info@refinishphc.com
                </a>
              </li>
              <li className="text-sm">Serving all of Rivers State</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Refinish By Pro Cleaning Solutions. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground hover:shadow-gold transition-all hover:-translate-y-1"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;