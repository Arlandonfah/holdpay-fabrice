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
            if (!user?.email) {
                return;
            }


            const { data, error } = await supabase
                .from('users')
                .select('id, email, firstName, lastName')
                .eq('email', user.email)
                .single();

            if (error || !data) {
                console.log('Profil utilisateur non trouvé dans la table users, utilisation des métadonnées auth');
                setUserProfile({
                    id: userId,
                    email: user.email,
                    firstName: user.user_metadata?.firstName,
                    lastName: user.user_metadata?.lastName,
                    fullName:
                        user.user_metadata?.full_name ||
                        (user.user_metadata?.firstName && user.user_metadata?.lastName
                            ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
                            : user.email.split('@')[0])
                });
                return;
            }

            setUserProfile({
                id: String(data.id),
                email: data.email,
                firstName: (data as any).firstName ?? undefined,
                lastName: (data as any).lastName ?? undefined,
                fullName:
                    ((data as any).firstName && (data as any).lastName
                        ? `${(data as any).firstName} ${(data as any).lastName}`
                        : (data as any).firstName || (data as any).lastName || data.email.split('@')[0])
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            if (user?.email) {
                setUserProfile({
                    id: userId,
                    email: user.email,
                    firstName: user.user_metadata?.firstName,
                    lastName: user.user_metadata?.lastName,
                    fullName:
                        user.user_metadata?.full_name ||
                        (user.user_metadata?.firstName && user.user_metadata?.lastName
                            ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
                            : user.email.split('@')[0])
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
            const cleanedEmail = email
                .trim()
                .replace(/^["'“”]+|["'“”]+$/g, "");
            const { data, error } = await supabase.auth.signInWithPassword({
                email: cleanedEmail,
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
            const cleanedEmail = email
                .trim()
                .replace(/^["'“”]+|["'“”]+$/g, "");
            console.log('EMAIL AVANT SIGNUP:', {
                raw: email,
                cleaned: cleanedEmail,
                json: JSON.stringify(cleanedEmail),
            });

            const { data, error } = await supabase.auth.signUp({
                email: cleanedEmail,
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

            // Si l'inscription réussit, création de profil dans la table users

            if (data.user) {
                try {
                    await supabase
                        .from('users')
                        .insert([
                            {

                                email: email,
                                firstName: firstName,
                                lastName: lastName,

                            }
                        ]);
                } catch (profileError) {
                    console.log('Erreur lors de la création du profil (table users peut ne pas exister ou RLS):', profileError);
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
