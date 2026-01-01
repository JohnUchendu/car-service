// "use client";

// import { useState, useEffect } from "react";
// import { Menu, X, Phone } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";

// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Smooth scroll function for in-page anchors
//   const scrollToSection = (id: string) => {
//     if (pathname !== "/") {
//       // If not on homepage, navigate to homepage with hash
//       window.location.href = `/${id}`;
//       return;
//     }
    
//     const element = document.getElementById(id.replace("#", ""));
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//       setIsMobileMenuOpen(false);
//     }
//   };

//   const navLinks = [
//     { href: "#services", label: "Services" },
//     { href: "#testimonials", label: "Reviews" },
//     { href: "#faq", label: "FAQ" },
//     { href: "#contact", label: "Contact" },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         isScrolled ? "glass py-4" : "bg-transparent py-6"
//       }`}
//     >
//       <div className="container mx-auto px-4 flex items-center justify-between">
//         <Link href="/" className="flex items-center gap-2">
//         <Image src={"/logo2.png"} alt="refinish logo" width={100} height={100}/>
         
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-8">
//           {navLinks.map((link) => (
//             <button
//               key={link.href}
//               onClick={() => scrollToSection(link.href)}
//               className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 uppercase tracking-wider"
//             >
//               {link.label}
//             </button>
//           ))}
//           <Button variant="hero" size="lg">
//             <Phone className="w-4 h-4" />
//             Book Now
//           </Button>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-foreground p-2"
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           aria-label="Toggle mobile menu"
//         >
//           {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden glass mt-4 mx-4 rounded-lg p-6 animate-fade-in">
//           <div className="flex flex-col gap-4">
//             {navLinks.map((link) => (
//               <button
//                 key={link.href}
//                 onClick={() => scrollToSection(link.href)}
//                 className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2 text-left"
//               >
//                 {link.label}
//               </button>
//             ))}
//             <Button variant="hero" size="lg" className="mt-4">
//               <Phone className="w-4 h-4" />
//               Book Now
//             </Button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Calendar, Phone, ChevronDown, User, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const adminLinks = [
    {
      name: "Login",
      href: "https://www.sanity.io/login?type=token&origin=https%3A%2F%2Fwww.sanity.io%2Fapi%2Fdashboard%2Fauthenticate%3FredirectTo%3D%252Fentry",
      icon: LogIn,
      description: "",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Email",
      href: "https://accounts.zoho.com/signin?servicename=VirtualOffice&signupurl=https://www.zoho.com/mail/zohomail-pricing.html&serviceurl=https://mail.zoho.com",
      icon: Mail,
      description: "",
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      window.location.href = `/${id}`;
      return;
    }
    
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/logo2.png"} alt="refinish logo" width={100} height={100}/>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 uppercase tracking-wider"
            >
              {link.label}
            </button>
          ))}
          
          {/* Admin Dropdown */}
          <div className="relative" ref={adminDropdownRef}>
            <button
              onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
              aria-expanded={isAdminDropdownOpen}
              aria-label="Admin menu"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isAdminDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-border shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <div className="px-3 py-2 mb-2">
                    <p className="text-xs font-medium text-muted-foreground">Admin Tools</p>
                  </div>
                  
                  <div className="space-y-1">
                    {adminLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <div className={`w-8 h-8 rounded-lg ${link.bgColor} flex items-center justify-center group-hover:opacity-90 transition-colors`}>
                            <Icon className={`w-4 h-4 ${link.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{link.name}</p>
                            <p className="text-xs text-muted-foreground">{link.description}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/50">
                    <div className="px-3 py-2">
                      <p className="text-xs text-muted-foreground">
                        Secure admin portals for managing content and email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link href="/booking">
          <Button variant="hero" size="lg">
            <Calendar className="w-4 h-4" />
            Book Now
          </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass mt-4 mx-4 rounded-lg p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2 text-left"
              >
                {link.label}
              </button>
            ))}
            
            {/* Admin Links in Mobile Menu */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-3">Admin Tools</p>
              <div className="space-y-2">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className={`w-10 h-10 rounded-lg ${link.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${link.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{link.name}</p>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
            
            <Link href="/booking">
            <Button variant="hero" size="lg" className="mt-4">
              <Calendar className="w-4 h-4" />
              Book Now
            </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;