import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    // 1. Add Loading State (Default to true so we wait for the check)
    const [isLoading, setIsLoading] = useState(true);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/getUserData',{
                withCredentials:true,
                Authorization: `Bearer ${localStorage.getItem("token")}`
            });
            console.log(data)
            if (data.success) {
                setIsLoggedIn(true);
                setUserData(data.userData);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            // If error (e.g. 401 unauthorized), ensure we are logged out
            setIsLoggedIn(false);
            setUserData(null);
            // Optional: Only toast on specific errors, not just "not logged in"
            // toast.error(error.response?.data?.message || "Failed to fetch user Data");
        } finally {
            // 2. Whether success or fail, stop loading
            setIsLoading(false);
        }
    }

    // 3. Run the check once when the app mounts (reloads)
    useEffect(() => {
        getUserData();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        isLoading // Export this
    }
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}