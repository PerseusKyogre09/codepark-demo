import { useAuth } from '../contexts/AuthContext';

export const useSubscription = () => {
    const { user } = useAuth();

    const isPro = user?.subscription === 'pro';
    const isFree = user?.subscription === 'free' || !user?.subscription;

    return {
        isPro,
        isFree,
        subscription: user?.subscription || 'free',
    };
};
