"use client";

import { Heart, Mail, Phone, MapPin, Facebook, Youtube, Instagram } from "lucide-react";
import Link from "next/link";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
              <span className="text-xl font-bold tracking-tight text-gray-900">MamaCare</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-6">
              Empowering mothers with comprehensive, compassionate care through every stage of motherhood.
            </p>
            {/* Social Icons */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <span title="Facebook" className="p-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                  <Facebook className="w-5 h-5" />
                </span>
                <span title="X (Twitter)" className="p-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                  <XIcon />
                </span>
                <span title="Instagram" className="p-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                  <Instagram className="w-5 h-5" />
                </span>
                <span title="YouTube" className="p-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                  <Youtube className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Services</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Prenatal Care</Link></li>
              <li><Link href="/postpartum-support" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Postpartum Support</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Lactation Consulting</Link></li>
              <li><Link href="/pediatric-basics" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Pediatric Basics</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="mailto:uwizeyekevin43@gmail.com"
                  className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  uwizeyekevin43@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+250788775937"
                  className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  +250 788 775 937
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4 shrink-0" />
                Rwanda, Kigali City, Remera
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MamaCare. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-pink-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
