import { ArrowRight, Code2, Users, Zap, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { HeroMockupEditor } from "../components/HeroMockupEditor";

const FEATURES = [
  {
    icon: <Zap size={20} className="text-primary" />,
    title: "Instant Environments",
    description:
      "Your workspace is ready the moment you need it. No installs, no configuration drift — just open a project and start where you left off.",
  },
  {
    icon: <Users size={20} className="text-primary" />,
    title: "Real-time Collaboration",
    description:
      "Code together in the same editor, same terminal, same branch. See your teammates' cursors. Leave a comment on any line.",
  },
  {
    icon: <Code2 size={20} className="text-primary" />,
    title: "ContextBase",
    description:
      "CodePark understands your project, so you don't have to explain it every session. Ask questions about your codebase in plain language.",
  },
];

const STEPS = [
  { n: "1", title: "Create a project", body: "Name it, pick a template, and your environment is ready in seconds." },
  { n: "2", title: "Invite teammates", body: "Share a link. They join your workspace instantly — no setup on their end." },
  { n: "3", title: "Build together", body: "Edit, run, debug, and ship — in the same environment, at the same time." },
];

const TESTIMONIALS = [
  {
    quote: "We replaced three separate tools with CodePark. The team stopped arguing about environment setup and started shipping.",
    name: "Priya Mehta",
    role: "Engineering lead at Wanderlog",
  },
  {
    quote: "The pair programming experience feels like being in the same room. We use it for onboarding and it's changed how quickly new engineers contribute.",
    name: "David Osei",
    role: "Senior engineer, OSS Collective",
  },
];

const PRICING = [
  {
    name: "Personal",
    price: "Free",
    description: "For solo developers and open source projects.",
    features: ["3 active projects", "Community environments", "ContextBase (basic)", "Public devlogs"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Team",
    price: "$18",
    period: "/person/mo",
    description: "For small teams who build together.",
    features: ["Unlimited projects", "Private environments", "Real-time collaboration", "ContextBase (full)", "Private devlogs", "Team profiles"],
    cta: "Start a Team",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with specific requirements.",
    features: ["Everything in Team", "SSO & SCIM", "Audit logs", "Custom environments", "Priority support", "SLA guarantees"],
    cta: "Talk to us",
    highlighted: false,
  },
];

const FAQS = [
  { q: "How is CodePark different from GitHub Codespaces?", a: "CodePark is built around collaboration, not just cloud development. Pair programming, presence indicators, shared terminals, and ContextBase are first-class features — not add-ons. The editor is the workshop; the rest of CodePark is the park." },
  { q: "Do teammates need to sign up to join a session?", a: "To join a session, yes — but inviting them takes a link. Once they have an account, they can be in your environment within a minute." },
  { q: "Where is my data stored?", a: "Environments run in our infrastructure. Your code remains yours. You can connect your own GitHub or GitLab repositories and CodePark syncs back on commit." },
  { q: "Can I use my own editor?", a: "CodePark's built-in editor is VS Code-based and works well for most workflows. Native desktop editor support is on the roadmap." },
  { q: "What is ContextBase?", a: "ContextBase indexes your project — its structure, patterns, dependencies, and history — so you can ask plain-language questions about your codebase and get accurate answers without leaving CodePark." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ─── SVG CONFIGURATION (EDIT SIZES AND POSITIONS HERE) ─────────────────────────────
  // You can edit the size and position coordinates (in pixels or percentages) for 
  // each SVG layer individually for both Mobile and Desktop screens:
  const config = {
    // 1. Overall Bounding Box Container Height
    containerHeightMobile: '280px',
    containerHeightDesktop: '400px',

    // 2. Mountain Scenery (Background Hill, Mug, Clouds)
    sceneryWidthMobile: '550px',
    sceneryWidthDesktop: '1200px',
    sceneryXMobile: '0px',          // Horizontal (left) position
    sceneryXDesktop: '-100px',
    sceneryYMobile: '0px',          // Vertical (bottom) position
    sceneryYDesktop: '0px',

    // 3. Tree (Green Tree on the left)
    treeHeightMobile: '160%',       // Can be in percentage (e.g. '160%') or pixels ('500px')
    treeHeightDesktop: '180%',
    treeXMobile: '-150px',          // Horizontal (left) position (negative cuts it off on left edge)
    treeXDesktop: '-420px',
    treeYMobile: '0px',             // Vertical (bottom) position
    treeYDesktop: '50px',

    // 4. Stick Figure (Parker)
    parkerHeightMobile: '55%',      // Height scale
    parkerHeightDesktop: '60%',
    parkerXMobile: '0px',          // Horizontal (left) position on the hill
    parkerXDesktop: '290px',
    parkerYMobile: '20px',          // Vertical (bottom) position from container base
    parkerYDesktop: '87px',

    // 5. Mockup Editor size and positioning
    editorXMobile: '0px',
    editorXDesktop: '40px',         // Shift editor horizontally (positive = towards right, negative = towards left)
    editorWidthMobile: '100%',
    editorWidthDesktop: '100%',     // Control the width of the editor container
  };
  // ──────────────────────────────────────────────────────────────────────────────────

  // Responsive state logic
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerHeight = isMobile ? config.containerHeightMobile : config.containerHeightDesktop;
  const sceneryWidth = isMobile ? config.sceneryWidthMobile : config.sceneryWidthDesktop;
  const sceneryX = isMobile ? config.sceneryXMobile : config.sceneryXDesktop;
  const sceneryY = isMobile ? config.sceneryYMobile : config.sceneryYDesktop;

  const treeHeight = isMobile ? config.treeHeightMobile : config.treeHeightDesktop;
  const treeX = isMobile ? config.treeXMobile : config.treeXDesktop;
  const treeY = isMobile ? config.treeYMobile : config.treeYDesktop;

  const parkerHeight = isMobile ? config.parkerHeightMobile : config.parkerHeightDesktop;
  const parkerX = isMobile ? config.parkerXMobile : config.parkerXDesktop;
  const parkerY = isMobile ? config.parkerYMobile : config.parkerYDesktop;

  const editorX = isMobile ? config.editorXMobile : config.editorXDesktop;
  const editorWidth = isMobile ? config.editorWidthMobile : config.editorWidthDesktop;

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">

      {/* Hero */}
      <section className="w-full px-4 md:px-8 lg:px-12 xl:px-20 pt-12 md:pt-20 pb-16 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & SVG Illustration */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-8">
            <div className="lg:pl-12 relative z-30">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-none tracking-tight mb-6 text-foreground text-left pt-6"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                Code together.
                <br />
                Everywhere.
                <br />
                <span className="text-primary">Effortlessly.</span>
              </h1>

              <p 
                className="text-base md:text-lg text-muted-foreground mb-8 text-left max-w-lg leading-relaxed"
                style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '1.25rem' }}
              >
                Instant environments, real-time collaboration, and AI that understands your entire codebase.
                <br />
                <span className="font-semibold text-foreground">No setup.</span> Just code.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={handleCTA}
                  className="px-6 py-3 bg-primary text-primary-foreground font-semibold border-2 border-foreground dark:border-white hand-drawn-border hover:bg-primary/95 transition-all text-sm flex items-center gap-2 shadow-[3px_3px_0px_currentColor] dark:shadow-[3px_3px_0px_#fff]"
                >
                  Start Coding Instantly
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleCTA}
                  className="px-6 py-3 border-2 border-foreground dark:border-white text-foreground font-semibold hand-drawn-border hover:bg-muted transition-all text-sm shadow-[3px_3px_0px_currentColor]"
                >
                  See How It Works
                </button>
              </div>

            </div>

            {/* SVG Composition */}
            <div
              className="relative w-full overflow-visible mt-12 z-10"
              style={{ height: containerHeight }}
            >
              {/* Mountain Scenery */}
              <img
                src="/assets/homepage/Scenery.svg"
                alt="Scenery"
                className="absolute object-contain object-left-bottom homepage-svg-invert"
                style={{
                  width: sceneryWidth,
                  left: sceneryX,
                  bottom: sceneryY,
                  maxWidth: 'none'
                }}
              />
              {/* Tree */}
              <img
                src="/assets/homepage/Tree.svg"
                alt="Tree"
                className="absolute w-auto object-contain z-10"
                style={{
                  height: treeHeight,
                  left: treeX,
                  bottom: treeY,
                  maxWidth: 'none'
                }}
              />
              {/* Parker (stick figure) */}
              <img
                src="/assets/homepage/Parker.svg"
                alt="Parker"
                className="absolute w-auto object-contain z-20 homepage-svg-invert"
                style={{
                  height: parkerHeight,
                  left: parkerX,
                  bottom: parkerY,
                  maxWidth: 'none'
                }}
              />
            </div>
          </div>

          {/* Right Column: Custom Mockup Editor */}
          <div
            className="lg:col-span-8 flex flex-col items-center justify-center relative z-30 w-full max-w-none transition-all duration-300"
            style={{
              transform: `translateX(${editorX})`,
              width: editorWidth
            }}
          >
            <HeroMockupEditor />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="text-3xl font-semibold text-foreground mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything your team needs in one place
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Less time on setup. More time on the things that matter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="mb-4 size-9 flex items-center justify-center rounded-md bg-primary/10">
                {f.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="text-center mb-14">
            <h2
              className="text-3xl font-semibold text-foreground mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Three steps to coding together
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div
                  className="size-10 rounded-full border-2 border-primary text-primary font-semibold text-sm flex items-center justify-center mx-auto mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.n}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-muted/40">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="bg-card border border-border rounded-lg p-6"
              >
                <p className="text-foreground leading-relaxed mb-4 text-[15px]">
                  "{t.quote}"
                </p>
                <footer>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border" id="pricing">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="text-center mb-10 md:mb-14">
            <h2
              className="text-3xl font-semibold text-foreground mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Simple, honest pricing
            </h2>
            <p className="text-muted-foreground">Start free. Grow with your team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 flex flex-col ${plan.highlighted
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
                  }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-0.5 self-start mb-3">
                    Most popular
                  </div>
                )}
                <h3 className="font-semibold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {plan.description}
                </p>
                <ul className="flex-1 space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleCTA}
                  className={`w-full py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-muted"
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/40">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="text-center mb-8 md:mb-12">
            <h2
              className="text-3xl font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Questions
            </h2>
          </div>
          <div className="space-y-1">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-left text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  {openFaq === i ? (
                    <ChevronUp size={15} className="text-muted-foreground shrink-0 ml-3" />
                  ) : (
                    <ChevronDown size={15} className="text-muted-foreground shrink-0 ml-3" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 bg-background/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
          <h2
            className="text-2xl font-semibold text-foreground mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to build together?
          </h2>
          <p className="text-muted-foreground mb-7 text-sm">
            Start with a free project. No setup, no installation guides.
          </p>
          <button
            onClick={handleCTA}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring inline-flex items-center gap-2"
          >
            Open Your Workspace
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
