import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // Récupérer la session actuelle
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Erreur lors de la récupération de la session:', error);
                    return;
                }

                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchUserProfile(session.user.id);
                }
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Écouter les changements d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchUserProfile(session.user.id);
                } else {
                    setUserProfile(null);
                }

                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId: string) => {
        try {
            // Essayer de récupérer le profil depuis la table users
            const { data, error } = await supabase
                .from('users')
                .select('id, email, firstName, lastName')
                .eq('id', userId)
                .single();

            if (error) {
                console.log('Profil utilisateur non trouvé dans la table users, utilisation des données auth');
                // Si pas de profil dans la table users, utiliser les données de auth
                if (user?.email) {
                    setUserProfile({
                        id: userId,
                        email: user.email,
                        fullName: user.user_metadata?.full_name || user.email.split('@')[0]
                    });
                }
                return;
            }

            if (data) {
                setUserProfile({
                    ...data,
                    fullName: data.firstName && data.lastName
                        ? `${data.firstName} ${data.lastName}`
                        : data.firstName || data.lastName || data.email.split('@')[0]
                });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            // Fallback avec les données auth
            if (user?.email) {
                setUserProfile({
                    id: userId,
                    email: user.email,
                    fullName: user.user_metadata?.full_name || user.email.split('@')[0]
                });
            }
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast({
                    title: "Erreur",
                    description: "Erreur lors de la déconnexion",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Déconnexion réussie",
                description: "Vous avez été déconnecté avec succès",
            });

            // Redirection sera gérée par l'état auth
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la déconnexion",
                variant: "destructive",
            });
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast({
                    title: "Erreur de connexion",
                    description: error.message,
                    variant: "destructive",
                });
                return { success: false, error };
            }

            toast({
                title: "Connexion réussie",
                description: "Vous êtes maintenant connecté",
            });

            return { success: true, data };
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la connexion",
                variant: "destructive",
            });
            return { success: false, error };
        }
    };

    const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName
                    }
                }
            });

            if (error) {
                toast({
                    title: "Erreur d'inscription",
                    description: error.message,
                    variant: "destructive",
                });
                return { success: false, error };
            }

            // Si l'inscription réussit, créer le profil dans la table users
            if (data.user) {
                try {
                    await supabase
                        .from('users')
                        .insert([
                            {
                                id: data.user.id,
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
                            }
                        ]);
                } catch (profileError) {
                    console.log('Erreur lors de la création du profil (table users peut ne pas exister):', profileError);
                }
            }

            toast({
                title: "Inscription réussie",
                description: "Vérifiez votre email pour confirmer votre compte",
            });

            return { success: true, data };
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'inscription",
                variant: "destructive",
            });
            return { success: false, error };
        }
    };

    return {
        user,
        userProfile,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        userName: userProfile?.fullName || userProfile?.firstName || user?.email?.split('@')[0] || 'Utilisateur'
    };
}
