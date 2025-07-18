import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../client";



export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState();
    const [isSessionChecked, setIsSessionChecked] = useState(false);

    useEffect(() => {
        // Check if there's a session on component mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(() => session ?? null);
            setIsSessionChecked(() => true);
        });

        // Set up an event listener for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(() => session ?? null);
        });

        // Clean up the listener on unmount
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    if (!isSessionChecked) {
        return <div>Loading...</div>
    } else {
        return (
            <>{session ? children : <Navigate to="/login" />}</>
        )
    }

}
