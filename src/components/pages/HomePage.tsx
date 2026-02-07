// HPI 1.7-V
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Telescope, Shield, Bell, Users, TrendingUp, Satellite, ArrowRight, Activity, Globe, Radio } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Canonical Data Sources ---
const FEATURES_DATA = [
  {
    icon: Telescope,
    title: 'Real-Time Tracking',
    description: 'Live data feed from NASA NeoWs API displaying current asteroids, velocity, and distance metrics.',
    id: '01'
  },
  {
    icon: Shield,
    title: 'Risk Analysis Engine',
    description: 'Automated categorization by hazard status, diameter, and miss distance with clear risk scoring.',
    id: '02'
  },
  {
    icon: Bell,
    title: 'Alert System',
    description: 'Custom notifications for upcoming close approach events based on your watchlist preferences.',
    id: '03'
  },
  {
    icon: Users,
    title: 'Community Discussions',
    description: 'Engage with researchers and enthusiasts in live threads about specific asteroids and discoveries.',
    id: '04'
  },
  {
    icon: TrendingUp,
    title: 'Trajectory Analysis',
    description: 'Detailed orbital data and approach timelines for comprehensive understanding of NEO paths.',
    id: '05'
  },
  {
    icon: Satellite,
    title: 'Personalized Watchlist',
    description: 'Save and monitor specific asteroids with custom alert parameters tailored to your interests.',
    id: '06'
  }
];

const STATS_DATA = [
  { value: '30,000+', label: 'Tracked Objects' },
  { value: '24/7', label: 'Real-Time Monitoring' },
  { value: '99.9%', label: 'Data Accuracy' }
];

// --- Components ---

const Marquee = ({ text, direction = 1 }: { text: string; direction?: number }) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap py-4 bg-accentcyan text-primary">
      <motion.div
        className="flex gap-8 font-heading text-lg font-bold uppercase tracking-widest"
        animate={{ x: direction * -1000 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="flex items-center gap-4">
            {text} <Activity className="w-4 h-4" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ feature, index }: { feature: typeof FEATURES_DATA[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative border-t border-primary/10 py-12 md:py-16 hover:bg-primary/5 transition-colors duration-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-2 font-heading text-4xl text-primary/20 group-hover:text-accentcyan transition-colors">
          {feature.id}
        </div>
        <div className="md:col-span-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary text-white rounded-full group-hover:bg-accentcyan group-hover:text-primary transition-colors duration-300">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-2xl md:text-3xl text-primary">{feature.title}</h3>
          </div>
        </div>
        <div className="md:col-span-6">
          <p className="font-paragraph text-lg text-primary/70 leading-relaxed max-w-xl">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yHero = useTransform(scrollYProgress, [0, 0.2], ["0%", "20%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-clip selection:bg-accentcyan selection:text-primary">
      <style>{`
        .text-stroke {
          -webkit-text-stroke: 1px rgba(0, 0, 0, 0.2);
          color: transparent;
        }
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
          color: transparent;
        }
      `}</style>
      
      <Header />

      {/* HERO SECTION - Split Layout based on Inspiration */}
      <section className="relative w-full min-h-screen flex flex-col lg:flex-row bg-primary overflow-hidden">
        {/* Left Content Side */}
        <div className="w-full lg:w-1/2 relative z-20 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-accentcyan"></div>
              <span className="text-accentcyan font-heading tracking-widest text-sm uppercase">System Online</span>
            </div>
            
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-8 tracking-tight">
              TRACKING<br />
              <span className="text-accentcyan">THE COSMOS</span>
            </h1>
            
            <p className="font-paragraph text-lg md:text-xl text-white/70 max-w-lg mb-12 leading-relaxed">
              Monitor Near-Earth Objects in real-time with advanced risk analysis and comprehensive trajectory data from space agencies worldwide.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-accentcyan text-primary font-heading text-sm uppercase tracking-wider px-8 py-4 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                  Launch Dashboard <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Image Side */}
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto overflow-hidden">
          <motion.div 
            style={{ y: yHero }}
            className="absolute inset-0 w-full h-[120%]"
          >
            <Image 
              src="https://static.wixstatic.com/media/21621a_532781c3885f4a96a436df8a5453e751~mv2.png?originWidth=1280&originHeight=704"
              alt="Orbital mechanics visualization"
              className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-primary/50 mix-blend-multiply" />
          </motion.div>
          
          {/* Decorative Overlay Elements */}
          <div className="absolute bottom-12 right-12 hidden lg:block">
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, 30, 15, 40, 10] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-accentcyan/50"
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-accentcyan/70">LIVE FEED ACTIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE SEPARATOR */}
      <Marquee text="NEO DETECTION SYSTEM • ORBITAL ANALYSIS • HAZARD ASSESSMENT •" />

      {/* STATS SECTION - Horizontal Scroll / Sticky Hybrid */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="max-w-[120rem] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="lg:col-span-1">
              <h2 className="font-heading text-4xl md:text-5xl mb-6 sticky top-32">
                GLOBAL<br />DATA<br />INTEGRITY
              </h2>
              <p className="font-paragraph text-primary/60 max-w-xs sticky top-80">
                Our platform aggregates and verifies data from multiple space agencies to ensure precision.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {STATS_DATA.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white border border-primary/5 p-12 flex flex-col justify-between aspect-square ${index === 2 ? 'md:col-span-2 md:aspect-[2/1]' : ''} hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group`}
                >
                  <div className="flex justify-between items-start">
                    <Globe className="w-8 h-8 text-primary/20 group-hover:text-accentcyan transition-colors" />
                    <span className="font-mono text-xs text-primary/40">00{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-heading text-6xl md:text-7xl text-primary mb-2 group-hover:translate-x-2 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="font-paragraph text-lg text-primary/60 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Vertical List */}
      <section className="py-32 bg-secondary relative">
        <div className="max-w-[100rem] mx-auto px-8 md:px-16">
          <div className="mb-24 text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-5xl md:text-7xl text-primary mb-6"
            >
              ADVANCED<br />MONITORING
            </motion.h2>
            <div className="w-24 h-2 bg-accentcyan mb-8 md:mx-0 mx-auto" />
            <p className="font-paragraph text-xl text-primary/70 max-w-2xl">
              Comprehensive tools for tracking, analyzing, and understanding Near-Earth Objects with precision.
            </p>
          </div>

          <div className="flex flex-col">
            {FEATURES_DATA.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* IMMERSIVE VISUAL BREAK */}
      <section className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center bg-primary">
        <div className="absolute inset-0">
          <Image 
            src="https://static.wixstatic.com/media/21621a_d79780e9a61d4b6fbaf31693a52d3a2e~mv2.png?originWidth=1920&originHeight=1280"
            alt="Deep space visualization"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary" />
        </div>
        
        <div className="relative z-10 text-center px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Radio className="w-16 h-16 text-accentcyan mx-auto mb-8 animate-pulse" />
            <h2 className="font-heading text-5xl md:text-7xl text-white mb-8">
              THE SKY IS NOT<br />THE LIMIT
            </h2>
            <p className="font-paragraph text-white/80 text-xl max-w-2xl mx-auto">
              Join the global network of watchers ensuring planetary safety through data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION - Minimalist & Bold */}
      <section className="py-32 bg-background px-8 md:px-16">
        <div className="max-w-[100rem] mx-auto bg-primary text-white rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accentcyan/10 skew-x-12 transform translate-x-1/4" />
          
          <div className="relative z-10 p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="flex-1">
              <h2 className="font-heading text-4xl md:text-6xl mb-6">
                BEGIN YOUR<br />COSMIC JOURNEY
              </h2>
              <p className="font-paragraph text-lg text-white/70 max-w-xl mb-10">
                Join researchers and space enthusiasts worldwide in monitoring the celestial objects that pass through our cosmic neighborhood.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-accentcyan text-primary font-heading text-sm uppercase tracking-wider px-10 py-5 rounded-full font-bold hover:bg-white transition-colors"
                  >
                    View Dashboard
                  </motion.button>
                </Link>
                <Link to="/community">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-transparent border border-white/30 text-white font-heading text-sm uppercase tracking-wider px-10 py-5 rounded-full font-bold hover:bg-white hover:text-primary transition-colors"
                  >
                    Join Community
                  </motion.button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block w-64 h-64 relative">
               {/* Abstract geometric decoration */}
               <div className="absolute inset-0 border-2 border-accentcyan/30 rounded-full animate-[spin_10s_linear_infinite]" />
               <div className="absolute inset-4 border border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Satellite className="w-16 h-16 text-accentcyan" />
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}