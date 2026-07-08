import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '../services/api'
import type { Project, SaveProjectOptions, SessionInfo } from '../types'
import { showErrorToast, showSuccessToast, logError } from '../utils/errorHandling'
import { PROJECT_CACHE_INVALIDATED_EVENT } from '../utils/projectSync'

interface ListProjectsOptions {
  silent?: boolean
}

interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  listProjects: (options?: ListProjectsOptions) => Promise<void>
  saveProject: (options: SaveProjectOptions) => Promise<Project | null>
  createProject: () => Promise<{ project_id: string; session_id: string } | null>
  openProject: (projectId: string) => Promise<SessionInfo | null>
  renameProject: (projectId: string, name: string, description?: string) => Promise<Project | null>
  deleteProject: (projectId: string) => Promise<boolean>
  downloadProject: (projectId: string, projectName?: string) => Promise<boolean>
  copyProject: (projectId: string) => Promise<Project | null>
  clearError: () => void
}

/**
 * Custom hook for managing project operations with loading and error states
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * List all projects for the current user
   */
  const listProjects = useCallback(async (options?: ListProjectsOptions) => {
    const silent = options?.silent === true
    if (!silent) setLoading(true)
    setError(null)
    try {
      const projectList = await apiClient.listProjects()
      setProjects(projectList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects'
      setError(errorMessage)
      logError(err, 'List Projects')
      showErrorToast(err, 'Failed to load projects')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const handleInvalidation = (event: Event) => {
      const detail = (event as CustomEvent<{ project_id?: string; invalidateAll?: boolean }>).detail
      if (detail?.project_id || detail?.invalidateAll || !detail) {
        void listProjects({ silent: true })
      }
    }

    window.addEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleInvalidation as EventListener)
    return () => window.removeEventListener(PROJECT_CACHE_INVALIDATED_EVENT, handleInvalidation as EventListener)
  }, [listProjects])

  /**
   * Save a project with autosave support
   * Returns the saved project or null on error
   */
  const saveProject = useCallback(async (options: SaveProjectOptions): Promise<Project | null> => {
    setLoading(true)
    setError(null)
    try {
      const savedProject = await apiClient.saveProject(options)
      void listProjects({ silent: true })
      
      // Show success message only for manual saves (not autosave)
      if (!options.autosave) {
        showSuccessToast('Project saved successfully')
      }
      
      return savedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save project'
      setError(errorMessage)
      logError(err, 'Save Project')
      showErrorToast(err, 'Failed to save project')
      return null
    } finally {
      setLoading(false)
    }
  }, [listProjects])

  /**
   * Create a new project and associated session immediately
   */
  const createProject = useCallback(async (): Promise<{ project_id: string; session_id: string } | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.createProject()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
      setError(errorMessage)
      logError(err, 'Create Project')
      showErrorToast(err, 'Failed to create project')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Open an existing project and create a new session
   * Returns session info or null on error
   */
  const openProject = useCallback(async (projectId: string): Promise<SessionInfo | null> => {
    setLoading(true)
    setError(null)
    try {
      const sessionInfo = await apiClient.openProject(projectId)
      return sessionInfo
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open project'
      setError(errorMessage)
      logError(err, 'Open Project')
      showErrorToast(err, 'Failed to open project')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Rename a project with optimistic updates
   * Returns the updated project or null on error
   */
  const renameProject = useCallback(async (projectId: string, name: string, description?: string): Promise<Project | null> => {
    setLoading(true)
    setError(null)
    try {
      const updatedProject = await apiClient.renameProject(projectId, name, description) as any
      void listProjects({ silent: true })
      showSuccessToast('Project details updated successfully')
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project details'
      setError(errorMessage)
      logError(err, 'Rename/Update Project')
      showErrorToast(err, 'Failed to update project details')
      return null
    } finally {
      setLoading(false)
    }
  }, [listProjects])

  /**
   * Delete a project with confirmation
   * Returns true on success, false on error
   */
  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await apiClient.deleteProject(projectId)
      void listProjects({ silent: true })
      showSuccessToast('Project deleted successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project'
      setError(errorMessage)
      logError(err, 'Delete Project')
      showErrorToast(err, 'Failed to delete project')
      return false
    } finally {
      setLoading(false)
    }
  }, [listProjects])

  /**
   * Download a project as a ZIP file
   * Returns true on success, false on error
   */
  const downloadProject = useCallback(async (projectId: string, projectName?: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const blob = await apiClient.downloadProject(projectId)
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Use provided name or find project name from list
      const name = projectName || projects.find(p => p.id === projectId)?.name || 'project'
      const safeName = name.replace(/[^a-zA-Z0-9-_]/g, '_')
      link.download = `${safeName}.zip`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up blob URL
      window.URL.revokeObjectURL(url)
      
      showSuccessToast('Project downloaded successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download project'
      setError(errorMessage)
      logError(err, 'Download Project')
      showErrorToast(err, 'Failed to download project')
      return false
    } finally {
      setLoading(false)
    }
  }, [projects])

  /**
   * Copy/duplicate a project
   * Returns the new project or null on error
   */
  const copyProject = useCallback(async (projectId: string): Promise<Project | null> => {
    setLoading(true)
    setError(null)
    try {
      const newProject = await apiClient.copyProject(projectId)
      void listProjects({ silent: true })
      
      showSuccessToast('Project copied successfully')
      return newProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy project'
      setError(errorMessage)
      logError(err, 'Copy Project')
      showErrorToast(err, 'Failed to copy project')
      return null
    } finally {
      setLoading(false)
    }
  }, [listProjects])

  return {
    projects,
    loading,
    error,
    listProjects,
    saveProject,
    createProject,
    openProject,
    renameProject,
    deleteProject,
    downloadProject,
    copyProject,
    clearError,
  }
}
