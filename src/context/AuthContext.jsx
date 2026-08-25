import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check admin role
    const checkAdmin = async (user) => {
        if (!user) {
            setIsAdmin(false);
            return;
        }

        const { data } = await supabase
            .from("admin_users")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

        setIsAdmin(!!data);
    };

    useEffect(() => {
        // Current session
        const loadSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const currentUser = session?.user ?? null;

            setUser(currentUser);
            await checkAdmin(currentUser);
            setLoading(false);
        };

        loadSession();

        // Auth listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;

            setUser(currentUser);
            await checkAdmin(currentUser);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const register = async (email, password) => {
        return await supabase.auth.signUp({ email, password });
    };

    const logout = async () => {
        setIsAdmin(false);
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);