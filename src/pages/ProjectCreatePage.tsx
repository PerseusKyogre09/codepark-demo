import { useState } from "react";
import { X, Check, ChevronRight, Globe, Lock, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";

type Step = 1 | 2 | 3;

const TEMPLATES = [
  { id: "blank", name: "Blank", desc: "Empty environment. Start from scratch.", icon: "⬜" },
  { id: "node", name: "Node.js", desc: "Express + TypeScript starter.", icon: "🟩" },
  { id: "fullstack", name: "Full-stack", desc: "Next.js + PostgreSQL starter.", icon: "🔷" },
  { id: "rust", name: "Rust", desc: "Cargo workspace with CLI tooling.", icon: "🦀" },
  { id: "python", name: "Python", desc: "FastAPI + virtual environment.", icon: "🐍" },
  { id: "go", name: "Go", desc: "Go module with standard layout.", icon: "🔵" },
];

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const { createProject, renameProject, loading } = useProjects();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("blank");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [nameError, setNameError] = useState("");

  const validateAndNext = () => {
    if (!name.trim()) { setNameError("Project name is required."); return; }
    if (!/^[a-z0-9-]+$/.test(name)) { setNameError("Lowercase letters, numbers, and hyphens only."); return; }
    setNameError("");
    setStep(2);
  };

  const handleCreate = async () => {
    try {
      const result = await createProject();
      if (result) {
        let sessionId = result.session_id;
        if (name && name.trim()) {
          await renameProject(result.project_id, name.trim(), description.trim());
        }
        if (!sessionId) {
          console.error("Project created without runtime session_id; refusing to open editor.");
          return;
        }
        navigate(`/project/${result.project_id}/editor?session=${encodeURIComponent(sessionId)}`);
      }
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const steps = [
    { n: 1, label: "Name" },
    { n: 2, label: "Template" },
    { n: 3, label: "Settings" },
  ];

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Create a project
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </header>

      <div className="max-w-xl mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Step indicator */}
        <nav className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`flex items-center justify-center size-7 rounded-full text-xs font-semibold transition-colors ${
                step > s.n ? "bg-primary text-primary-foreground" :
                step === s.n ? "border-2 border-primary text-primary" :
                "border border-border text-muted-foreground"
              }`}>
                {step > s.n ? <Check size={13} /> : s.n}
              </div>
              <span className={`text-sm ${step === s.n ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-border ml-1" />}
            </div>
          ))}
        </nav>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
                Name your project
              </h2>
              <p className="text-sm text-muted-foreground">You can always rename it later.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Project name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value.toLowerCase().replace(/\s/g, "-")); setNameError(""); }}
                placeholder="my-project"
                className={`w-full px-3 py-2.5 bg-background border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring font-mono placeholder:font-sans placeholder:text-muted-foreground ${
                  nameError ? "border-error" : "border-border"
                }`}
                autoFocus
              />
              {nameError ? (
                <p className="text-xs text-error mt-1.5">{nameError}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Lowercase letters, numbers, and hyphens only.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What are you building?"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed placeholder:text-muted-foreground"
              />
            </div>

            <button
              onClick={validateAndNext}
              disabled={!name}
              className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Template */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
                Choose a template
              </h2>
              <p className="text-sm text-muted-foreground">Your environment will be pre-configured and ready to run.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    template === t.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  <span className="text-xl leading-none mt-0.5">{t.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
                Visibility &amp; team
              </h2>
              <p className="text-sm text-muted-foreground">Who can see and contribute to this project?</p>
            </div>

            <div className="space-y-2">
              {[
                { id: "private" as const, label: "Private", desc: "Only you and invited teammates can access this project.", icon: <Lock size={15} className="text-muted-foreground" /> },
                { id: "public" as const, label: "Public", desc: "Anyone with the link can view. Useful for open source.", icon: <Globe size={15} className="text-muted-foreground" /> },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVisibility(v.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    visibility === v.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="mt-0.5">{v.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
                  </div>
                  {visibility === v.id && <Check size={15} className="text-primary ml-auto mt-0.5 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted/50 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-muted-foreground" />
                <p className="text-xs font-semibold text-foreground">Project summary</p>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground font-mono">{name || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Template</span>
                  <span className="text-foreground capitalize">{template}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="text-foreground capitalize">{visibility}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create project"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
