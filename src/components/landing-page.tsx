"use client"

import { 
  Github, 
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Simple3DScene } from "./simple-3d-scene"
import GoldenButton from "./ui/golden-button"
import { ViewWorkButton } from "./ui/view-work-button"
import VRModelComponent from "./vr-model"
import { VideoCard } from "./video-player"

gsap.registerPlugin(ScrollTrigger)

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const totalCards = 6 // Total number of cards
  const [cardsPerView, setCardsPerView] = useState(4) // Cards visible at once
  const [totalSlides, setTotalSlides] = useState(2) // Total slides needed
  const [windowWidth, setWindowWidth] = useState(0) // Track window width for responsive calculations

  // Refs for GSAP animations
  const heroRef = useRef<HTMLElement>(null)
  const highlightsRef = useRef<HTMLElement>(null)
  const paletteRef = useRef<HTMLElement>(null)
  const detailsRef = useRef<HTMLElement>(null)
  const carouselRef2 = useRef<HTMLElement>(null)
  const statsRefs = useRef<(HTMLDivElement | null)[]>([])

  // Calculate responsive carousel settings
  const updateCarouselSettings = () => {
    const width = window.innerWidth
    setWindowWidth(width)
    let newCardsPerView = 4
    
    if (width < 640) {
      newCardsPerView = 1
    } else if (width < 768) {
      newCardsPerView = 2
    } else if (width < 1024) {
      newCardsPerView = 3
    } else {
      newCardsPerView = 4
    }
    
    setCardsPerView(newCardsPerView)
    const newTotalSlides = Math.max(1, totalCards - newCardsPerView + 1)
    setTotalSlides(newTotalSlides)
    
    // Reset to first slide if current slide is out of bounds
    if (currentSlide >= newTotalSlides) {
      setCurrentSlide(0)
      setCanScrollLeft(false)
      setCanScrollRight(newTotalSlides > 1)
    } else {
      setCanScrollLeft(currentSlide > 0)
      setCanScrollRight(currentSlide < newTotalSlides - 1)
    }
  }

  // Calculate transform offset based on screen size
  const getTransformOffset = () => {
    const width = windowWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024)
    let tileWidth = 320
    let gap = 24
    
    if (width < 640) {
      tileWidth = Math.min(width * 0.9, 300)
      gap = 12
    } else if (width < 768) {
      tileWidth = 260
      gap = 16
    } else if (width < 1024) {
      tileWidth = 280
      gap = 24
    } else {
      tileWidth = 320
      gap = 24
    }
    
    return currentSlide * (tileWidth + gap)
  }

  // Carousel scroll functions
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    
    const newSlide = direction === 'left' ? currentSlide - 1 : currentSlide + 1
    if (newSlide >= 0 && newSlide < totalSlides) {
      setCurrentSlide(newSlide)
      setCanScrollLeft(newSlide > 0)
      setCanScrollRight(newSlide < totalSlides - 1)
    }
  }

  // Initialize and handle responsive carousel
  useEffect(() => {
    updateCarouselSettings()
    
    const handleResize = () => {
      updateCarouselSettings()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentSlide])

  // GSAP animations setup
  useEffect(() => {
    // Hero section animation with more sophisticated effects
    if (heroRef.current) {
      const tl = gsap.timeline()
      
      // Animate title with split text effect
      const title = heroRef.current.querySelector('h1')
      if (title) {
        tl.fromTo(title, 
          { y: 80, opacity: 0, rotationX: 90 },
          { 
            y: 0, 
            opacity: 1, 
            rotationX: 0,
            duration: 1.2, 
            ease: "power3.out"
          }
        )
      }
      
      // Animate subtitle with delay
      const subtitle = heroRef.current.querySelector('.subtle')
      if (subtitle) {
        tl.fromTo(subtitle, 
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: "power2.out"
          }, "-=0.6"
        )
      }
      
      // Animate description with stagger
      const description = heroRef.current.querySelector('p')
      if (description) {
        tl.fromTo(description, 
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: "power2.out"
          }, "-=0.4"
        )
      }
      
      // Animate buttons with bounce effect
      const buttons = heroRef.current.querySelectorAll('button, a')
      if (buttons.length > 0) {
        tl.fromTo(buttons, 
          { scale: 0.8, opacity: 0, y: 20 },
          { 
            scale: 1, 
            opacity: 1, 
            y: 0,
            duration: 0.6, 
            stagger: 0.1,
            ease: "back.out(1.7)"
          }, "-=0.2"
        )
      }
    }

    // Highlights section animation with enhanced effects
    if (highlightsRef.current) {
      gsap.fromTo(highlightsRef.current.querySelectorAll('.highlight-card'),
        { y: 80, opacity: 0, scale: 0.9, rotationY: 15 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: highlightsRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      )
      
      // Add hover animations to highlight cards
      const cards = highlightsRef.current.querySelectorAll('.highlight-card')
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { 
            scale: 1.05, 
            y: -10, 
            duration: 0.3, 
            ease: "power2.out" 
          })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { 
            scale: 1, 
            y: 0, 
            duration: 0.3, 
            ease: "power2.out" 
          })
        })
      })
    }

    // Palette section animation
    if (paletteRef.current) {
      gsap.fromTo(paletteRef.current.querySelectorAll('.swatch'),
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: paletteRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }

    // Details section animation
    if (detailsRef.current) {
      gsap.fromTo(detailsRef.current.querySelectorAll('.metric'),
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: detailsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }

    // Carousel section animation
    if (carouselRef2.current) {
      gsap.fromTo(carouselRef2.current.querySelectorAll('.tile'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: carouselRef2.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }

    // Statistics bars animation
    statsRefs.current.forEach((ref) => {
      if (ref) {
        const meter = ref.querySelector('.meter > i') as HTMLElement
        if (meter) {
          gsap.fromTo(meter,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ref,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          )
        }
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <main>
        {/* Hero Section - Full Width Background */}
        <section ref={heroRef} className="hero sp-lg relative overflow-hidden">
          {/* 3D Background - full viewport width, no container limits */}
          <div className="absolute inset-0 z-0 w-full">
            <Simple3DScene />
          </div>
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 z-5 bg-gradient-to-br from-background/30 via-background/10 to-transparent" />
          
          {/* Hero content - constrained to max-width but particles extend beyond */}
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between min-h-[80vh] px-6 lg:px-12">
              <div className="lg:w-1/2 lg:pr-8">
                <div className="subtle date">Open Source Unity Collection — 2024</div>
                <h1 className="title">
                  <em>Gamechisel:</em> Unity Collection
                </h1>
                <p className="text-muted-foreground mt-4 text-lg">
                  Discover the power of Unity development with our comprehensive collection of open-source tools and components.
                </p>
                <div className="flex items-center space-x-4 mt-6">
                  <GoldenButton href="https://github.com/gamechisel/gamechisel" className="whitespace-nowrap">
                    <Github className="w-4 h-4 mr-2" />
                    View Repository
                  </GoldenButton>
                  <ViewWorkButton href="/github">
                    Explore Project
                  </ViewWorkButton>
                </div>
              </div>
              
              {/* Spacer for desktop layout - model is now full background */}
              <div className="lg:w-1/2"></div>
            </div>
          </div>
        </section>

        {/* Media Section */}
        <section className="wrap sp-md">
          <div className="media relative">
            <VideoCard
              videoId="XC0-dsqK1iA"
              startTime={0}
              title="Inspired by the best creators"
            />
          </div>
          <div className="media relative">
            <div className="relative w-full h-full">
              {/* 3D Model Background */}
              <div className="absolute inset-0 bg-background rounded-lg overflow-hidden">
                <VRModelComponent />
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-foreground font-semibold text-lg bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg border">
                  sponsored by storsko.com
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section ref={highlightsRef} id="highlights" className="wrap sp-xl">
          <div className="subtle">Elements</div>
          <h2 className="title" style={{fontSize: 'clamp(40px,6vw,72px)'}}>
            See the highlights of this project.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <article className="highlight-card">
              <h3>Component Library</h3>
              <p>Extensive collection of open source Unity components, scripts, and tools for rapid development.</p>
            </article>
            <article className="highlight-card">
              <h3>Easy Deployment</h3>
              <p>One-click deployment system that allows developers to quickly integrate and customize solutions.</p>
            </article>
            <article className="highlight-card">
              <h3>Community Driven</h3>
              <p>Built by developers, for developers. Contribute, share, and grow together in the Unity ecosystem.</p>
            </article>
          </div>
        </section>

        {/* Sleek Design Section */}
        <section ref={paletteRef} id="palette" className="wrap sp-xl">
          <div className="subtle">Sleek Design</div>
          <h2 className="title" style={{fontSize: 'clamp(40px,6vw,72px)'}}>
            Modern & intuitive interface
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            GameChisel features a sleek, modern design that prioritizes user experience and visual appeal. 
            Our interface combines cutting-edge 3D visualization with clean typography and intuitive navigation, 
            creating an immersive development environment that inspires creativity.
          </p>
          
          {/* Design Showcase Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-14">
            {/* VR Experience */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border/50">
              <div className="aspect-video relative">
                <img 
                  src="/img/vr.png" 
                  alt="VR Development Experience" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg mb-1">VR Development</h3>
                  <p className="text-sm opacity-90">Immersive 3D workspace</p>
                </div>
              </div>
            </div>

            {/* Shopping Cart Interface */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-border/50">
              <div className="aspect-video relative">
                <img 
                  src="/img/cart.png" 
                  alt="E-commerce Integration" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg mb-1">E-commerce Ready</h3>
                  <p className="text-sm opacity-90">Built-in marketplace features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Design Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 rounded-xl bg-muted/30 border border-border/50">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">3D</span>
              </div>
              <h3 className="font-semibold mb-2">3D Visualization</h3>
              <p className="text-sm text-muted-foreground">Interactive 3D models and real-time preview</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-muted/30 border border-border/50">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">UI</span>
              </div>
              <h3 className="font-semibold mb-2">Clean Interface</h3>
              <p className="text-sm text-muted-foreground">Intuitive design with modern aesthetics</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-muted/30 border border-border/50">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Performance</h3>
              <p className="text-sm text-muted-foreground">Optimized for speed and responsiveness</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <span className="template-badge">Modern UI</span>
            <span className="template-badge">3D Graphics</span>
            <span className="template-badge">Responsive Design</span>
            <span className="template-badge">User Experience</span>
            <span className="template-badge">Visual Appeal</span>
            <span className="template-badge">Interactive</span>
          </div>
        </section>

        {/* Project Details Section */}
        <section ref={detailsRef} id="details" className="wrap sp-xl">
          <div className="subtle">Description</div>
          <h2 className="title" style={{fontSize: 'clamp(40px,6vw,72px)'}}>
            Project details & evaluation
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            <strong>Gamechisel</strong> is a comprehensive open source Unity collection that empowers developers 
            to build amazing games with pre-built components, scripts, and deployment tools. 
            The platform focuses on ease of use, community contribution, and production-ready solutions.
          </p>

          <div className="metrics">
            <div ref={(el) => { statsRefs.current[0] = el }} className="metric">
              <h4>Design</h4>
              <div className="meter">
                <i style={{ "--value": "85%" } as React.CSSProperties}></i>
              </div>
              <div className="score">8.5 / 10</div>
            </div>
            <div ref={(el) => { statsRefs.current[1] = el }} className="metric">
              <h4>Usability</h4>
              <div className="meter">
                <i style={{ "--value": "90%" } as React.CSSProperties}></i>
              </div>
              <div className="score">9.0 / 10</div>
            </div>
            <div ref={(el) => { statsRefs.current[2] = el }} className="metric">
              <h4>Innovation</h4>
              <div className="meter">
                <i style={{ "--value": "88%" } as React.CSSProperties}></i>
              </div>
              <div className="score">8.8 / 10</div>
            </div>
            <div ref={(el) => { statsRefs.current[3] = el }} className="metric">
              <h4>Community</h4>
              <div className="meter">
                <i style={{ "--value": "92%" } as React.CSSProperties}></i>
              </div>
              <div className="score">9.2 / 10</div>
            </div>
          </div>

          <div className="dev">
            <div>
              <div className="subtle">Dev score</div>
              <div className="big">8.88<span className="subtle"> / 10</span></div>
            </div>
            <div className="arrow">→</div>
            <div>
              <small>Performance, accessibility, and developer experience combined. 
              The platform excels in providing production-ready solutions with excellent documentation.</small>
            </div>
          </div>

          <div className="subtle mt-12">Score & community feedback</div>
          <h3 className="font-bebas text-3xl sm:text-4xl lg:text-5xl leading-none tracking-tight mb-2">
            COMMUNITY / <span className="font-black">SCORE</span>
          </h3>
          <div className="overflow-x-auto mt-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-xs uppercase text-muted-foreground tracking-wider text-left border-b border-border py-3.5 px-3.5">Name</th>
                  <th className="text-xs uppercase text-muted-foreground tracking-wider text-left border-b border-border py-3.5 px-3.5">Role</th>
                  <th className="text-xs uppercase text-muted-foreground tracking-wider text-left border-b border-border py-3.5 px-3.5">Design</th>
                  <th className="text-xs uppercase text-muted-foreground tracking-wider text-left border-b border-border py-3.5 px-3.5">Usability</th>
                  <th className="text-xs uppercase text-muted-foreground tracking-wider text-left border-b border-border py-3.5 px-3.5">Innovation</th>
                  <th className="text-xs uppercase text-muted-foreground tracking-wider text-left border-b border-border py-3.5 px-3.5">Community</th>
                  <th className="text-xs uppercase text-muted-foreground tracking-wider text-left border-b border-border py-3.5 px-3.5">Overall</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">Alex Chen</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">Unity Developer</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">8</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">9</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">9</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">9</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border font-bold">8.75</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">Sarah Johnson</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">Game Designer</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">9</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">8</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">8</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">9</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border font-bold">8.50</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">Mike Rodriguez</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">Tech Lead</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">8</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">9</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">9</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border">8</td>
                  <td className="py-4.5 px-3.5 border-b border-dashed border-border font-bold">8.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Explore Carousel Section */}
        <section ref={carouselRef2} className="wrap sp-xl carousel" id="explore">
          <div className="subtle">Collections</div>
          <h2 className="title" style={{fontSize: 'clamp(40px,6vw,72px)'}}>
            Explore more great collections.
          </h2>

          <div className="viewport">
            <div 
              ref={carouselRef}
              className="rail"
              style={{ transform: `translateX(-${getTransformOffset()}px)` }}
            >
              <article className="tile">
                <div className="thumb relative overflow-hidden" style={{display: 'block'}}>
                  <img 
                    src="/img/ui-system.jpg" 
                    alt="UI Components Collection" 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider">UI COMPONENTS</span>
                  </div>
                </div>
                <div className="meta">
                  <strong>User Interface Components</strong>
                </div>
              </article>
              <article className="tile">
                <div className="thumb relative overflow-hidden" style={{display: 'block'}}>
                  <img 
                    src="/img/gamesystem.jpg" 
                    alt="Game Systems Collection" 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider">GAME SYSTEMS</span>
                  </div>
                </div>
                <div className="meta">
                  <strong>Game Logic Systems</strong>
                </div>
              </article>
              <article className="tile">
                <div className="thumb relative overflow-hidden" style={{display: 'block'}}>
                  <img 
                    src="/img/tools.jpg" 
                    alt="Development Tools Collection" 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider">TOOLS</span>
                  </div>
                </div>
                <div className="meta">
                  <strong>Development Tools</strong>
                </div>
              </article>
              <article className="tile">
                <div className="thumb relative overflow-hidden" style={{display: 'block'}}>
                  <img 
                    src="/img/shaders.jpg" 
                    alt="Visual Effects Collection" 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider">SHADERS</span>
                  </div>
                </div>
                <div className="meta">
                  <strong>Visual Effects</strong>
                </div>
              </article>
              <article className="tile">
                <div className="thumb relative overflow-hidden" style={{display: 'block'}}>
                  <img 
                    src="/img/community.jpg" 
                    alt="Community Collection" 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider">COMMUNITY</span>
                  </div>
                </div>
                <div className="meta">
                  <strong>Community Resources</strong>
                </div>
              </article>
              <article className="tile">
                <div className="thumb relative overflow-hidden" style={{display: 'block'}}>
                  <img 
                    src="/img/physics.jpg" 
                    alt="Physics Collection" 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider">PHYSICS</span>
                  </div>
                </div>
                <div className="meta">
                  <strong>Physics Systems</strong>
                </div>
              </article>
            </div>
          </div>

          {/* Carousel controls - always visible with disabled state */}
          <div className="car-buttons">
            <button
              onClick={() => scrollCarousel('left')}
              disabled={!canScrollLeft}
              className={`car-button ${!canScrollLeft ? 'disabled' : ''}`}
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              disabled={!canScrollRight}
              className={`car-button ${!canScrollRight ? 'disabled' : ''}`}
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

    </main>
  )
}