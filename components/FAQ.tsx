"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does a full service take?",
    answer: "Painting and major work usually 3-7 days, detailing 1-2 days. We keep you updated and work fast without rushing quality.",
  },
  {
    question: "Where do you serve?",
    answer: "We cover all of Port Harcourt and Rivers State. Mobile options available for detailing.",
  },
  {
    question: "What if I'm not satisfied?",
    answer: "Satisfaction guaranteed—we fix it free until you're thrilled with your brand-new look.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-medium uppercase tracking-widest text-sm">
              Got Questions?
            </span>
            <h2 className="font-display text-5xl md:text-6xl mt-4 mb-6">
              FREQUENTLY <span className="text-gradient-gold">ASKED</span>
            </h2>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="font-display text-xl hover:text-primary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;