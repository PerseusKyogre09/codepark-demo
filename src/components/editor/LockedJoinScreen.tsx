import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, ArrowLeft } from 'lucide-react';

interface LockedJoinScreenProps {
    sessionId?: string | null;
}

export const LockedJoinScreen: React.FC<LockedJoinScreenProps> = ({ sessionId: propSessionId }) => {
    const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
    const sessionId = propSessionId || paramSessionId;
    const { requestAccess } = useSession();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hasRequested, setHasRequested] = useState(false);

    // If no session ID, something is wrong
    if (!sessionId) return null;

    const handleRequestAccess = () => {
        requestAccess(sessionId);
        setHasRequested(true);
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0f111a] text-[#e2e8f0]">
            <div className="bg-[#1e2330] p-8 rounded-xl border border-[#2b3245] max-w-md w-full text-center shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#ef4444]/10 p-4 rounded-full">
                        <Lock className="w-12 h-12 text-[#ef4444]" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2">Session Locked</h1>
                <p className="text-[#8b9bb4] mb-8">
                    This session has been locked by the owner. New users cannot join without approval.
                </p>

                {user ? (
                    <div className="space-y-4">
                        {!hasRequested ? (
                            <button
                                onClick={handleRequestAccess}
                                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-lg transition-colors"
                            >
                                Request Access
                            </button>
                        ) : (
                            <div className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] py-3 rounded-lg font-medium">
                                Request Sent! Wait for approval.
                            </div>
                        )}

                        <p className="text-xs text-[#6b7b94]">
                            The owner will be notified of your request.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-[#2b3245] p-4 rounded-lg border border-[#3e4761] text-sm text-[#a0aec0]">
                            Please sign in to request access to this session.
                        </div>
                        <button
                            onClick={() => navigate('/login', { state: { from: `/session/${sessionId}` } })}
                            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-[#2b3245]">
                    <button
                        onClick={handleGoBack}
                        className="text-[#8b9bb4] hover:text-white flex items-center justify-center gap-2 mx-auto text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
