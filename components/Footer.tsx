"use client";

import { Heart, Mail, Phone, MapPin, Facebook, Youtube, Instagram, Send } from "lucide-react";
import Link from "next/link";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 via-slate-100/30 to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      {/* Decorative Blur Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100/30 dark:bg-pink-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100/20 dark:bg-indigo-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <div className="flex items-center gap-2.5 mb-4 group cursor-pointer">
              <div className="p-1.5 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-500 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                MamaCare
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mb-6 max-w-md">
              Empowering mothers with comprehensive, compassionate, and expert care through every beautiful stage of motherhood.
            </p>
            {/* Social Icons */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 mb-3.5">
                Connect With Us
              </p>
              <div className="flex gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="X (Twitter)"
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <XIcon />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="#"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  Prenatal Care
                </Link>
              </li>
              <li>
                <Link
                  href="/postpartum-support"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  Postpartum Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  Lactation Consulting
                </Link>
              </li>
              <li>
                <Link
                  href="/pediatric-basics"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  Pediatric Basics
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group flex items-center text-sm text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-pink-500 transition-colors mr-2 shrink-0" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:uwizeyekevin43@gmail.com"
                  className="flex items-center gap-2.5 text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-colors group"
                >
                  <Mail className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-pink-500 dark:text-slate-500 dark:group-hover:text-pink-400 transition-colors" />
                  <span className="truncate">uwizeyekevin43@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+250788775937"
                  className="flex items-center gap-2.5 text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-colors group"
                >
                  <Phone className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-pink-500 dark:text-slate-500 dark:group-hover:text-pink-400 transition-colors" />
                  <span>+250 788 775 937</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
                <span>Rwanda, Kigali City, Remera</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} MamaCare. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-400 dark:text-slate-500">
            <Link href="#" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
