import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
    userName: string;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any; data?: any }>;
    signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: any; data?: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
