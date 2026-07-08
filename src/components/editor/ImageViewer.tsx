import React from 'react';

interface ImageViewerProps {
    projectId: string;
    filePath: string;
    sessionId?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ projectId, filePath, sessionId }) => {
    // Construct URL with session_id query param to ensure access
    // Add timestamp to bust browser cache when file content changes
    const src = `/api/projects/${projectId}/files/${encodeURIComponent(filePath)}?session_id=${sessionId || ''}&t=${Date.now()}`;

    return (
        <div className="w-full h-full flex items-center justify-center bg-transparent overflow-auto p-4 select-none" style={{ overscrollBehavior: 'none' }}>
            <img
                src={src}
                alt={filePath}
                className="max-w-full max-h-full object-contain shadow-lg rounded"
                style={{ minWidth: '50px', minHeight: '50px' }}
            />
        </div>
    );
};
