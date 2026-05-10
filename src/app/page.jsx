"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Scene from "@/components/Scene";
import { MoveRight, Sparkles, Zap, Shield, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const [currentAction, setCurrentAction] = useState({ value: "idle", type: "gltf" });
  const [entered, setEntered] = useState(false);
  const [introAnimating, setIntroAnimating] = useState(false);
  
  const characterGroupRef = useRef();
  const mainContentRef = useRef();
  const introScreenRef = useRef();

  // Initialize smooth scrolling
  useEffect(() => {
    if (!entered) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, [entered]);

  // Handle Entrance Animation
  const handleEnter = () => {
    if (introAnimating || entered) return;
    setIntroAnimating(true);
    
    // Change animation to run
    setCurrentAction({ value: "run", type: "gltf" });
    
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentAction({ value: "idle", type: "gltf" });
        setEntered(true);
      }
    });

    // 1. Fade out the intro text immediately
    tl.to(introScreenRef.current, {
      opacity: 0,
      duration: 0.8,
      pointerEvents: "none",
      ease: "power2.out"
    }, 0);

    // Intro position: Bot on the Left (-2.0), facing Right (1.5 rad)
    gsap.set(characterGroupRef.current.position, { x: -2.0, y: -1.0, z: 0 });

    // 2. Move the robot from left (-2.0) to right (1.5)
    tl.to(characterGroupRef.current.position, {
      x: 1.5,
      duration: 2.5,
      ease: "power1.inOut"
    }, 0);

    // 3. Rotate robot to face the camera when it arrives
    tl.to(characterGroupRef.current.rotation, {
      y: -0.5, // Turn slightly to left to face user
      duration: 0.8,
      ease: "power2.inOut"
    }, 1.7);

    // 4. Zoom round effect (clip-path expansion) to reveal website
    tl.to(mainContentRef.current, {
      clipPath: "circle(150% at 50% 50%)",
      duration: 1.5,
      ease: "power3.inOut"
    }, 1.5);
  };

  // Setup Scroll Animations
  useEffect(() => {
    if (!entered || !characterGroupRef.current) return;

    // Reset character for scroll
    
    // Section 2: Features (100vh - 200vh) -> Robot moves Left, Runs.
    ScrollTrigger.create({
      trigger: "#section-features",
      start: "top bottom",
      end: "top top",
      scrub: 1,
      onEnter: () => setCurrentAction({ value: "run", type: "gltf" }),
      onLeaveBack: () => setCurrentAction({ value: "idle", type: "gltf" }),
      animation: gsap.fromTo(characterGroupRef.current.position, 
        { x: 1.5, y: -1.0, z: 0 },
        { x: -1.5, y: -1.0, z: 0, ease: "power1.inOut" }
      )
    });

    ScrollTrigger.create({
      trigger: "#section-features",
      start: "top bottom",
      end: "top top",
      scrub: 1,
      animation: gsap.fromTo(characterGroupRef.current.rotation, 
        { y: -0.5 },
        { y: -1.5, ease: "power1.inOut" }
      )
    });

    // Section 3: Performance (200vh - 300vh) -> Robot moves Right.
    ScrollTrigger.create({
      trigger: "#section-performance",
      start: "top bottom",
      end: "top top",
      scrub: 1,
      animation: gsap.fromTo(characterGroupRef.current.position, 
        { x: -1.5, y: -1.0, z: 0 },
        { x: 1.5, y: -1.0, z: 0, ease: "power1.inOut" }
      )
    });

    // Rotate to face right while running
    ScrollTrigger.create({
      trigger: "#section-performance",
      start: "top bottom",
      end: "top center",
      scrub: 1,
      animation: gsap.fromTo(characterGroupRef.current.rotation, 
        { y: -1.5 },
        { y: 1.5, ease: "power1.inOut" }
      )
    });

    // Rotate to face left towards text when arriving
    ScrollTrigger.create({
      trigger: "#section-performance",
      start: "top center",
      end: "top top",
      scrub: 1,
      animation: gsap.fromTo(characterGroupRef.current.rotation, 
        { y: 1.5 },
        { y: -0.5, ease: "power1.inOut" }
      )
    });

    // Switch to Handshake only when arrived at Performance section
    ScrollTrigger.create({
      trigger: "#section-performance",
      start: "top center", // Triggers when section reaches middle of screen
      onEnter: () => setCurrentAction({ value: "/ShakingHands.fbx", type: "fbx" }),
      onLeaveBack: () => setCurrentAction({ value: "run", type: "gltf" }),
    });

    // Section 4: Footer/End (300vh - 400vh) -> Robot moves Closer.
    ScrollTrigger.create({
      trigger: "#section-footer",
      start: "top bottom",
      end: "top top",
      scrub: 1,
      animation: gsap.fromTo(characterGroupRef.current.position, 
        { x: 1.5, y: -1.0, z: 0 },
        { x: 0, y: -1.0, z: 1.5, ease: "power1.inOut" }
      )
    });

    // Face left while running to center
    ScrollTrigger.create({
      trigger: "#section-footer",
      start: "top bottom",
      end: "top center",
      scrub: 1,
      animation: gsap.fromTo(characterGroupRef.current.rotation, 
        { y: -0.5 },
        { y: -1.5, ease: "power1.inOut" }
      )
    });

    // Face front for Praying
    ScrollTrigger.create({
      trigger: "#section-footer",
      start: "top center",
      end: "top top",
      scrub: 1,
      animation: gsap.fromTo(characterGroupRef.current.rotation, 
        { y: -1.5 },
        { y: 0, ease: "power1.inOut" }
      )
    });

    // Switch to Praying when arrived at Footer
    ScrollTrigger.create({
      trigger: "#section-footer",
      start: "top center",
      onEnter: () => setCurrentAction({ value: "/Praying.fbx", type: "fbx" }),
      onLeaveBack: () => setCurrentAction({ value: "/ShakingHands.fbx", type: "fbx" }),
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [entered]);

  // Initial setup for character
  useEffect(() => {
    // Handled natively by Scene.jsx initial group position
  }, [entered, introAnimating]);


  return (
    <div className={`relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden ${!entered ? "h-screen overflow-hidden" : ""}`}>
      
      {/* 3D Canvas - Fixed in background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0.5, 4.5], fov: 50 }}>
          <Scene action={currentAction} characterRef={characterGroupRef} />
        </Canvas>
      </div>

      {/* Intro Screen */}
      {!entered && (
        <div 
          ref={introScreenRef}
          className="absolute inset-0 z-50 flex items-center justify-end px-20 bg-gradient-to-l from-black via-black/80 to-transparent"
        >
          <div className="max-w-2xl text-right flex flex-col items-end">
            <h1 className="text-7xl font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-l from-white to-[#88bbff]">
              Welcome to the Future
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Experience the next generation of interactive web design. A fully scroll-driven 3D journey awaits.
            </p>
            <button 
              onClick={handleEnter}
              className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-full overflow-hidden transition-transform hover:scale-105 cursor-pointer pointer-events-auto"
            >
              <span className="relative z-10">Enter Experience</span>
              <MoveRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#88bbff] to-[#ff88cc] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      )}

      {/* Main Website Content - Revealed via Clip Path */}
      <div 
        ref={mainContentRef} 
        className="relative z-10 w-full pointer-events-auto"
        style={{ clipPath: "circle(0% at 50% 50%)" }} // Starts hidden
      >
        {/* Header */}
        <header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
          <div className="text-2xl font-black uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#ff88cc]" />
            Cyber<span className="text-[#88bbff]">X</span>
          </div>
          <nav className="flex gap-8 font-semibold tracking-wide uppercase text-sm">
            <a href="#section-hero" className="hover:text-[#88bbff] transition-colors cursor-pointer">Home</a>
            <a href="#section-features" className="hover:text-[#88bbff] transition-colors cursor-pointer">Features</a>
            <a href="#section-performance" className="hover:text-[#88bbff] transition-colors cursor-pointer">Performance</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="section-hero" className="w-full h-screen flex items-center px-20 relative">
          <div className="max-w-2xl mt-20">
            <h2 className="text-[5rem] leading-[0.9] font-black uppercase tracking-tighter mb-6">
              Interactive <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#88bbff] to-[#ff88cc]">3D Web</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-md border-l-4 border-[#88bbff] pl-6">
              Scroll down to explore the immersive 3D world. Watch as the character reacts and moves seamlessly through the environment.
            </p>
          </div>
          
          <div className="absolute bottom-10 left-20 animate-bounce flex flex-col items-center gap-2 text-gray-400 font-semibold tracking-widest uppercase text-xs">
            Scroll to Explore
            <div className="w-[2px] h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="section-features" className="w-full h-screen flex items-center justify-end px-20 relative bg-gradient-to-b from-transparent to-black/50">
          <div className="max-w-xl text-right">
             <div className="flex justify-end mb-6">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                   <Sparkles className="w-8 h-8 text-[#ff88cc]" />
                </div>
             </div>
            <h2 className="text-6xl font-black uppercase tracking-tighter mb-6">
              Dynamic <br/> Responses
            </h2>
            <p className="text-xl text-gray-300 ml-auto border-r-4 border-[#ff88cc] pr-6">
              As you scroll, the GSAP ScrollTrigger takes control of the Three.js canvas. The character smoothly transitions from idling to running, shifting dynamically from right to left.
            </p>
          </div>
        </section>

        {/* Performance Section */}
        <section id="section-performance" className="w-full h-screen flex items-center px-20 relative">
          <div className="max-w-xl">
             <div className="mb-6">
                <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                   <Shield className="w-8 h-8 text-[#88bbff]" />
                </div>
             </div>
            <h2 className="text-6xl font-black uppercase tracking-tighter mb-6">
              Highly <br/> Optimized
            </h2>
            <p className="text-xl text-gray-300 border-l-4 border-[#88bbff] pl-6">
              Built with Next.js, React Three Fiber, and Lenis. We ensure smooth 60fps animations by offloading heavy lifting and employing intelligent rendering strategies.
            </p>
          </div>
        </section>

        {/* Footer Section */}
        <section id="section-footer" className="w-full h-screen flex items-center justify-between px-20 relative bg-gradient-to-t from-[#0a0f1e] to-transparent">
          {/* Left Content */}
          <div className="z-10 max-w-md text-left">
            <Globe className="w-16 h-16 text-[#88bbff] mb-8" />
            <h2 className="text-7xl font-black uppercase tracking-tighter mb-8">
              Ready to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#88bbff] to-[#ff88cc]">Build?</span>
            </h2>
            <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform cursor-pointer">
              Get Started Now
            </button>
          </div>
          
          {/* Center Space for Robot */}
          <div className="flex-1"></div>

          {/* Right Content */}
          <div className="z-10 max-w-md text-right flex flex-col items-end">
            <h3 className="text-5xl font-black uppercase tracking-tighter mb-6 text-gray-300">
              Join the <br/> Revolution
            </h3>
            <p className="text-lg text-gray-400 mb-8 border-r-4 border-[#ff88cc] pr-6">
              Subscribe to our newsletter for the latest updates on interactive 3D web technologies and next-generation frameworks.
            </p>
            <div className="flex gap-4">
              <input type="email" placeholder="Enter your email" className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white outline-none focus:border-[#ff88cc]" />
              <button className="px-6 py-3 bg-[#ff88cc] text-black font-bold rounded-full uppercase text-sm hover:scale-105 transition-transform">
                Join
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 font-medium text-sm tracking-widest uppercase">
            © 2026 CyberX. All rights reserved.
          </div>
        </section>

      </div>
    </div>
  );
}
