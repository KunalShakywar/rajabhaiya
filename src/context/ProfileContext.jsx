import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { user, isAdmin } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = async () => {
        // Admin doesn't have dairy_profile
        if (!user || isAdmin) {
            setProfile(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("dairy_profile")
                .select("*")
                .eq("user_id", user.id)
                .maybeSingle();

            if (error) {
                console.error("Profile error:", error);
                setProfile(null);
                return;
            }

            setProfile(data || null);

        } catch (error) {
            console.error("Profile error:", error);
            setProfile(null);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [user, isAdmin]);

    return (
        <ProfileContext.Provider
            value={{
                profile,
                loading,
                loadProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);