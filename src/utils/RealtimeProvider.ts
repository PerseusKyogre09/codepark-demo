import * as Y from 'yjs';
import { Observable } from 'lib0/observable';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';
import type { RealtimeSocket } from '../services/realtime';

export class RealtimeProvider extends Observable<any> {
    public static activeProviders = new Set<RealtimeProvider>();
    public providerId: string;
    private doc: Y.Doc;
    private socket: RealtimeSocket;
    private sessionId: string;
    private canEdit: boolean;
    public activeEpoch: number;
    public awareness: Awareness;
    private boundHandleYjsUpdate: ((data: { update: string }) => void) | null = null;
    private boundHandleAwarenessUpdate: ((data: { update: string }) => void) | null = null;
    private boundHandleDocUpdate: ((update: Uint8Array, origin: any) => void) | null = null;
    private boundHandleAwarenessChange: ((event: any, origin: any) => void) | null = null;
    private boundHandleEpochChanged: ((data: { epoch: number; branch: string }) => void) | null = null;
    private boundHandleEpochMismatch: ((data: { expected_epoch: number; received_epoch: number; branch: string }) => void) | null = null;
    public isDestroyed = false;
    private isInBindingTransition = false;
    private deferredYjsUpdates: string[] = [];
    private deferredAwarenessUpdates: string[] = [];
    private rafId: number | null = null;
    private offlineDocUpdates: Uint8Array[] = [];
    private boundHandleConnect: (() => void) | null = null;
    public creationTimestamp: number;

    constructor(socket: RealtimeSocket, sessionId: string, doc: Y.Doc, canEdit: boolean = true, initialEpoch: number = 1) {
        super();
        this.providerId = `prov_${Math.random().toString(36).slice(2, 10)}`;
        this.doc = doc;
        this.socket = socket;
        this.sessionId = sessionId;
        this.canEdit = canEdit;
        this.activeEpoch = initialEpoch;
        this.awareness = new Awareness(this.doc);
        this.creationTimestamp = Date.now();

        RealtimeProvider.activeProviders.add(this);
        if (typeof window !== 'undefined') {
            (window as any).__activeProviders = ((window as any).__activeProviders || 0) + 1;
        }

        console.log('[PROVIDER_CREATE]', { providerId: this.providerId, sessionId: this.sessionId });
        console.log('[ACTIVE_PROVIDERS]', {
            count: typeof window !== 'undefined' ? (window as any).__activeProviders : RealtimeProvider.activeProviders.size,
            providerIds: Array.from(RealtimeProvider.activeProviders).map(p => p.providerId)
        });

        console.log('[PROVIDER_MOUNT]', { sessionId });
        console.log(`[RealtimeProvider] 🚀 CONSTRUCTOR - session: ${sessionId}, socket.connected: ${socket.connected}`);

        this.boundHandleYjsUpdate = this.handleYjsUpdate.bind(this);
        this.boundHandleAwarenessUpdate = this.handleAwarenessUpdate.bind(this);
        this.boundHandleDocUpdate = this.handleDocUpdate.bind(this);
        this.boundHandleAwarenessChange = this.handleAwarenessChange.bind(this);
        this.boundHandleEpochChanged = this.handleEpochChanged.bind(this);
        this.boundHandleEpochMismatch = this.handleEpochMismatch.bind(this);

        console.log('[LISTENER_REGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'yjs_update' });
        this.socket.on('yjs_update', this.boundHandleYjsUpdate);

        console.log('[LISTENER_REGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'yjs_awareness' });
        this.socket.on('yjs_awareness', this.boundHandleAwarenessUpdate);

        console.log('[LISTENER_REGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'workspace_epoch_changed' });
        this.socket.on('workspace_epoch_changed', this.boundHandleEpochChanged);

        console.log('[LISTENER_REGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'epoch_mismatch' });
        this.socket.on('epoch_mismatch', this.boundHandleEpochMismatch);

        console.log('[LISTENER_REGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'doc_update' });
        this.doc.on('update', this.boundHandleDocUpdate);

        console.log('[LISTENER_REGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'awareness_update' });
        this.awareness.on('update', this.boundHandleAwarenessChange);

        this.boundHandleConnect = this.handleConnect.bind(this);
        console.log('[LISTENER_REGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'connect' });
        this.socket.on('connect', this.boundHandleConnect);

        this.on('sync', (_isSynced: boolean) => {
        });
    }

    public setCanEdit(canEdit: boolean): void {
        console.log('[RealtimeProvider] setCanEdit updated to:', canEdit);
        this.canEdit = canEdit;
    }

    private handleYjsUpdate(data: { update: string }): void {
        if (this.isDestroyed) {
            console.warn('[RealtimeProvider] Ignoring yjs_update: provider is destroyed');
            return;
        }

        if (this.isInBindingTransition) {
            console.log(`[RealtimeProvider] ⏳ Queueing yjs_update during binding transition for session ${this.sessionId} (queue size: ${this.deferredYjsUpdates.length + 1})`);
            this.deferredYjsUpdates.push(data.update);
            return;
        }

        try {
            console.log('[RealtimeProvider] ✅ RECEIVED yjs_update, length:', data.update?.length, 'session:', this.sessionId);
            const bytes = this.base64ToUint8(data.update);
            const lenBefore = this.doc.getText('').length;
            Y.applyUpdate(this.doc, bytes, this);
            console.log('[YJS_WRITE]', {
              timestamp: new Date().toISOString(),
              clientId: 'remote',
              fileName: 'YJS_DOC_UPDATE',
              functionName: 'handleYjsUpdate',
              triggerSource: 'REMOTE_SYNC',
              lengthBefore: lenBefore,
              lengthAfter: this.doc.getText('').length
            });
            console.log('[RealtimeProvider] ✅ Applied Yjs update successfully (doc length:', this.doc.getText('').length, ')');
        } catch (e) {
            console.error(`[RealtimeProvider] ❌ Failed to apply Yjs update for session ${this.sessionId}:`, e);
        }
    }

    private handleDocUpdate(update: Uint8Array, origin: any): void {
        if (this.isDestroyed) {
            console.warn('[RealtimeProvider] Ignoring doc update: provider is destroyed');
            return;
        }
        if (!this.canEdit) {
            return;
        }
        if (origin === this) {
            // Already applied locally
            return;
        }

        if (this.isInBindingTransition) {
             console.log(`[RealtimeProvider] ⚠️ Deferring outgoing doc update during binding transition for session ${this.sessionId}`);
             return;
        }

        if (!this.socket || !this.socket.connected) {
            console.warn('[RealtimeProvider] Socket not connected, queuing update for when connection resumes');
            this.offlineDocUpdates.push(update);
            return;
        }

        const base64Update = this.uint8ToBase64(update);
        console.log('[RealtimeProvider] Outgoing yjs_update, length:', base64Update.length, 'session:', this.sessionId, 'epoch:', this.activeEpoch);

        this.socket.emit('yjs_update', {
            session_id: this.sessionId,
            update: base64Update,
            epoch: this.activeEpoch
        });
    }

    private handleConnect(): void {
        if (this.isDestroyed) return;
        console.log(`[RealtimeProvider] Socket connected/reconnected for session ${this.sessionId}. Flushing ${this.offlineDocUpdates.length} offline updates.`);
        while (this.offlineDocUpdates.length > 0) {
            const update = this.offlineDocUpdates.shift();
            if (update) {
                const base64Update = this.uint8ToBase64(update);
                this.socket.emit('yjs_update', {
                    session_id: this.sessionId,
                    update: base64Update,
                    epoch: this.activeEpoch
                });
            }
        }
    }

    private handleAwarenessChange(event: any, origin: any): void {
        if (this.isDestroyed) {
            console.warn('[RealtimeProvider] Ignoring awareness change: provider is destroyed');
            return;
        }
        if (origin === 'remote') {
            return;
        }

        if (this.isInBindingTransition) {
            console.log('[RealtimeProvider] ⚠️ Deferring awareness change during binding transition');
            return;
        }

        if (this.rafId !== null) {
            return;
        }
        
        this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            
            if (this.isInBindingTransition || this.isDestroyed) {
                console.log('[RealtimeProvider] Skipping deferred awareness - binding transitioning or destroyed');
                return;
            }
            
            if (!this.socket || !this.socket.connected) {
                console.warn('[RealtimeProvider] Socket not connected, skipping deferred awareness');
                return;
            }

            const { added, updated, removed } = event;
            const awarenessUpdate = encodeAwarenessUpdate(this.awareness, added.concat(updated).concat(removed));
            const base64Update = this.uint8ToBase64(awarenessUpdate);
            console.log('[RealtimeProvider] 📍 Outgoing yjs_awareness (deferred), length:', base64Update.length, 'session:', this.sessionId);

            console.log('[PROVIDER_AWARENESS_EMIT]', { providerId: this.providerId, sessionId: this.sessionId, length: base64Update.length });
            this.socket.emit('yjs_awareness', {
                session_id: this.sessionId,
                update: base64Update
            });
        });
    }

    private handleAwarenessUpdate(data: { update: string }): void {
        if (this.isDestroyed) {
            console.warn('[RealtimeProvider] Ignoring yjs_awareness: provider is destroyed');
            return;
        }

        if (this.isInBindingTransition) {
            console.log('[RealtimeProvider] ⏳ Queueing yjs_awareness during binding transition (length:' + data.update?.length + ')');
            this.deferredAwarenessUpdates.push(data.update);
            return;
        }

        try {
            console.log('[RealtimeProvider] 📍 Applying yjs_awareness, length:', data.update?.length, 'session:', this.sessionId);
            const update = this.base64ToUint8(data.update);
            applyAwarenessUpdate(this.awareness, update, 'remote');
            console.log('[RealtimeProvider] ✅ Awareness applied successfully');
        } catch (e) {
            console.error(`[RealtimeProvider] ❌ Failed to apply awareness update for session ${this.sessionId}:`, e);
        }
    }

    private uint8ToBase64(u8: Uint8Array): string {
        let binary = '';
        const len = u8.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(u8[i]);
        }
        return btoa(binary);
    }

    private base64ToUint8(b64: string): Uint8Array {
        const binaryString = atob(b64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    public setBindingTransition(isTransitioning: boolean): void {
        this.isInBindingTransition = isTransitioning;
        console.log(`[RealtimeProvider] Binding transition: ${isTransitioning ? 'START ⏸️' : 'END ▶️'} for session ${this.sessionId}`);

        if (!isTransitioning) {
            const yCount = this.deferredYjsUpdates.length;
            const aCount = this.deferredAwarenessUpdates.length;
            console.log(`[RealtimeProvider] ⏹️ REPLAYING deferred updates - Yjs: ${yCount}, Awareness: ${aCount}`);

            let processedYjs = 0;
            while (this.deferredYjsUpdates.length > 0) {
                const update = this.deferredYjsUpdates.shift();
                if (update) {
                    processedYjs++;
                    console.log(`[RealtimeProvider] ▶️ REPLAYING deferred yjs_update (${processedYjs}/${yCount})`);
                    this.handleYjsUpdate({ update });
                }
            }

            let processedAware = 0;
            while (this.deferredAwarenessUpdates.length > 0) {
                const update = this.deferredAwarenessUpdates.shift();
                if (update) {
                    processedAware++;
                    console.log(`[RealtimeProvider] ▶️ REPLAYING deferred yjs_awareness (${processedAware}/${aCount})`);
                    this.handleAwarenessUpdate({ update });
                }
            }
            if (yCount > 0 || aCount > 0) {
                console.log(`[RealtimeProvider] ✅ REPLAY COMPLETE - Processed ${processedYjs} Yjs + ${processedAware} Awareness updates`);
            }
        }
    }

    public syncWithHistory(updates: string[]) {
        if (!updates || updates.length === 0) {
            this.emit('sync', [true]);
            return;
        }

        const lenBefore = this.doc.getText('').length;
        Y.transact(this.doc, () => {
            updates.forEach(updateStr => {
                try {
                    const bytes = this.base64ToUint8(updateStr);
                    Y.applyUpdate(this.doc, bytes, this);
                } catch (e) {
                    console.error('Error syncing history update', e);
                }
            });
        });

        console.log('[YJS_WRITE]', {
          timestamp: new Date().toISOString(),
          clientId: 'remote',
          fileName: 'YJS_DOC_UPDATE',
          functionName: 'syncWithHistory',
          triggerSource: 'SESSION_JOIN',
          lengthBefore: lenBefore,
          lengthAfter: this.doc.getText('').length
        });

        this.emit('sync', [true]);
    }

    private handleEpochChanged(data: { epoch: number; branch: string }): void {
        if (this.isDestroyed) return;
        console.log(`[RealtimeProvider] workspace_epoch_changed received: ${data.epoch} (branch: ${data.branch})`);
        this.updateEpoch(data.epoch);
    }

    private handleEpochMismatch(data: { expected_epoch: number; received_epoch: number; branch: string }): void {
        if (this.isDestroyed) return;
        console.warn(`[RealtimeProvider] epoch_mismatch received! Expected: ${data.expected_epoch}, Received: ${data.received_epoch}`);
        this.updateEpoch(data.expected_epoch);
        // Request fresh workspace state
        this.socket.emit('refresh_files', { session_id: this.sessionId });
        this.emit('epoch_mismatch', [data.expected_epoch, data.branch]);
    }

    public updateEpoch(newEpoch: number): void {
        if (this.activeEpoch !== newEpoch) {
            console.warn(`[RealtimeProvider] Epoch updated! Clearing queues. Old: ${this.activeEpoch}, New: ${newEpoch}`);
            this.offlineDocUpdates = [];
            this.deferredYjsUpdates = [];
            this.activeEpoch = newEpoch;
        }
    }

    public destroy() {
        if (this.isDestroyed) {
            console.warn(`[RealtimeProvider] Already destroyed for session ${this.sessionId}`);
            return;
        }

        this.isDestroyed = true;
        RealtimeProvider.activeProviders.delete(this);
        if (typeof window !== 'undefined') {
            (window as any).__activeProviders = Math.max(0, ((window as any).__activeProviders || 1) - 1);
        }

        console.log('[PROVIDER_DESTROY]', { providerId: this.providerId, sessionId: this.sessionId });
        console.log('[ACTIVE_PROVIDERS]', {
            count: typeof window !== 'undefined' ? (window as any).__activeProviders : RealtimeProvider.activeProviders.size,
            providerIds: Array.from(RealtimeProvider.activeProviders).map(p => p.providerId)
        });

        console.log('[PROVIDER_UNMOUNT]', { sessionId: this.sessionId });
        console.log(`[RealtimeProvider] Destroying provider for session ${this.sessionId}`);

        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this.boundHandleYjsUpdate) {
            console.log('[LISTENER_UNREGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'yjs_update' });
            this.socket.off('yjs_update', this.boundHandleYjsUpdate);
        }
        if (this.boundHandleAwarenessUpdate) {
            console.log('[LISTENER_UNREGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'yjs_awareness' });
            this.socket.off('yjs_awareness', this.boundHandleAwarenessUpdate);
        }
        if (this.boundHandleEpochChanged) {
            console.log('[LISTENER_UNREGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'workspace_epoch_changed' });
            this.socket.off('workspace_epoch_changed', this.boundHandleEpochChanged);
        }
        if (this.boundHandleEpochMismatch) {
            console.log('[LISTENER_UNREGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'epoch_mismatch' });
            this.socket.off('epoch_mismatch', this.boundHandleEpochMismatch);
        }
        if (this.boundHandleDocUpdate) {
            console.log('[LISTENER_UNREGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'doc_update' });
            this.doc.off('update', this.boundHandleDocUpdate);
        }
        if (this.boundHandleAwarenessChange) {
            console.log('[LISTENER_UNREGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'awareness_update' });
            this.awareness.off('update', this.boundHandleAwarenessChange);
        }
        if (this.boundHandleConnect) {
            console.log('[LISTENER_UNREGISTER]', { providerId: this.providerId, sessionId: this.sessionId, eventName: 'connect' });
            this.socket.off('connect', this.boundHandleConnect);
        }

        this.boundHandleYjsUpdate = null;
        this.boundHandleAwarenessUpdate = null;
        this.boundHandleEpochChanged = null;
        this.boundHandleEpochMismatch = null;
        this.boundHandleDocUpdate = null;
        this.boundHandleAwarenessChange = null;
        this.boundHandleConnect = null;

        this.awareness.destroy();
        super.destroy();
    }
}

if (typeof window !== 'undefined') {
    (window as any).getActiveProviderSnapshot = () => {
        const snapshot = Array.from(RealtimeProvider.activeProviders).map((p: any) => {
            let listenerCount = 0;
            if (p.boundHandleYjsUpdate) listenerCount++;
            if (p.boundHandleAwarenessUpdate) listenerCount++;
            if (p.boundHandleDocUpdate) listenerCount++;
            if (p.boundHandleAwarenessChange) listenerCount++;
            if (p.boundHandleConnect) listenerCount++;
            return {
                providerId: p.providerId,
                sessionId: p.sessionId,
                destroyed: p.isDestroyed,
                listenerCount,
                creationTimestamp: p.creationTimestamp
            };
        });
        console.log('ACTIVE_PROVIDER_SNAPSHOT', snapshot);
        return snapshot;
    };
}