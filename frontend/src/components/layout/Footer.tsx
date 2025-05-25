import Link from 'next/link';
import { FaTwitter, FaGithub, FaDiscord, FaTelegram } from 'react-icons/fa';
import React from 'react';

export default function Footer() {
  const socialLinks = [
  { name: 'Twitter', href: '#', icon: FaTwitter },
  { name: 'GitHub', href: '#', icon: FaGithub },
  { name: 'Discord', href: '#', icon: FaDiscord },
  { name: 'Telegram', href: '#', icon: FaTelegram },
];
  const footerLinks = {
    Product: [
      { name: 'Bridge', href: '/bridge' },
      { name: 'Ecosystem', href: '/ecosystem' },
      { name: 'Documentation', href: '/docs' },
    ],
    Community: [
      { name: 'Discord', href: '#' },
      { name: 'Twitter', href: '#' },
      { name: 'Telegram', href: '#' },
    ],
    Resources: [
      { name: 'Whitepaper', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Audit Reports', href: '#' },
    ],
  };

  return (
    <footer className="bg-mx-dark border-t border-mx-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-mx-purple to-mx-cyan rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MR</span>
              </div>
              <span className="text-xl font-bold gradient-text">Mini-REAX</span>
            </div>
            <p className="text-mx-text-muted text-sm mb-4">
              The future of cross-chain DeFi. Secure, fast, and decentralized synthetic asset trading.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-mx-text-muted hover:text-mx-cyan transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-mx-text font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-mx-text-muted hover:text-mx-cyan transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-mx-surface mt-8 pt-8 text-center">
          <p className="text-mx-text-muted text-sm">
            © 2024 Mini-REAX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
