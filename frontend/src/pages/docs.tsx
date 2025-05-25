import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { BookOpenIcon, CodeBracketIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Docs() {
  const docSections = [
    {
      icon: BookOpenIcon,
      title: 'Getting Started',
      description: 'Learn the basics of Mini-REAX and how to start bridging assets',
      links: [
        { name: 'Introduction', href: '#' },
        { name: 'Quick Start Guide', href: '#' },
        { name: 'Supported Chains', href: '#' },
      ]
    },
    {
      icon: CodeBracketIcon,
      title: 'Developer Docs',
      description: 'Technical documentation for developers and integrators',
      links: [
        { name: 'Smart Contracts', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'SDK Documentation', href: '#' },
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: 'Security',
      description: 'Security audits, best practices, and safety guidelines',
      links: [
        { name: 'Audit Reports', href: '#' },
        { name: 'Security Best Practices', href: '#' },
        { name: 'Bug Bounty Program', href: '#' },
      ]
    },
  ];

  return (
    <>
      <Head>
        <title>Documentation - Mini-REAX</title>
        <meta name="description" content="Complete documentation for Mini-REAX protocol" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-mx-dark">
        <Header />
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-mx-text mb-4">
                <span className="gradient-text">Documentation</span>
              </h1>
              <p className="text-xl text-mx-text-muted max-w-2xl mx-auto">
                Everything you need to know about Mini-REAX protocol
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {docSections.map((section) => (
                <Card key={section.title} hover>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-mx-purple to-mx-cyan rounded-xl flex items-center justify-center mx-auto mb-4">
                      <section.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-mx-text mb-2">
                      {section.title}
                    </h3>
                    <p className="text-mx-text-muted">
                      {section.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {section.links.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-mx-cyan hover:text-mx-cyan-dark transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-mx-text mb-4">
                  Need Help?
                </h2>
                <p className="text-mx-text-muted mb-6">
                  Join our community for support, updates, and discussions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button>Join Discord</Button>
                  <Button variant="secondary">Contact Support</Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
