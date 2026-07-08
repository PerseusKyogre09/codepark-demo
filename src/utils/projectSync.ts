export type ProjectLifecycleEventType =
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'collaborator_added'
  | 'collaborator_removed'
  | 'access_approved'
  | 'access_revoked'
  | 'ownership_transferred'
  | 'project_invalidated'
  | 'project_permissions_updated'

export interface ProjectLifecycleEventDetail {
  project_id?: string
  reason?: string
  invalidateAll?: boolean
}

export const PROJECT_LIFECYCLE_EVENT = 'project-lifecycle-event'
export const PROJECT_CACHE_INVALIDATED_EVENT = 'project-cache-invalidated'
export const PROJECT_ACCESS_REVOKED_EVENT = 'project-access-revoked'
export const PROJECT_ACCESS_APPROVED_EVENT = 'project-access-approved'
export const PROJECT_DELETED_EVENT = 'project-deleted'
export const PROJECT_INVALIDATED_EVENT = 'project-invalidated'

export function emitProjectLifecycleEvent(
  type: ProjectLifecycleEventType,
  detail: ProjectLifecycleEventDetail = {},
) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(PROJECT_LIFECYCLE_EVENT, { detail: { type, ...detail } }))

  if (
    type === 'project_deleted' ||
    type === 'project_invalidated' ||
    type === 'project_updated' ||
    type === 'project_created' ||
    type === 'collaborator_added' ||
    type === 'collaborator_removed' ||
    type === 'access_approved' ||
    type === 'access_revoked' ||
    type === 'ownership_transferred' ||
    type === 'project_permissions_updated'
  ) {
    window.dispatchEvent(new CustomEvent(PROJECT_CACHE_INVALIDATED_EVENT, { detail: { type, ...detail } }))
  }

  if (type === 'project_deleted') {
    window.dispatchEvent(new CustomEvent(PROJECT_DELETED_EVENT, { detail }))
  }
  if (type === 'project_invalidated') {
    window.dispatchEvent(new CustomEvent(PROJECT_INVALIDATED_EVENT, { detail }))
  }
  if (type === 'access_revoked') {
    window.dispatchEvent(new CustomEvent(PROJECT_ACCESS_REVOKED_EVENT, { detail }))
  }
  if (type === 'access_approved') {
    window.dispatchEvent(new CustomEvent(PROJECT_ACCESS_APPROVED_EVENT, { detail }))
  }
}

export function clearProjectScopedCaches(projectId?: string | null) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return

  const keysToRemove: string[] = []
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (!key) continue
    if (key.startsWith('codepark_active_file_')) {
      if (!projectId || key.includes(projectId)) keysToRemove.push(key)
      continue
    }
    if (key.startsWith('codepark_opened_files_')) {
      if (!projectId || key.includes(projectId)) keysToRemove.push(key)
      continue
    }
    if (key.startsWith('codepark_cursor_')) {
      if (!projectId || key.includes(projectId)) keysToRemove.push(key)
      continue
    }
    if (projectId && key.includes(projectId)) {
      keysToRemove.push(key)
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key)
  }
}
