import { supabase } from '@/integrations/supabase/client';

export async function createTestUser() {
    try {
        console.log('Création d\'un utilisateur de test...');

        
        const { data, error } = await supabase.auth.signUp({
            email: 'admin@gmail.com', 
            password: 'password123', 
            options: {
                emailRedirectTo: undefined, 
                data: {
                    first_name: 'Test',
                    last_name: 'User',
                    full_name: 'Test User'
                }
            }
        });

        if (error) {
            console.error('❌ Erreur lors de la création:', error);
            return { success: false, error };
        }

        console.log('Utilisateur créé:', data);

    
        if (data.user && !data.user.email_confirmed_at) {
            console.log('⚠️ L\'utilisateur doit confirmer son email');
            console.log('💡 Pour tester rapidement, va dans Supabase Dashboard > Auth > Users et clique "Confirm user"');
        }

        return { success: true, data };
    } catch (error) {
        console.error('❌ Erreur:', error);
        return { success: false, error };
    }
}

export async function testLogin() {
    try {
        console.log('🔄 Test de connexion...');

        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@gmail.com',
            password: 'password123'
        });

        if (error) {
            console.error('❌ Erreur de connexion:', error);
            return { success: false, error };
        }

        console.log('✅ Connexion réussie:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Erreur:', error);
        return { success: false, error };
    }
}


export async function checkSupabaseConfig() {
    console.log('Vérification de la configuration Supabase...');

    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    console.log('URL:', url);
    console.log('Key (premiers caractères):', key?.substring(0, 20) + '...');

    if (!url || !key) {
        console.error('Variables d\'environnement manquantes');
        return false;
    }

    try {

        const { data, error } = await supabase.auth.getSession();
        console.log('Connexion Supabase OK');
        return true;
    } catch (error) {
        console.error('Erreur de connexion Supabase:', error);
        return false;
    }
}
