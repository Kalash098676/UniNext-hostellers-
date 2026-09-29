import { createContext , useContext , useState , useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({children}){
     const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
const stored = localStorage.getItem('user');
   if(stored){
    setUser(JSON.parse(stored))
   }
   setLoading(false);

  },[])

  const login = (data) =>{
    localStorage.setItem('user' ,JSON.stringify(data));
    setUser(data);

  }

  const logout = () =>{
    localStorage.removeItem('user')
    setUser(null)
  }

  return(
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
  )

}

export function useAuth() {
    return useContext(AuthContext)
}