import React from 'react';

interface PDFViewerProps {
    projectId: string;
    filePath: string;
    sessionId?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ projectId, filePath, sessionId }) => {
    const src = `/api/projects/${projectId}/files/${encodeURIComponent(filePath)}?session_id=${sessionId || ''}`;

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col">
            <object
                data={src}
                type="application/pdf"
                className="w-full h-full"
            >
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                        Unable to display PDF directly. <a href={src} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Download</a> or open in new tab.
                    </p>
                </div>
            </object>
        </div>
    );
};
