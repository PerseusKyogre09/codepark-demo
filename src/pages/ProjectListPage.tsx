import { useState, useEffect } from "react";
import { Search, Plus, SlidersHorizontal, Edit2, Copy, Download, Trash2, Play, X, UserMinus, Shield, Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "../components/cp/ProjectCard";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../services/api";
import { toast } from "sonner";
import { Avatar } from "../components/cp/Avatar";
import RepositorySelectModal from "../components/RepositorySelectModal";
import GitHubImportModal from "../components/GitHubImportModal";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../components/ui/context-menu";
import { PROJECT_CACHE_INVALIDATED_EVENT } from "../utils/projectSync";

interface Collaborator {
  uid: string;
  name: string;
  email?: string;
  role: "editor" | "viewer" | "owner";
}

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?.uid;
  const {
    projects,
    listProjects,
    openProject,
    renameProject,
    deleteProject,
    copyProject,
    downloadProject,
  } = useProjects();
  
  const [query, setQuery] = useState("");

  // Modals state
  const [activeModal, setActiveModal] = useState<"rename" | "delete" | "details" | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // Pinned projects state
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [isRepoSelectOpen, setIsRepoSelectOpen] = useState(false);
  const [isGitHubImportOpen, setIsGitHubImportOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setPinnedIds(user.pinned_projects || []);
    }
  }, [user]);

  const togglePin = async (projectId: string) => {
    if (!uid) return;
    let next: string[];
    const isCurrentlyPinned = pinnedIds.includes(projectId);
    if (isCurrentlyPinned) {
      next = pinnedIds.filter((id) => id !== projectId);
    } else {
      next = [...pinnedIds, projectId];
    }
    
    try {
      await apiClient.updatePinnedProjects(next);
      setPinnedIds(next);
      toast.success(isCurrentlyPinned ? "Project unpinned" : "Project pinned");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update pinned projects");
    }
  };
  
  // Form input states
  const [renameInput, setRenameInput] = useState("");
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [detailsName, setDetailsName] = useState("");
  const [detailsBio, setDetailsBio] = useState("");
  const [detailsAutoScan, setDetailsAutoScan] = useState(true);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);

  useEffect(() => {
    listProjects();
  }, [listProjects]);

  useEffect(() => {
    const handleProjectInvalidation = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string }>).detail;
      if (detail?.project_id && selectedProject?.id === detail.project_id) {
        setActiveModal(null);
        setSelectedProject(null);
        setCollaborators([]);
      }
      void listProjects({ silent: true });
    };

    window.addEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectInvalidation);
    return () => window.removeEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleProjectInvalidation);
  }, [listProjects, selectedProject?.id]);

  const handleResume = async (projectId: string) => {
    const sessionInfo = await openProject(projectId);
    if (sessionInfo) {
      navigate(`/project/${projectId}/editor?session=${encodeURIComponent(sessionInfo.session_id)}`);
    }
  };

  const handleFork = async (projectId: string) => {
    await copyProject(projectId);
  };

  const openRenameModal = (project: any) => {
    setSelectedProject(project);
    setRenameInput(project.name);
    setActiveModal("rename");
  };

  const submitRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameInput.trim() || renameInput.trim() === selectedProject.name) {
      setActiveModal(null);
      return;
    }
    await renameProject(selectedProject.id, renameInput.trim());
    setActiveModal(null);
  };

  const openDeleteModal = (project: any) => {
    setSelectedProject(project);
    setDeleteConfirmInput("");
    setActiveModal("delete");
  };

  const submitDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmInput !== selectedProject.name) {
      toast.error("Project name does not match!");
      return;
    }
    await deleteProject(selectedProject.id);
    setActiveModal(null);
  };

  const openDetailsModal = async (project: any) => {
    setSelectedProject(project);
    setDetailsName(project.name);
    setDetailsBio(project.description || "");
    setDetailsAutoScan(project.context_base_auto_scan !== false);
    setActiveModal("details");
    setLoadingCollaborators(true);
    try {
      const collabs = await apiClient.getProjectCollaborators(project.id);
      setCollaborators(collabs);
    } catch (err) {
      console.error("Failed to load collaborators", err);
      toast.error("Failed to load collaborators");
    } finally {
      setLoadingCollaborators(false);
    }
  };

  const handleUpdateRole = async (uid: string, newRole: "editor" | "viewer") => {
    try {
      const res = await apiClient.updateProjectCollaboratorRole(selectedProject.id, uid, newRole);
      if (res.success) {
        setCollaborators((prev) =>
          prev.map((c) => (c.uid === uid ? { ...c, role: newRole } : c))
        );
        toast.success("Collaborator role updated");
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const handleRemoveCollaborator = async (uid: string) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) return;
    try {
      const success = await apiClient.deleteProjectCollaborator(selectedProject.id, uid);
      if (success) {
        setCollaborators((prev) => prev.filter((c) => c.uid !== uid));
        toast.success("Collaborator removed");
      } else {
        toast.error("Failed to remove collaborator");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove collaborator");
    }
  };

  const submitDetailsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameChanged = detailsName.trim() !== selectedProject.name;
    const bioChanged = detailsBio.trim() !== (selectedProject.description || "");
    if (nameChanged || bioChanged) {
      await renameProject(selectedProject.id, detailsName.trim(), detailsBio.trim());
    }
    try {
      await apiClient.updateProjectSettings(selectedProject.id, { context_base_auto_scan: detailsAutoScan });
      listProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project settings");
    }
    toast.success("Details saved successfully");
    setActiveModal(null);
  };

  const adaptedProjects = projects.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    language: "TypeScript",
    branch: "main",
    lastActive: new Date(p.updated_at).toLocaleDateString(),
    collaborators: 1,
    tags: ["web"],
    role: p.role,
  }));

  const filtered = adaptedProjects.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.tags || []).some((t) => t && typeof t === 'string' && t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <h1
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Projects
        </h1>
        <button
          onClick={() => navigate("/projects/create")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus size={14} />
          New Project
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Search and filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <SlidersHorizontal size={13} />
            Filter
          </button>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-sm">
              No projects match "{query}".
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <ContextMenu key={p.id}>
                <ContextMenuTrigger>
                  <ProjectCard
                    project={p}
                    onClick={() => handleResume(p.id)}
                    pinned={pinnedIds.includes(p.id)}
                  />
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48 bg-card border border-border p-1 rounded-md shadow-md">
                  <ContextMenuItem
                    onClick={() => handleResume(p.id)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded cursor-pointer transition-colors"
                  >
                    <Play size={13} />
                    Resume Session
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => togglePin(p.id)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded cursor-pointer transition-colors"
                  >
                    <Pin size={13} />
                    {pinnedIds.includes(p.id) ? "Unpin Project" : "Pin Project"}
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => openDetailsModal(p)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded cursor-pointer transition-colors"
                  >
                    <Edit2 size={13} />
                    Edit Details
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => openRenameModal(p)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded cursor-pointer transition-colors"
                  >
                    <Edit2 size={13} />
                    Rename Project
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleFork(p.id)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded cursor-pointer transition-colors"
                  >
                    <Copy size={13} />
                    Fork Project
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => downloadProject(p.id, p.name)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded cursor-pointer transition-colors"
                  >
                    <Download size={13} />
                    Download ZIP
                  </ContextMenuItem>
                  <ContextMenuSeparator className="h-px bg-border my-1" />
                  <ContextMenuItem
                    onClick={() => openDeleteModal(p)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-error hover:bg-error/10 hover:text-error rounded cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete Project
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}

        {/* Import row */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {projects.length} projects · {adaptedProjects.filter((p) => p.collaborators > 1).length} with teammates
          </p>
          <button
            onClick={() => setIsRepoSelectOpen(true)}
            className="text-sm text-primary hover:underline focus-visible:outline-none"
          >
            Import a repository
          </button>
        </div>
      </div>

      {/* Rename Modal */}
      {activeModal === "rename" && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-6">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Rename Project
            </h2>
            <form onSubmit={submitRename} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === "delete" && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-6">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="text-base font-semibold text-error mb-2 animate-pulse" style={{ fontFamily: "var(--font-display)" }}>
              Delete Project
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              This action is permanent and cannot be undone. To confirm deletion, type <strong className="text-foreground">{selectedProject.name}</strong> below.
            </p>
            <form onSubmit={submitDelete} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Type project name here"
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-error"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteConfirmInput !== selectedProject.name}
                  className="px-4 py-2 bg-error text-error-foreground rounded-md text-sm font-medium hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Permanently
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Details Comprehensive Modal */}
      {activeModal === "details" && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold text-foreground mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Project Settings: {selectedProject.name}
            </h2>

            <form onSubmit={submitDetailsSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Project Name</label>
                    <input
                      type="text"
                      value={detailsName}
                      onChange={(e) => setDetailsName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Project Bio / Description</label>
                    <textarea
                      value={detailsBio}
                      onChange={(e) => setDetailsBio(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">ContextBase Auto-Scanning</label>
                    <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-background">
                      <div>
                        <div className="text-xs font-medium text-foreground">Enable automatic indexing</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Index imports and symbols on file changes</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDetailsAutoScan(!detailsAutoScan)}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          detailsAutoScan ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow transition ${
                            detailsAutoScan ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Project Image (coming soon)</label>
                    <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30">
                      <span className="text-xs text-muted-foreground">Image Upload Disabled</span>
                    </div>
                  </div>
                </div>

                {/* Collaborators list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Collaborators</h3>
                  
                  {loadingCollaborators ? (
                    <p className="text-xs text-muted-foreground">Loading collaborators...</p>
                  ) : collaborators.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No collaborators added yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                      {collaborators.map((collab) => (
                        <div key={collab.uid} className="flex items-center justify-between gap-3 p-2 bg-muted/40 rounded-lg border border-border/60">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar name={collab.name} size="sm" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{collab.name}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{collab.role}</p>
                            </div>
                          </div>
                          
                          {collab.role !== "owner" && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <select
                                value={collab.role}
                                onChange={(e) => handleUpdateRole(collab.uid, e.target.value as any)}
                                className="bg-background border border-border text-[10px] text-foreground rounded py-1 px-1.5 outline-none"
                              >
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleRemoveCollaborator(collab.uid)}
                                className="p-1 hover:bg-error/10 text-muted-foreground hover:text-error rounded transition-colors"
                                title="Remove collaborator"
                              >
                                <UserMinus size={13} />
                              </button>
                            </div>
                          )}
                          {collab.role === "owner" && (
                            <span className="flex items-center gap-1 text-[10px] text-primary font-medium mr-1.5">
                              <Shield size={11} />
                              Owner
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <RepositorySelectModal
        isOpen={isRepoSelectOpen}
        onClose={() => setIsRepoSelectOpen(false)}
        onSelectGitHub={() => {
          setIsRepoSelectOpen(false);
          setIsGitHubImportOpen(true);
        }}
      />

      <GitHubImportModal
        isOpen={isGitHubImportOpen}
        onClose={() => setIsGitHubImportOpen(false)}
        onImportSuccess={(projectId) => {
          listProjects();
          handleResume(projectId);
        }}
      />
    </div>
  );
}
