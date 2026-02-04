import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ui/particle-field";
import { FloatingOrbs, GlowingOrb } from "@/components/ui/floating-orbs";
import { HolographicCard } from "@/components/ui/holographic-card";
import { TypingTerminal, TerminalWindow } from "@/components/ui/typing-terminal";
import { HUDFrame, HUDStat, HUDProgress } from "@/components/ui/hud-elements";
import { AnimatedProgress, CircularProgress } from "@/components/ui/animated-progress";
import { Badge, LevelBadge } from "@/components/ui/badges";
import { TiltCard, GlowingBorder } from "@/components/ui/tilt-card";
import { ScanlineOverlay, Vignette, NoiseOverlay } from "@/components/ui/scanline-overlay";
import { MatrixRain } from "@/components/ui/matrix-rain";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Background effects */}
      <MatrixRain />
      <ParticleField particleCount={60} />
      <FloatingOrbs count={4} />
      <ScanlineOverlay opacity={0.05} speed="slow" />
      <Vignette intensity="medium" />
      <NoiseOverlay opacity={0.02} />

      {/* Cyber grid background */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          {/* Top HUD bar */}
          <div className="absolute top-0 left-0 right-0 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                <span className="font-mono text-xs text-green-400 tracking-widest">SYSTEM ONLINE</span>
              </div>
              <div className="font-mono text-xs text-zinc-600">
                v2.0.26 // AURASCAN PROTOCOL
              </div>
              <Link href="/auth/login">
                <Button variant="cyber" size="sm" className="font-mono uppercase tracking-wider">
                  Initialize
                </Button>
              </Link>
            </div>
          </div>

          {/* Main hero content */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Glowing orb accent */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-30">
              <GlowingOrb size={300} color="#00ffff" />
            </div>

            {/* Title */}
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
                <span className="text-gradient-animated">AURA</span>
                <span className="text-white">SCAN</span>
              </h1>
              <p className="text-cyan-400/80 font-mono text-sm tracking-[0.3em] mt-2 neon-text">
                YOUR AI&apos;S CONSCIENCE
              </p>
            </div>

            {/* Terminal window */}
            <div className="max-w-xl mx-auto">
              <TerminalWindow title="aurascan.protocol">
                <TypingTerminal
                  text={[
                    "Initializing ethical AI scanner...",
                    "Loading bias detection modules...",
                    "Privacy protocols engaged...",
                    "System ready. Welcome, Guardian."
                  ]}
                  speed={40}
                  delay={1500}
                  loop={true}
                  className="text-sm"
                />
              </TerminalWindow>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/auth/signup">
                <Button variant="holographic" size="xl" className="font-mono uppercase tracking-wider">
                  Begin Protocol
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="cyberGreen" size="xl" className="font-mono uppercase tracking-wider">
                  Access Terminal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto">
            <HUDFrame title="GLOBAL STATISTICS" status="online">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-4">
                <HUDStat label="Active Guardians" value="12,847" trend="up" color="cyan" />
                <HUDStat label="Scans Completed" value="1.2M" trend="up" color="green" />
                <HUDStat label="Ethics Score" value="94.7" unit="%" trend="stable" color="magenta" />
                <HUDStat label="Threats Detected" value="847K" trend="down" color="orange" />
              </div>
            </HUDFrame>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 font-mono">
              <span className="text-cyan-400">&lt;</span>
              CORE MODULES
              <span className="text-cyan-400">/&gt;</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TiltCard>
                <HolographicCard glowColor="cyan" className="h-full">
                  <div className="p-6 space-y-4">
                    <div className="text-4xl">🔍</div>
                    <h3 className="text-xl font-bold text-cyan-400 font-mono">Ethics Scanner</h3>
                    <p className="text-sm text-zinc-400">
                      Real-time analysis for Bias, Privacy, and Safety violations.
                    </p>
                    <HUDProgress value={92} label="Accuracy" color="cyan" />
                  </div>
                </HolographicCard>
              </TiltCard>

              <TiltCard>
                <HolographicCard glowColor="green" className="h-full">
                  <div className="p-6 space-y-4">
                    <div className="text-4xl">🎮</div>
                    <h3 className="text-xl font-bold text-green-400 font-mono">Gamification</h3>
                    <p className="text-sm text-zinc-400">
                      Earn XP, unlock badges, and compete on global leaderboards.
                    </p>
                    <HUDProgress value={78} label="Engagement" color="green" />
                  </div>
                </HolographicCard>
              </TiltCard>

              <TiltCard>
                <HolographicCard glowColor="magenta" className="h-full">
                  <div className="p-6 space-y-4">
                    <div className="text-4xl">👥</div>
                    <h3 className="text-xl font-bold text-pink-400 font-mono">Community</h3>
                    <p className="text-sm text-zinc-400">
                      Join guilds, share templates, and collaborate with guardians.
                    </p>
                    <HUDProgress value={85} label="Activity" color="magenta" />
                  </div>
                </HolographicCard>
              </TiltCard>

              <TiltCard>
                <HolographicCard glowColor="purple" className="h-full">
                  <div className="p-6 space-y-4">
                    <div className="text-4xl">📱</div>
                    <h3 className="text-xl font-bold text-purple-400 font-mono">AR Lens</h3>
                    <p className="text-sm text-zinc-400">
                      Analyze UI ethics through your camera in real-time AR.
                    </p>
                    <HUDProgress value={67} label="Beta" color="cyan" />
                  </div>
                </HolographicCard>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Level Progress Section */}
        <section className="py-16 px-4 border-t border-cyan-500/20">
          <div className="max-w-4xl mx-auto">
            <GlowingBorder colors={['#00ffff', '#39ff14', '#ff00ff']}>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <LevelBadge level={42} title="Ethics Guardian" size="lg" />
                  <CircularProgress value={67} size={80} color="cyan" />
                </div>
                
                <div className="space-y-4">
                  <AnimatedProgress value={67} variant="cyber" color="cyan" showValue />
                  <div className="grid grid-cols-3 gap-4">
                    <Badge name="First Scan" icon="🔍" rarity="common" unlocked />
                    <Badge name="Bug Hunter" icon="🐛" rarity="rare" unlocked />
                    <Badge name="Guardian Elite" icon="⚔️" rarity="legendary" unlocked />
                  </div>
                </div>
              </div>
            </GlowingBorder>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-zinc-600">
              © 2026 AURASCAN PROTOCOL // ALL SYSTEMS NOMINAL
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-xs text-cyan-500/50 tracking-wider">
                ETHICS • TRANSPARENCY • ACCOUNTABILITY
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
