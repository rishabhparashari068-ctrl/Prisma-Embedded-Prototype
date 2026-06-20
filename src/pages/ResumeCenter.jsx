import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, UploadCloud, Zap,
  Layout, Palette, Download, Eye, Wand2, BarChart3, Target, Rocket, MapPin,
  Check, Flame, Diamond, BrainCircuit, ScanLine, Activity, BookOpen, Trophy,
  Star, GitBranch, Code2, Cpu, FolderGit2, TrendingUp, Fingerprint, Crown, Globe, Terminal,
  ChevronRight, X, Minus, Plus, Flame as FireIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   3D TILT CARD
   ═══════════════════════════════════════════════════════════════ */
const TiltCard = ({ children, className = '', intensity = 12 }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className} style={style}>
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════ */
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated) {
        setAnimated(true);
        const start = performance.now();
        const dur = 1500;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, animated]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
};

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS BACKGROUND
   ═══════════════════════════════════════════════════════════════ */
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let animId, particles = [];

    const resize = () => {
      cvs.width = cvs.offsetWidth * 2;
      cvs.height = cvs.offsetHeight * 2;
    };
    const init = () => {
      particles = [];
      const n = Math.floor((cvs.offsetWidth * cvs.offsetHeight) / 12000);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * cvs.width,
          y: Math.random() * cvs.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5,
          o: Math.random() * 0.4 + 0.1
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cvs.width) p.vx *= -1;
        if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.o})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x, dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.5 }} />;
};

/* ═══════════════════════════════════════════════════════════════
   HEXAGON SKILL BADGE
   ═══════════════════════════════════════════════════════════════ */
const HexBadge = ({ skill, level, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
    whileHover={{ scale: 1.15, rotate: 5 }}
    className="relative w-[72px] h-[80px] flex items-center justify-center cursor-pointer group"
  >
    <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-md">
      <polygon points="50,3 95,28 95,87 50,112 5,87 5,28"
        className="fill-white stroke-indigo-200 stroke-[1.5] group-hover:stroke-indigo-400 transition-colors"
      />
      <polygon points="50,3 95,28 95,87 50,112 5,87 5,28"
        className="fill-indigo-50/0 group-hover:fill-indigo-50 transition-colors"
      />
    </svg>
    <div className="relative z-10 text-center pt-1">
      <div className="text-[9px] font-bold text-slate-700 leading-tight">{skill}</div>
      <div className="text-[10px] font-black text-indigo-500 mt-0.5">{level}%</div>
    </div>
  </motion.div>
);

const CONFETTI_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: ((i * 37) % 100 - 50) * 6,
  y: ((i * 53) % 100 - 65) * 6,
  rotate: ((i * 97) % 360) * 3
}));

/* ═══════════════════════════════════════════════════════════════
   CONFETTI OVERLAY
   ═══════════════════════════════════════════════════════════════ */
const Confetti = ({ active }) => (
  <AnimatePresence>
    {active && (
      <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
        {CONFETTI_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: particle.x,
              y: particle.y,
              scale: [1, 1.2, 0],
              rotate: particle.rotate
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute w-2.5 h-2.5 rounded-sm"
            style={{
              backgroundColor: ['#6366f1','#a855f7','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899'][i % 7],
              left: '50%', top: '45%'
            }}
          />
        ))}
      </div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const TEMPLATE_THEMES = {
  modern: { header: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white', name: 'text-white', role: 'text-white/80', meta: 'text-white/60', accent: 'from-indigo-400 to-purple-400', footer: 'from-slate-50 to-indigo-50/30', chip: 'bg-indigo-50 text-indigo-700', section: 'text-indigo-400' },
  minimal: { header: 'bg-white border-b border-slate-100', name: 'text-slate-900', role: 'text-indigo-600', meta: 'text-slate-400', accent: 'from-slate-500 to-slate-800', footer: 'from-slate-50 to-white', chip: 'bg-slate-100 text-slate-600', section: 'text-slate-300' },
  technical: { header: 'bg-slate-950 text-white', name: 'text-white', role: 'text-cyan-200', meta: 'text-slate-400', accent: 'from-cyan-400 to-blue-500', footer: 'from-slate-950 to-slate-900', chip: 'bg-slate-900 text-cyan-200', section: 'text-cyan-500' },
  executive: { header: 'bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white', name: 'text-white', role: 'text-amber-200', meta: 'text-amber-100/70', accent: 'from-amber-400 to-orange-500', footer: 'from-amber-50 to-white', chip: 'bg-amber-50 text-amber-700', section: 'text-amber-500' },
  creative: { header: 'bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 text-white', name: 'text-white', role: 'text-white/85', meta: 'text-white/70', accent: 'from-rose-400 to-orange-400', footer: 'from-rose-50 to-orange-50', chip: 'bg-rose-50 text-rose-700', section: 'text-rose-400' },
  product: { header: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white', name: 'text-white', role: 'text-emerald-100', meta: 'text-emerald-100/70', accent: 'from-emerald-400 to-teal-400', footer: 'from-emerald-50 to-teal-50', chip: 'bg-emerald-50 text-emerald-700', section: 'text-emerald-400' },
  academic: { header: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white', name: 'text-white', role: 'text-blue-200', meta: 'text-blue-100/70', accent: 'from-blue-400 to-indigo-500', footer: 'from-blue-50 to-indigo-50', chip: 'bg-blue-50 text-blue-700', section: 'text-blue-400' },
  startup: { header: 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 text-white', name: 'text-white', role: 'text-white/85', meta: 'text-white/65', accent: 'from-violet-400 to-cyan-400', footer: 'from-violet-50 to-cyan-50', chip: 'bg-violet-50 text-violet-700', section: 'text-violet-400' }
};

const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern Impact', desc: 'Gradient hero', colors: 'from-indigo-500 to-purple-600', theme: 'modern' },
  { id: 'minimal', name: 'Minimal Pro', desc: 'Clean whitespace', colors: 'from-slate-700 to-slate-900', theme: 'minimal' },
  { id: 'technical', name: 'Technical Core', desc: 'Dark systems', colors: 'from-slate-900 to-black', theme: 'technical' },
  { id: 'ats-classic', name: 'ATS Classic', desc: 'Parser-first', colors: 'from-slate-500 to-slate-800', theme: 'minimal' },
  { id: 'software-engineer', name: 'Software Engineer', desc: 'Code focused', colors: 'from-cyan-500 to-blue-700', theme: 'technical' },
  { id: 'full-stack', name: 'Full Stack', desc: 'Product + code', colors: 'from-indigo-500 to-cyan-500', theme: 'modern' },
  { id: 'frontend', name: 'Frontend Craft', desc: 'UI polish', colors: 'from-pink-500 to-rose-500', theme: 'creative' },
  { id: 'backend', name: 'Backend Scale', desc: 'Systems depth', colors: 'from-slate-800 to-emerald-700', theme: 'technical' },
  { id: 'embedded', name: 'Embedded Systems', desc: 'Hardware proof', colors: 'from-amber-600 to-slate-900', theme: 'executive' },
  { id: 'iot', name: 'IoT Builder', desc: 'Connected devices', colors: 'from-cyan-500 to-emerald-500', theme: 'product' },
  { id: 'ai-ml', name: 'AI/ML Research', desc: 'Models + papers', colors: 'from-violet-600 to-blue-600', theme: 'academic' },
  { id: 'data-science', name: 'Data Science', desc: 'Metrics heavy', colors: 'from-blue-500 to-teal-500', theme: 'product' },
  { id: 'cybersecurity', name: 'Cybersecurity', desc: 'Threat ready', colors: 'from-red-600 to-slate-950', theme: 'technical' },
  { id: 'cloud-devops', name: 'Cloud DevOps', desc: 'Infra + CI/CD', colors: 'from-sky-500 to-indigo-700', theme: 'technical' },
  { id: 'mobile-dev', name: 'Mobile Developer', desc: 'Apps shipped', colors: 'from-emerald-500 to-cyan-500', theme: 'product' },
  { id: 'game-dev', name: 'Game Developer', desc: 'Interactive work', colors: 'from-purple-600 to-fuchsia-500', theme: 'startup' },
  { id: 'ui-ux', name: 'UI/UX Designer', desc: 'Portfolio led', colors: 'from-rose-500 to-orange-400', theme: 'creative' },
  { id: 'product-manager', name: 'Product Manager', desc: 'Outcome driven', colors: 'from-emerald-600 to-teal-500', theme: 'product' },
  { id: 'business-analyst', name: 'Business Analyst', desc: 'Insights clear', colors: 'from-blue-600 to-slate-700', theme: 'academic' },
  { id: 'marketing', name: 'Growth Marketing', desc: 'Campaign wins', colors: 'from-orange-500 to-pink-500', theme: 'creative' },
  { id: 'sales', name: 'Sales Executive', desc: 'Revenue proof', colors: 'from-amber-500 to-red-500', theme: 'executive' },
  { id: 'finance', name: 'Finance Analyst', desc: 'Numbers sharp', colors: 'from-emerald-700 to-slate-900', theme: 'executive' },
  { id: 'hr', name: 'HR Recruiter', desc: 'People ops', colors: 'from-purple-500 to-indigo-500', theme: 'modern' },
  { id: 'operations', name: 'Operations Lead', desc: 'Process wins', colors: 'from-slate-600 to-blue-700', theme: 'executive' },
  { id: 'consulting', name: 'Consulting Case', desc: 'Boardroom fit', colors: 'from-stone-700 to-amber-700', theme: 'executive' },
  { id: 'mba', name: 'MBA Candidate', desc: 'Leadership arc', colors: 'from-indigo-700 to-amber-600', theme: 'executive' },
  { id: 'fresher', name: 'Fresher Launch', desc: 'Entry level', colors: 'from-cyan-400 to-indigo-500', theme: 'modern' },
  { id: 'internship', name: 'Internship Ready', desc: 'Student proof', colors: 'from-emerald-400 to-blue-500', theme: 'product' },
  { id: 'campus', name: 'Campus Placement', desc: 'ATS balanced', colors: 'from-indigo-500 to-slate-700', theme: 'modern' },
  { id: 'research', name: 'Research Scholar', desc: 'Publications', colors: 'from-blue-800 to-indigo-950', theme: 'academic' },
  { id: 'teacher', name: 'Teacher Profile', desc: 'Academic clean', colors: 'from-sky-500 to-blue-700', theme: 'academic' },
  { id: 'medical', name: 'Healthcare Pro', desc: 'Trust first', colors: 'from-teal-500 to-emerald-700', theme: 'product' },
  { id: 'legal', name: 'Legal Counsel', desc: 'Formal tone', colors: 'from-slate-800 to-stone-700', theme: 'executive' },
  { id: 'architect', name: 'Architect Studio', desc: 'Structured visual', colors: 'from-stone-500 to-slate-800', theme: 'minimal' },
  { id: 'civil', name: 'Civil Engineer', desc: 'Project sites', colors: 'from-amber-600 to-orange-700', theme: 'executive' },
  { id: 'mechanical', name: 'Mechanical CAD', desc: 'Design + shop', colors: 'from-zinc-600 to-blue-800', theme: 'technical' },
  { id: 'electrical', name: 'Electrical Power', desc: 'Circuits + grids', colors: 'from-yellow-500 to-slate-900', theme: 'technical' },
  { id: 'robotics', name: 'Robotics Lab', desc: 'Automation', colors: 'from-cyan-500 to-violet-600', theme: 'startup' },
  { id: 'qa', name: 'QA Automation', desc: 'Test coverage', colors: 'from-lime-500 to-emerald-700', theme: 'product' },
  { id: 'scrum-master', name: 'Scrum Master', desc: 'Agile delivery', colors: 'from-purple-500 to-blue-500', theme: 'modern' },
  { id: 'content-writer', name: 'Content Writer', desc: 'Editorial clean', colors: 'from-rose-400 to-violet-500', theme: 'creative' },
  { id: 'graphic-designer', name: 'Graphic Designer', desc: 'Visual flair', colors: 'from-fuchsia-500 to-orange-400', theme: 'creative' },
  { id: 'video-editor', name: 'Video Editor', desc: 'Media portfolio', colors: 'from-red-500 to-purple-600', theme: 'creative' },
  { id: 'founder', name: 'Founder Story', desc: 'Vision + traction', colors: 'from-violet-600 to-cyan-500', theme: 'startup' },
  { id: 'freelancer', name: 'Freelancer Pitch', desc: 'Client wins', colors: 'from-teal-500 to-indigo-500', theme: 'startup' },
  { id: 'remote-work', name: 'Remote Ready', desc: 'Async proof', colors: 'from-sky-500 to-violet-500', theme: 'modern' },
  { id: 'international', name: 'International CV', desc: 'Global format', colors: 'from-blue-600 to-emerald-500', theme: 'academic' },
  { id: 'one-page', name: 'One Page Sharp', desc: 'Compact scan', colors: 'from-slate-700 to-indigo-700', theme: 'minimal' },
  { id: 'two-column', name: 'Two Column Pro', desc: 'Dense layout', colors: 'from-indigo-600 to-slate-800', theme: 'modern' },
  { id: 'premium-gold', name: 'Premium Gold', desc: 'Executive shine', colors: 'from-amber-400 to-slate-950', theme: 'executive' }
];

const LAYOUT_PATTERNS = {
  stack: {
    headerAlign: 'text-left',
    body: 'p-6 space-y-5 text-left',
    skills: 'flex flex-wrap gap-1.5',
    projects: 'space-y-3',
    strengths: 'space-y-2',
    footer: 'flex items-center justify-between'
  },
  centered: {
    headerAlign: 'text-center',
    body: 'p-6 space-y-5 text-center',
    skills: 'flex flex-wrap justify-center gap-1.5',
    projects: 'space-y-3 text-left',
    strengths: 'mx-auto max-w-sm space-y-2 text-left',
    footer: 'flex items-center justify-center gap-4'
  },
  split: {
    headerAlign: 'text-left',
    body: 'grid gap-5 p-6 text-left sm:grid-cols-[0.85fr_1.15fr]',
    skills: 'flex flex-wrap gap-1.5',
    projects: 'space-y-3',
    strengths: 'space-y-2',
    footer: 'flex items-center justify-between'
  },
  compact: {
    headerAlign: 'text-left',
    body: 'p-5 space-y-3 text-left',
    skills: 'flex flex-wrap gap-1',
    projects: 'space-y-2',
    strengths: 'space-y-1.5',
    footer: 'flex items-center justify-between'
  },
  sidebar: {
    headerAlign: 'text-left',
    body: 'grid gap-5 p-6 text-left sm:grid-cols-[0.7fr_1.3fr]',
    skills: 'grid grid-cols-1 gap-1.5',
    projects: 'space-y-3',
    strengths: 'space-y-2',
    footer: 'flex items-center justify-between'
  },
  portfolio: {
    headerAlign: 'text-left',
    body: 'p-6 space-y-5 text-left',
    skills: 'grid grid-cols-2 gap-1.5',
    projects: 'grid gap-3',
    strengths: 'grid gap-2',
    footer: 'flex items-center justify-between'
  }
};

const RESUME_LAYOUTS = [
  { id: 'classic-stack', name: 'Classic Stack', desc: 'Standard sections', icon: Layout, pattern: 'stack' },
  { id: 'centered-intro', name: 'Centered Intro', desc: 'Balanced header', icon: Target, pattern: 'centered' },
  { id: 'two-column-core', name: 'Two Column Core', desc: 'Skills + projects', icon: Layout, pattern: 'split' },
  { id: 'compact-one-page', name: 'Compact One Page', desc: 'Tight spacing', icon: Minus, pattern: 'compact' },
  { id: 'left-sidebar', name: 'Left Sidebar', desc: 'Skill rail', icon: Terminal, pattern: 'sidebar' },
  { id: 'portfolio-grid', name: 'Portfolio Grid', desc: 'Project blocks', icon: FolderGit2, pattern: 'portfolio' },
  { id: 'ats-linear', name: 'ATS Linear', desc: 'Parser safe', icon: ScanLine, pattern: 'stack' },
  { id: 'executive-brief', name: 'Executive Brief', desc: 'Leadership scan', icon: Crown, pattern: 'compact' },
  { id: 'developer-dense', name: 'Developer Dense', desc: 'Code heavy', icon: Code2, pattern: 'split' },
  { id: 'academic-cv', name: 'Academic CV', desc: 'Research flow', icon: BookOpen, pattern: 'stack' },
  { id: 'student-proof', name: 'Student Proof', desc: 'Projects first', icon: Rocket, pattern: 'portfolio' },
  { id: 'internship-scan', name: 'Internship Scan', desc: 'Fast review', icon: Sparkles, pattern: 'compact' },
  { id: 'founder-pitch', name: 'Founder Pitch', desc: 'Traction style', icon: Flame, pattern: 'centered' },
  { id: 'freelance-proposal', name: 'Freelance Proposal', desc: 'Client friendly', icon: Diamond, pattern: 'portfolio' },
  { id: 'remote-profile', name: 'Remote Profile', desc: 'Async readable', icon: Globe, pattern: 'stack' },
  { id: 'startup-snapshot', name: 'Startup Snapshot', desc: 'Punchy blocks', icon: Zap, pattern: 'portfolio' },
  { id: 'enterprise-formal', name: 'Enterprise Formal', desc: 'Corporate clean', icon: ShieldCheck, pattern: 'stack' },
  { id: 'recruiter-skim', name: 'Recruiter Skim', desc: 'Top highlights', icon: Eye, pattern: 'compact' },
  { id: 'skills-first', name: 'Skills First', desc: 'Arsenal lead', icon: Target, pattern: 'sidebar' },
  { id: 'projects-first', name: 'Projects First', desc: 'Proof lead', icon: Rocket, pattern: 'portfolio' },
  { id: 'metrics-first', name: 'Metrics First', desc: 'Numbers pop', icon: BarChart3, pattern: 'split' },
  { id: 'minimal-sheet', name: 'Minimal Sheet', desc: 'Whitespace', icon: Minus, pattern: 'stack' },
  { id: 'bold-header', name: 'Bold Header', desc: 'Strong intro', icon: Crown, pattern: 'centered' },
  { id: 'timeline-lite', name: 'Timeline Lite', desc: 'Story flow', icon: GitBranch, pattern: 'stack' },
  { id: 'certification-led', name: 'Certification Led', desc: 'Credentials', icon: Trophy, pattern: 'sidebar' },
  { id: 'social-proof', name: 'Social Proof', desc: 'Links + proof', icon: Star, pattern: 'portfolio' },
  { id: 'hardware-lab', name: 'Hardware Lab', desc: 'Embedded work', icon: Cpu, pattern: 'split' },
  { id: 'cloud-console', name: 'Cloud Console', desc: 'Infra readable', icon: Terminal, pattern: 'compact' },
  { id: 'security-report', name: 'Security Report', desc: 'Audit style', icon: Fingerprint, pattern: 'sidebar' },
  { id: 'data-dashboard', name: 'Data Dashboard', desc: 'Analyst layout', icon: Activity, pattern: 'split' },
  { id: 'design-showcase', name: 'Design Showcase', desc: 'Visual rhythm', icon: Palette, pattern: 'portfolio' },
  { id: 'product-case', name: 'Product Case', desc: 'Outcome blocks', icon: BrainCircuit, pattern: 'split' },
  { id: 'sales-scorecard', name: 'Sales Scorecard', desc: 'Quota wins', icon: TrendingUp, pattern: 'compact' },
  { id: 'finance-ledger', name: 'Finance Ledger', desc: 'Precise rows', icon: BarChart3, pattern: 'stack' },
  { id: 'operations-map', name: 'Operations Map', desc: 'Process detail', icon: MapPin, pattern: 'split' },
  { id: 'consulting-memo', name: 'Consulting Memo', desc: 'Case ready', icon: BookOpen, pattern: 'stack' },
  { id: 'legal-clean', name: 'Legal Clean', desc: 'Formal blocks', icon: ShieldCheck, pattern: 'stack' },
  { id: 'medical-record', name: 'Medical Record', desc: 'Trust layout', icon: CheckCircle2, pattern: 'sidebar' },
  { id: 'teacher-plan', name: 'Teacher Plan', desc: 'Learning flow', icon: BookOpen, pattern: 'centered' },
  { id: 'research-index', name: 'Research Index', desc: 'Publication fit', icon: ScanLine, pattern: 'compact' },
  { id: 'qa-checklist', name: 'QA Checklist', desc: 'Test proof', icon: Check, pattern: 'sidebar' },
  { id: 'scrum-board', name: 'Scrum Board', desc: 'Delivery blocks', icon: Layout, pattern: 'portfolio' },
  { id: 'content-editorial', name: 'Content Editorial', desc: 'Writing clean', icon: BookOpen, pattern: 'centered' },
  { id: 'video-reel', name: 'Video Reel', desc: 'Media proof', icon: Eye, pattern: 'portfolio' },
  { id: 'robotics-console', name: 'Robotics Console', desc: 'Automation', icon: Cpu, pattern: 'split' },
  { id: 'global-cv', name: 'Global CV', desc: 'International', icon: Globe, pattern: 'stack' },
  { id: 'senior-lead', name: 'Senior Lead', desc: 'Depth + scope', icon: Crown, pattern: 'split' },
  { id: 'career-switch', name: 'Career Switch', desc: 'Transferable', icon: RefreshCw, pattern: 'centered' },
  { id: 'ats-compact', name: 'ATS Compact', desc: 'Dense parser', icon: ScanLine, pattern: 'compact' },
  { id: 'premium-spread', name: 'Premium Spread', desc: 'Polished split', icon: Diamond, pattern: 'split' }
];

export default function ResumeCenter({ atsScore, setAtsScore, resumeScore, setResumeScore }) {
  const [activeTab, setActiveTab] = useState('builder');
  const [activeFormSection, setActiveFormSection] = useState('contact');
  const [scanning, setScanning] = useState(false);
  const [scanText, setScanText] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedLayout, setSelectedLayout] = useState('classic-stack');
  const [isExporting, setIsExporting] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [githubUser, setGithubUser] = useState('');
  const [githubResult, setGithubResult] = useState(null);
  const [analyzingGithub, setAnalyzingGithub] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinResult, setLinkedinResult] = useState(null);
  const [analyzingLinkedin, setAnalyzingLinkedin] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    name: 'Aastik Srivastava', title: 'Full Stack & Embedded Systems Engineer',
    email: 'aastik@prisma-embedded.codes', phone: '+91 98765 43210',
    location: 'Bengaluru, India', portfolio: 'aastik.dev'
  });
  const [resumeSkills, setResumeSkills] = useState('React, Next.js, TypeScript, Python, FreeRTOS, C++, STM32, DMA, I2C, SPI');
  const [resumeProjects, setResumeProjects] = useState(`Dual-Core Drone Stabilizer RTOS — Architected real-time flight controller using FreeRTOS on STM32H7, achieving <2ms loop latency with DMA-accelerated sensor fusion.

Next.js E-Commerce ISR Engine — Built sub-100ms product pages using Incremental Static Regeneration, handling 10K+ SKUs with edge caching.`);

  const [resumeExperience, setResumeExperience] = useState(`Embedded Software Intern, Prisma Embedded Codes - Built STM32 sensor drivers, debugged I2C timing issues, and documented board bring-up steps for 6 student teams.

Frontend Developer, Campus Project Lab - Shipped responsive React dashboards, reduced bundle warnings, and coordinated weekly feature reviews with mentors.`);

  const [recommendations, setRecommendations] = useState([
    { id: 1, type: 'critical', text: "Missing 'ISR' in Web Projects — top keyword for frontend roles.", fixed: false },
    { id: 2, type: 'critical', text: "Missing 'DMA Configuration' in STM32 projects — critical for embedded ATS.", fixed: false },
    { id: 3, type: 'warning', text: "Two-column layout detected. 63% of ATS parsers fail on multi-column.", fixed: false },
    { id: 4, type: 'warning', text: "Bullet points lack metrics. Use 'Reduced latency by 40%' not 'Improved'.", fixed: false },
    { id: 5, type: 'tip', text: "Add skill proficiency bars — increases recruiter scan time by 34%.", fixed: false },
    { id: 6, type: 'tip', text: "Include GitHub contribution graph — 2.3x more callbacks.", fixed: true }
  ]);

  const skillLevels = useMemo(() => [
    { skill: 'React', level: 95 }, { skill: 'Next.js', level: 92 },
    { skill: 'TypeScript', level: 90 }, { skill: 'Python', level: 88 },
    { skill: 'FreeRTOS', level: 85 }, { skill: 'STM32', level: 82 }
  ], []);

  const triggerConfetti = () => { setConfetti(true); setTimeout(() => setConfetti(false), 1800); };

  const handleFix = (id) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, fixed: true } : r));
    setAtsScore(p => Math.min(p + 3, 100));
    triggerConfetti();
  };

  const handleScan = () => {
    if (!scanText.trim()) return;
    setScanning(true); setScanProgress(0);
    const iv = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) { clearInterval(iv); setScanning(false); setAtsScore(87); return 100; }
        return p + 2;
      });
    }, 40);
  };

  const normalizeGithubInput = (value) => {
    const raw = value.trim();
    if (!raw) return '';
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const url = new URL(withProtocol);
      if (url.hostname.replace(/^www\./, '').toLowerCase() === 'github.com') {
        return url.pathname.split('/').filter(Boolean)[0] || '';
      }
    } catch {
      // Plain usernames are handled below.
    }
    return raw.replace(/^@/, '').replace(/^github\.com\//i, '').split(/[/?#]/)[0];
  };

  const normalizeLinkedinInput = (value) => {
    const raw = value.trim();
    if (!raw) return '';
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const url = new URL(withProtocol);
      if (url.hostname.replace(/^www\./, '').toLowerCase() === 'linkedin.com') {
        const parts = url.pathname.split('/').filter(Boolean);
        const profileIndex = parts.findIndex(part => part.toLowerCase() === 'in');
        return profileIndex >= 0 && parts[profileIndex + 1] ? parts[profileIndex + 1] : parts[0] || '';
      }
    } catch {
      // Plain slugs are handled below.
    }
    return raw.replace(/^@/, '').replace(/^linkedin\.com\/in\//i, '').split(/[/?#]/)[0];
  };

  const extractGithubHandle = (value) => normalizeGithubInput(value);
  const extractLinkedinProfile = (value) => normalizeLinkedinInput(value);

  const handleGithub = () => {
    const handle = extractGithubHandle(githubUser);
    if (!handle) return;
    setAnalyzingGithub(true); setGithubResult(null);
    setTimeout(() => {
      setAnalyzingGithub(false);
      setGithubResult({ handle, score: 84, stars: 127, repos: 24, forks: 34, contributions: 847, streak: 42,
        languages: ['TypeScript','Python','C','Rust'],
        findings: [
          { type: 'good', text: "Dynamic README with contribution snake — excellent branding." },
          { type: 'warn', text: "4 repos lack LICENSE files — reduces corporate confidence." },
          { type: 'improve', text: "Pin top 6 repos. Only 2 pinned — missed visibility." }
        ]
      });
    }, 1800);
  };

  const handleLinkedin = () => {
    const profile = extractLinkedinProfile(linkedinUrl);
    if (!profile) return;
    setAnalyzingLinkedin(true); setLinkedinResult(null);
    setTimeout(() => {
      setAnalyzingLinkedin(false);
      setLinkedinResult({ profile, score: 79, connections: 1200, endorsements: 45, profileViews: 340,
        findings: [
          { type: 'good', text: "Custom banner with tech stack — strong first impression." },
          { type: 'warn', text: "Only 12 endorsements. Target 50+ for algorithmic boost." },
          { type: 'improve', text: "About section is narrative. Switch to project-first format." }
        ]
      });
    }, 1800);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => { setIsExporting(false); triggerConfetti(); }, 2500);
  };

  const handleOptimize = () => {
    setResumeScore(p => Math.min(p + 5, 100));
    triggerConfetti();
  };

  const fixedCount = recommendations.filter(r => r.fixed).length;
  const progressPct = (fixedCount / recommendations.length) * 100;

  const tabs = [
    { id: 'builder', label: 'Builder', icon: Layout, desc: 'Craft & preview' },
    { id: 'scanner', label: 'Scanner', icon: ScanLine, desc: 'ATS analysis' },
    { id: 'social', label: 'Social', icon: Globe, desc: 'Profile audit' }
  ];

  const formSections = [
    { id: 'contact', label: 'Identity', icon: Fingerprint },
    { id: 'skills', label: 'Arsenal', icon: Target },
    { id: 'projects', label: 'Projects', icon: Rocket },
    { id: 'experience', label: 'Experience', icon: TrendingUp }
  ];
  const activeTemplate = RESUME_TEMPLATES.find(t => t.id === selectedTemplate) || RESUME_TEMPLATES[0];
  const activeTheme = TEMPLATE_THEMES[activeTemplate.theme] || TEMPLATE_THEMES.modern;
  const activeLayout = RESUME_LAYOUTS.find(l => l.id === selectedLayout) || RESUME_LAYOUTS[0];
  const activePattern = LAYOUT_PATTERNS[activeLayout.pattern] || LAYOUT_PATTERNS.stack;

  return (
    <div className="min-h-screen bg-[#F8F7FC] relative overflow-hidden">
      <ParticleField />
      <Confetti active={confetti} />

      {/* Ambient Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ═══════ TOP BAR ═══════ */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.5 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShieldCheck className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Resume and ATS</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-slate-400">Make your Resume Gurantee Card of your career</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════ FLOATING TAB DOCK ═══════ */}
      <div className="relative z-20 flex justify-center -mb-5">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-1.5 flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`relative px-5 py-3 rounded-xl flex items-center gap-2.5 transition-all ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                {isActive && (
                  <motion.div layoutId="tabBg" className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <div className="relative z-10 text-left">
                  <div className="text-sm font-bold leading-none">{tab.label}</div>
                  <div className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{tab.desc}</div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* ═══════ CONTENT ═══════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-8">
        <AnimatePresence mode="wait">

          {/* ===== BUILDER TAB ===== */}
          {activeTab === 'builder' && (
            <motion.div key="builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">
                {/* Templates */}
                <TiltCard intensity={6}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Palette className="w-4 h-4 text-indigo-500" /> Choose Your Armor
                      </h3>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black text-indigo-600">
                        {RESUME_TEMPLATES.length} templates
                      </span>
                    </div>
                    <div className="grid max-h-[260px] grid-cols-2 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-3">
                      {RESUME_TEMPLATES.map(t => (
                        <motion.button key={t.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedTemplate(t.id)}
                          className={`relative p-3 rounded-xl border-2 text-left overflow-hidden transition-all ${
                            selectedTemplate === t.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                          }`}>
                          {selectedTemplate === t.id && (
                            <motion.div layoutId="tHighlight" className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"
                              transition={{ type: 'spring', stiffness: 200 }} />
                          )}
                          <div className="relative z-10">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.colors} mb-3`} />
                            <div className="text-xs font-bold text-slate-900 leading-tight">{t.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                          </div>
                          {selectedTemplate === t.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TiltCard>

                {/* Layouts */}
                <TiltCard intensity={6}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Layout className="w-4 h-4 text-purple-500" /> Choose Layout
                      </h3>
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-black text-purple-600">
                        {RESUME_LAYOUTS.length} layouts
                      </span>
                    </div>
                    <div className="grid max-h-[260px] grid-cols-2 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-3">
                      {RESUME_LAYOUTS.map(layout => {
                        const Icon = layout.icon;
                        return (
                          <motion.button
                            key={layout.id}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedLayout(layout.id)}
                            className={`relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all ${
                              selectedLayout === layout.id ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-slate-200 hover:border-slate-300'
                            }`}
                            type="button"
                          >
                            {selectedLayout === layout.id && (
                              <motion.div
                                layoutId="layoutHighlight"
                                className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50"
                                transition={{ type: 'spring', stiffness: 200 }}
                              />
                            )}
                            <div className="relative z-10">
                              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="text-xs font-bold leading-tight text-slate-900">{layout.name}</div>
                              <div className="mt-0.5 text-[10px] text-slate-400">{layout.desc}</div>
                            </div>
                            {selectedLayout === layout.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500"
                              >
                                <Check className="h-3 w-3 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </TiltCard>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                  <div className="flex gap-2 p-4 border-b border-slate-100 overflow-x-auto">
                    {formSections.map(s => {
                      const Icon = s.icon;
                      const active = activeFormSection === s.id;
                      return (
                        <motion.button key={s.id} onClick={() => setActiveFormSection(s.id)}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}>
                          <Icon className="w-3.5 h-3.5" /> {s.label}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="p-5">
                    <AnimatePresence mode="wait">
                      {activeFormSection === 'contact' && (
                        <motion.div key="c" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                          className="grid sm:grid-cols-2 gap-4">
                          {[
                            { label: 'Full Name', key: 'name', icon: Crown },
                            { label: 'Role Title', key: 'title', icon: Target },
                            { label: 'Email', key: 'email', icon: Globe },
                            { label: 'Phone', key: 'phone', icon: Terminal },
                            { label: 'Location', key: 'location', icon: MapPin },
                            { label: 'Portfolio', key: 'portfolio', icon: Rocket }
                          ].map((f, i) => {
                            const Icon = f.icon;
                            return (
                              <motion.div key={f.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                                  <Icon className="w-3 h-3" /> {f.label}
                                </label>
                                <input type="text" value={contactInfo[f.key] || ''}
                                  onChange={e => setContactInfo({ ...contactInfo, [f.key]: e.target.value })}
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all hover:border-slate-300" />
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                      {activeFormSection === 'skills' && (
                        <motion.div key="s" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Technical Skills</label>
                            <textarea rows={3} value={resumeSkills} onChange={e => setResumeSkills(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none" />
                          </div>
                          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl p-5 border border-slate-100">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">Proficiency Matrix</h4>
                            <div className="flex flex-wrap gap-3 justify-center">
                              {skillLevels.map((s, i) => <HexBadge key={s.skill} {...s} delay={i * 0.1} />)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {activeFormSection === 'projects' && (
                        <motion.div key="p" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Projects</label>
                            <textarea rows={6} value={resumeProjects} onChange={e => setResumeProjects(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none font-mono leading-relaxed" />
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {resumeSkills.split(',').map((tag, i) => (
                              <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-lg border border-indigo-100 hover:bg-indigo-100 cursor-pointer transition-colors">
                                {tag.trim()}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {activeFormSection === 'experience' && (
                        <motion.div key="e" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Experience</label>
                            <textarea rows={7} value={resumeExperience} onChange={e => setResumeExperience(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none font-mono leading-relaxed" />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {resumeExperience.split('\n\n').filter(Boolean).slice(0, 2).map((item, i) => (
                              <div key={i} className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-indigo-500">
                                  <TrendingUp className="h-3.5 w-3.5" /> Role {i + 1}
                                </div>
                                <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-slate-600">{item}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(99,102,241,0.3)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleOptimize}
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <BrainCircuit className="w-5 h-5" /> AI Optimize
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleExport} disabled={isExporting}
                    className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 flex items-center gap-2 min-w-[140px] justify-center">
                    {isExporting ? <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" /> : <Download className="w-4 h-4" />}
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                  </motion.button>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-500" /> Live Preview
                    </h3>
                    <button onClick={() => setShowPreview(!showPreview)}
                      className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                      {showPreview ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {showPreview && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 200 }}>
                        <TiltCard intensity={8}>
                          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <div className={`p-6 ${activeTheme.header} ${activePattern.headerAlign}`}>
                              <div className="mb-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]">
                                {activeTemplate.name} / {activeLayout.name}
                              </div>
                              <h2 className={`text-2xl font-black ${activeTheme.name}`}>{contactInfo.name}</h2>
                              <p className={`text-sm mt-1 font-semibold ${activeTheme.role}`}>{contactInfo.title}</p>
                              <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] ${activeTheme.meta}`}>
                                <span>{contactInfo.email}</span><span>{contactInfo.phone}</span><span>{contactInfo.location}</span>
                              </div>
                            </div>
                            <div className={activePattern.body}>
                              <div>
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTheme.section} mb-2`}>Technical Arsenal</h4>
                                <div className={activePattern.skills}>
                                  {resumeSkills.split(',').map((s, i) => (
                                    <span key={i} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTheme.chip}`}>{s.trim()}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTheme.section} mb-2`}>Featured Projects</h4>
                                <div className={activePattern.projects}>
                                  {resumeProjects.split('\n\n').filter(Boolean).map((p, i) => (
                                    <div key={i} className="text-xs text-slate-600 leading-relaxed">
                                      <div className="font-bold text-slate-900">{p.split('—')[0]}</div>
                                      <div className="text-slate-400 mt-0.5">{p.split('—')[1]}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTheme.section} mb-2`}>Experience</h4>
                                <div className="space-y-2">
                                  {resumeExperience.split('\n\n').filter(Boolean).map((item, i) => (
                                    <div key={i} className="text-xs leading-relaxed text-slate-600">
                                      <div className="font-bold text-slate-900">{item.split(' - ')[0]}</div>
                                      <div className="mt-0.5 text-slate-400">{item.split(' - ')[1] || item}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTheme.section} mb-3`}>Core Strengths</h4>
                                <div className={activePattern.strengths}>
                                  {skillLevels.slice(0, 4).map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-slate-500 w-20 truncate">{s.skill}</span>
                                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div className={`h-full rounded-full bg-gradient-to-r ${activeTheme.accent}`}
                                          initial={{ width: 0 }} animate={{ width: `${s.level}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }} />
                                      </div>
                                      <span className="text-[10px] font-black text-slate-300 w-6 text-right">{s.level}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className={`px-6 py-4 bg-gradient-to-r ${activeTheme.footer} border-t border-slate-100 ${activePattern.footer}`}>
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                              <div className="flex items-center gap-3">
                                <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <motion.div className={`h-full bg-gradient-to-r ${activeTheme.accent} rounded-full`}
                                    initial={{ width: 0 }} animate={{ width: `${resumeScore}%` }} transition={{ duration: 1 }} />
                                </div>
                                <span className="text-sm font-black text-emerald-600">{resumeScore}</span>
                              </div>
                            </div>
                          </div>
                        </TiltCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== SCANNER TAB ===== */}
          {activeTab === 'scanner' && (
            <motion.div key="scanner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <TiltCard intensity={5}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <ScanLine className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-black text-slate-900 text-lg">ATS Deep Scan</h2>
                        <p className="text-xs text-slate-400">Neural parser & keyword extraction</p>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea rows={6} value={scanText} onChange={e => setScanText(e.target.value)}
                        placeholder="Paste your entire resume here for neural analysis..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none" />
                      <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-300 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        {scanText.length.toLocaleString()} chars
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors">
                        <UploadCloud className="w-4 h-4" /> Upload PDF
                      </button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleScan} disabled={scanning || !scanText.trim()}
                        className={`px-8 py-3 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${
                          scanning || !scanText.trim() ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        }`}>
                        {scanning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Run Deep Scan</>}
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {scanning && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 overflow-hidden">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold text-slate-600 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Neural analysis...
                            </span>
                            <span className="font-black text-indigo-600 text-lg">{scanProgress}%</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full relative"
                              style={{ width: `${scanProgress}%` }}>
                              <div className="absolute inset-0 bg-white/30 animate-pulse" />
                            </motion.div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 mt-3">
                            {['Parsing','Keywords','Format','Scoring'].map((step, i) => (
                              <motion.div key={step} initial={false}
                                animate={{ backgroundColor: scanProgress > (i + 1) * 25 ? '#ecfdf5' : '#f8fafc', borderColor: scanProgress > (i + 1) * 25 ? '#10b981' : '#e2e8f0' }}
                                className="flex items-center justify-center gap-1 py-2 rounded-lg border text-[10px] font-bold">
                                {scanProgress > (i + 1) * 25 ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <div className="w-3 h-3 rounded-full border-2 border-slate-300" />}
                                <span className={scanProgress > (i + 1) * 25 ? 'text-emerald-700' : 'text-slate-400'}>{step}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TiltCard>

                {!scanning && scanProgress === 100 && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Keyword Density', value: 87, icon: Target, color: 'from-emerald-400 to-teal-500', text: 'text-emerald-600' },
                      { label: 'Format Score', value: 92, icon: Layout, color: 'from-blue-400 to-indigo-500', text: 'text-blue-600' },
                      { label: 'Readability', value: 78, icon: BookOpen, color: 'from-amber-400 to-orange-500', text: 'text-amber-600' }
                    ].map((stat, i) => (
                      <TiltCard key={stat.label} intensity={10}>
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}
                          className="bg-white rounded-2xl border border-slate-200/60 p-5 text-center shadow-sm">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className={`text-3xl font-black ${stat.text}`}><AnimatedCounter value={stat.value} suffix="%" /></div>
                          <div className="text-xs font-bold text-slate-400 mt-1">{stat.label}</div>
                        </motion.div>
                      </TiltCard>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <TiltCard intensity={10}>
                  <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="relative h-24 w-24 shrink-0">
                        <svg className="h-full w-full -rotate-90">
                          <circle cx="48" cy="48" r="39" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                          <motion.circle cx="48" cy="48" r="39" fill="none"
                            stroke={atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8" strokeLinecap="round" strokeDasharray={245}
                            initial={{ strokeDashoffset: 245 }}
                            animate={{ strokeDashoffset: 245 - (atsScore / 100) * 245 }}
                            transition={{ duration: 1.2, ease: "easeOut" }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-2xl font-black ${atsScore >= 80 ? 'text-emerald-600' : atsScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            <AnimatedCounter value={atsScore} />
                          </span>
                          <span className="text-[9px] font-black uppercase text-slate-400">ATS</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-900">ATS Score</h3>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                          {atsScore >= 80 ? 'Excellent. Your resume is ready for high-volume ATS filters.' : atsScore >= 60 ? 'Good base. Fix the radar items to reach shortlist strength.' : 'Needs work. Start with critical parser and keyword issues.'}
                        </p>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                            animate={{ width: `${atsScore}%` }} transition={{ duration: 1 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-indigo-500" /> Optimization Radar
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                        animate={{ width: `${progressPct}%` }} transition={{ type: 'spring', stiffness: 100 }} />
                    </div>
                    <span className="text-[11px] font-black text-emerald-600">{fixedCount}/{recommendations.length}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <motion.div key={rec.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, type: 'spring' }} whileHover={{ x: 4, scale: 1.01 }}
                      className={`relative p-3 rounded-xl border transition-all ${
                        rec.fixed ? 'bg-slate-50/50 border-slate-100 opacity-50' :
                        rec.type === 'critical' ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:border-red-300 hover:shadow-md hover:shadow-red-100' :
                        rec.type === 'warning' ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100' :
                        'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100'
                      }`}>
                      <div className="flex gap-3 items-start">
                        <div className={`mt-0.5 shrink-0 ${rec.fixed ? 'text-slate-300' : rec.type === 'critical' ? 'text-red-500' : rec.type === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {rec.fixed ? <Check className="w-5 h-5" /> : rec.type === 'critical' ? <Flame className="w-5 h-5" /> : rec.type === 'warning' ? <Zap className="w-5 h-5" /> : <Diamond className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            rec.fixed ? 'bg-slate-200 text-slate-500' : rec.type === 'critical' ? 'bg-red-100 text-red-700' : rec.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>{rec.fixed ? 'Resolved' : rec.type}</span>
                          <p className={`text-xs leading-relaxed mt-1 ${rec.fixed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{rec.text}</p>
                        </div>
                        {!rec.fixed && (
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleFix(rec.id)}
                            className="shrink-0 px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-600 text-[11px] font-black rounded-lg border border-indigo-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                            Fix
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== SOCIAL TAB ===== */}
          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6">
              {/* GitHub */}
              <TiltCard intensity={6}>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center shadow-xl">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">GitHub Audit</h3>
                      <p className="text-xs text-slate-400">Repository quality & contribution analysis</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          inputMode="url"
                          placeholder="Paste GitHub URL or username"
                          value={githubUser}
                          onChange={e => setGithubUser(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleGithub(); }}
                          onPaste={e => {
                            e.preventDefault();
                            const pasted = e.clipboardData.getData('text').trim();
                            setGithubUser(pasted);
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                        />
                        {extractGithubHandle(githubUser) && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
                          >
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                              @{extractGithubHandle(githubUser)}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGithub}
                        disabled={analyzingGithub || !extractGithubHandle(githubUser)}
                        className="px-5 bg-gradient-to-r from-slate-800 to-black text-white rounded-xl font-bold text-xs disabled:opacity-50 shadow-lg flex items-center gap-1.5"
                      >
                        {analyzingGithub ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                          </>
                        ) : (
                          <>
                            <ScanLine className="w-4 h-4" /> Analyze
                          </>
                        )}
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Accepts: github.com/username, https://github.com/username, or just username
                    </p>
                  </div>
                  <AnimatePresence>
                    {githubResult && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                          Auditing github.com/{githubResult.handle}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: 'Score', value: githubResult.score, icon: Trophy, color: 'bg-indigo-50 text-indigo-600' },
                            { label: 'Stars', value: githubResult.stars, icon: Star, color: 'bg-amber-50 text-amber-600' },
                            { label: 'Repos', value: githubResult.repos, icon: GitBranch, color: 'bg-slate-50 text-slate-700' },
                            { label: 'Forks', value: githubResult.forks, icon: Code2, color: 'bg-emerald-50 text-emerald-600' }
                          ].map(s => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                              className={`${s.color} rounded-xl p-3 text-center`}>
                              <s.icon className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-lg font-black"><AnimatedCounter value={s.value} /></div>
                              <div className="text-[9px] font-bold opacity-60">{s.label}</div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 text-center border border-emerald-100">
                            <div className="text-xl font-black text-emerald-600"><AnimatedCounter value={githubResult.contributions} /></div>
                            <div className="text-[10px] font-bold text-emerald-400">Contributions</div>
                          </div>
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 text-center border border-orange-100">
                            <div className="text-xl font-black text-orange-600"><AnimatedCounter value={githubResult.streak} />d</div>
                            <div className="text-[10px] font-bold text-orange-400">Day Streak</div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {githubResult.languages.map(lang => (
                            <span key={lang} className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg">{lang}</span>
                          ))}
                        </div>
                        <div className="space-y-2">
                          {githubResult.findings.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                              className={`flex gap-2.5 items-start p-3 rounded-xl text-xs ${
                                f.type === 'good' ? 'bg-emerald-50 text-emerald-700' : f.type === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                              }`}>
                              {f.type === 'good' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : f.type === 'warn' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <Zap className="w-4 h-4 shrink-0 mt-0.5" />}
                              <span className="font-medium">{f.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TiltCard>

              {/* LinkedIn */}
              <TiltCard intensity={6}>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center shadow-xl">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">LinkedIn Audit</h3>
                      <p className="text-xs text-slate-400">Profile optimization for recruiter visibility</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          inputMode="url"
                          placeholder="Paste LinkedIn URL or profile slug"
                          value={linkedinUrl}
                          onChange={e => setLinkedinUrl(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleLinkedin(); }}
                          onPaste={e => {
                            e.preventDefault();
                            const pasted = e.clipboardData.getData('text').trim();
                            setLinkedinUrl(pasted);
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all"
                        />
                        {extractLinkedinProfile(linkedinUrl) && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
                          >
                            <span className="text-[10px] font-bold text-[#0A66C2] bg-blue-50 px-2 py-0.5 rounded-md">
                              in/{extractLinkedinProfile(linkedinUrl)}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLinkedin}
                        disabled={analyzingLinkedin || !extractLinkedinProfile(linkedinUrl)}
                        className="px-5 bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white rounded-xl font-bold text-xs disabled:opacity-50 shadow-lg flex items-center gap-1.5"
                      >
                        {analyzingLinkedin ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                          </>
                        ) : (
                          <>
                            <ScanLine className="w-4 h-4" /> Analyze
                          </>
                        )}
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Accepts: linkedin.com/in/username, https://linkedin.com/in/username, or just username
                    </p>
                  </div>
                  <AnimatePresence>
                    {linkedinResult && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                        <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-[#0A66C2]">
                          Auditing linkedin.com/in/{linkedinResult.profile}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'Score', value: linkedinResult.score, color: 'text-[#0A66C2]', bg: 'bg-blue-50' },
                            { label: 'Connections', value: linkedinResult.connections, color: 'text-slate-700', bg: 'bg-slate-50' },
                            { label: 'Endorsements', value: linkedinResult.endorsements, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                          ].map(s => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                              className={`${s.bg} rounded-xl p-3 text-center`}>
                              <div className={`text-lg font-black ${s.color}`}><AnimatedCounter value={s.value} /></div>
                              <div className="text-[9px] font-bold text-slate-400">{s.label}</div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-3 text-center border border-indigo-100">
                          <div className="text-xl font-black text-indigo-600"><AnimatedCounter value={linkedinResult.profileViews} /></div>
                          <div className="text-[10px] font-bold text-indigo-400">Profile Views (30d)</div>
                        </div>
                        <div className="space-y-2">
                          {linkedinResult.findings.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                              className={`flex gap-2.5 items-start p-3 rounded-xl text-xs ${
                                f.type === 'good' ? 'bg-emerald-50 text-emerald-700' : f.type === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                              }`}>
                              {f.type === 'good' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : f.type === 'warn' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <Zap className="w-4 h-4 shrink-0 mt-0.5" />}
                              <span className="font-medium">{f.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TiltCard>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
