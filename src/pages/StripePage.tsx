import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function StripePage() {
    const { themeColors } = useTheme();
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-black"
            style={{ background: themeColors.bg }}
        >
            <div className="max-w-4xl w-full space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/pro')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Pro
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: themeColors.text }}>
                        Processing Payment...
                    </h1>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="Stripe Payment Processor"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="text-center opacity-50 text-sm">
                    <p style={{ color: themeColors.textSecondary }}>
                        Please do not refresh the page while your transaction is being processed.
                    </p>
                </div>
            </div>
        </div>
    );
}
