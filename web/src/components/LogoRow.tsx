'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const companies = [
  { name: 'Elsevier', logo: '/logos/elsevier.svg' },
  { name: 'Scopus', logo: '/logos/scopus.svg' },
  { name: 'Engineering Village', logo: '/logos/engineering-village.svg' },
  { name: 'Zoover', logo: '/logos/zoover.svg' },
  { name: 'Node.js', logo: '/logos/nodejs.svg' },
  { name: 'AWS', logo: '/logos/aws.svg' },
];

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function LogoRow() {
  return (
    <section className="border-b border-border/40 bg-muted/30 py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
            TRUSTED BY LEADING ORGANIZATIONS
          </p>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-center grayscale transition-all hover:grayscale-0"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain opacity-60 transition-opacity hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
