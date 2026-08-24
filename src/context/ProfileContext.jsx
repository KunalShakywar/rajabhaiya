import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            loadProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadProfile = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("dairy_profile")
            .select("*")
            .eq("user_id", user.id)
            .single();

        console.log(data, error);

        setProfile(data);
        setLoading(false);
    };

    return (
        <ProfileContext.Provider value={{ profile, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);