import React from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Avatar } from '../cp/Avatar';


export const RequestPanel: React.FC = () => {
    const { accessRequests, respondToAccessRequest, respondToProjectAccessRequest } = useSession();

    if (accessRequests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[#8b9bb4] p-4 text-center">
                <div className="mb-2">No pending requests</div>
                <div className="text-sm opacity-60">Users requesting access will appear here</div>
            </div>
        );
    }

    return (
        <div className="h-full bg-[#1e2330] flex flex-col">
            <div className="p-4 border-b border-[#2b3245]">
                <h2 className="text-[#e2e8f0] font-medium">Access Requests</h2>
                <div className="text-xs text-[#8b9bb4] mt-1">{accessRequests.length} pending</div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ overscrollBehavior: 'none' }}>
                {accessRequests.map((req) => {
                    const isProjectRequest = 'requester_id' in req;
                    const requesterName = isProjectRequest ? req.requester_name : req.user_name;
                    const requesterEmail = isProjectRequest ? req.requester_email : undefined;
                    const requesterHandle = !isProjectRequest ? req.handle : undefined;
                    const key = isProjectRequest ? req.request_id : req.user_id;

                    return (
                        <div key={key} className="bg-[#2b3245] rounded-lg p-3 border border-[#3e4761]">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-start gap-3">
                                    <Avatar name={requesterName} size="sm" />
                                    <div>
                                        <div className="text-[#e2e8f0] font-medium">{requesterName}</div>
                                        {requesterEmail && <div className="text-xs text-[#8b9bb4]">{requesterEmail}</div>}
                                        {requesterHandle && <div className="text-xs text-[#8b9bb4]">@{requesterHandle}</div>}
                                        {isProjectRequest && <div className="text-[10px] text-[#6b7b94] mt-1">Project: {req.project_name}</div>}
                                    </div>
                                </div>
                                <div className="text-[10px] text-[#6b7b94]">
                                    {'timestamp' in req
                                        ? new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : req.created_at
                                            ? new Date(req.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : 'Now'}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() =>
                                        isProjectRequest
                                            ? respondToProjectAccessRequest(req.project_id, req.requester_id, true)
                                            : respondToAccessRequest(req.user_id, true)
                                    }
                                    className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                                >
                                    <span>Accept</span>
                                </button>
                                <button
                                    onClick={() =>
                                        isProjectRequest
                                            ? respondToProjectAccessRequest(req.project_id, req.requester_id, false)
                                            : respondToAccessRequest(req.user_id, false)
                                    }
                                    className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                                >
                                    <span>Deny</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
