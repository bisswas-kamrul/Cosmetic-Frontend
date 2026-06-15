import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareTwitter } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa6";
const Futter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    await fetch("http://localhost:4000/Subscriber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    alert("Subscribed");
  };

  return (
    <>
      <footer className="bg-foreground text-background">
        {/* Newsletter */}
        <div className="border-b border-muted-foreground/20">
          <div className="container mx-auto px-4 lg:px-8 py-12 text-center">
            <h3 className="heading-display text-2xl md:text-3xl font-semibold mb-2">
              Stay Beautiful
            </h3>
            <p className="text-background/70 mb-6 max-w-md mx-auto">
              Subscribe for exclusive offers, beauty tips, and new arrivals.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <Input
                placeholder="Your email address"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleSubscribe}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 cursor-pointer">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h4 className="heading-display text-xl font-bold mb-4">
                BELLE<span className="text-gold">.</span>
              </h4>
              <p className="text-background/60 text-sm leading-relaxed">
                Premium cosmetics crafted with love. Discover your true beauty
                with our curated collections.
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://www.instagram.com/"
                  className="text-background/60 hover:text-background transition-colors">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/"
                  className="text-background/60 hover:text-background transition-colors">
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/"
                  className="text-background/60 hover:text-background transition-colors">
                  <FaSquareTwitter className="h-5 w-5" />
                </a>
                <a
                  href="https://www.mail.com/premiumlogin/"
                  className="text-background/60 hover:text-background transition-colors">
                  <CiMail className="h-5 w-5" />
                </a>
                <a
                  href="https://web.whatsapp.com/"
                  className="text-background/60 hover:text-background transition-colors">
                  <FaWhatsapp className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Shop",
                links: [
                  "Skincare",
                  "Makeup",
                  "Fragrance",
                  "Hair Care",
                  "Body Care",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Careers",
                  "Press",
                  "Sustainability",
                  "Blog",
                ],
              },
              {
                title: "Help",
                links: [
                  "FAQs",
                  "Shipping",
                  "Returns",
                  "Contact Us",
                  "Track Order",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="font-semibold text-sm uppercase tracking-wider mb-4">
                  {col.title}
                </h5>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-background/60 hover:text-background text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/40 text-sm">
            © 2026 BELLE. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Futter;
