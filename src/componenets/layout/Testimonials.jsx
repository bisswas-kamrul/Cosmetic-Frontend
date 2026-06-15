import React from 'react'
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "The Rose Petal Serum transformed my skin in just 2 weeks. I've never received so many compliments!",
    rating: 5,
    product: "Rose Petal Serum",
  },
  {
    name: "Emily R.",
    text: "Finally found a foundation that matches perfectly and lasts all day. Absolutely obsessed with BELLE!",
    rating: 5,
    product: "Silk Foundation",
  },
  {
    name: "Jessica L.",
    text: "The packaging is gorgeous and the products are even better. This is luxury beauty done right.",
    rating: 5,
    product: "Golden Hour Perfume",
  },
];
const Testimonials = () => {
  return (
    <>
     <section className="py-20 bg-rose-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold uppercase tracking-[0.2em] text-sm font-medium">Testimonials</span>
          <h2 className="heading-display text-3xl md:text-5xl font-bold mt-2 text-foreground">
            Loved by Thousands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card rounded-xl p-6 shadow-sm"
            >
              <Quote className="h-8 w-8 text-gold mb-4 opacity-40" />
              <p className="text-foreground/80 leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">Verified • {t.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}

export default Testimonials