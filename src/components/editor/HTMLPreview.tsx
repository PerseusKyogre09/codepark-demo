import { X } from 'lucide-react';

export function HTMLPreview({ content, onClose }: { content: string; onClose: () => void }) {
    return (
        <div className="h-64 border-t bg-white">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
                <span className="text-sm font medium">HTML Preview</span>
                <button onClick={onClose} title="Close Preview" className="text-gray-500 hover:text-gray-700"><X size={16} /></button>
            </div>
            <iframe
                srcDoc={content}
                className="w-full h-full"
                sandbox="allow-scripts"
            />
        </div>
    )
}