'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Years Leadership', value: '8+' },
  { label: 'Teams Built', value: '5+' },
  { label: 'GitHub Stars', value: '550+' },
  { label: 'Talks & Workshops', value: '20+' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-24 sm:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Engineering leader building AI products that ship, scale, and earn
            trust
          </h1>

          <p className="mt-6 text-balance text-lg text-muted-foreground sm:text-xl">
            Principal Software Engineer and Engineering Manager with expertise
            in AWS, Kubernetes, modern data stacks, governance, and
            reliability. Building production AI platforms with measurable
            outcomes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/work"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              See case studies
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/writing"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Read writing
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 grid grid-cols-2 gap-8 border-t border-border/40 pt-12 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
