import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({children , allowedRoles}) => {
    const{user,loading} = useAuth();
    
    console.log("ProtectedRoute:", { loading, user: user?.email, role: user?.role });
    
    if(loading){
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E]">
                <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
            </div>
        );
    }
    
    if(!user){
        console.log("No user, redirecting to login");
        return <Navigate to="/login"/>;
    }
    
    if(allowedRoles && !allowedRoles.includes(user.role)){
        console.log("Role not allowed:", user.role);
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute