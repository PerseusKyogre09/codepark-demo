import React from 'react';
import { useSubscription } from '../hooks/useSubscription';

interface SubscriptionGateProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
    children,
    fallback = null
}) => {
    const { isPro } = useSubscription();

    if (isPro) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
