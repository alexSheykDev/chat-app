import { useContext, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    })
    const [loginError, setLoginError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { setUser } = useContext(AuthContext)

    const updateLoginInfo = (info) => {
        setLoginInfo(info)
    }

    const loginUser = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        setLoginError(null)

        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo))

        if(response.error){
            setIsLoading(false)
            return setLoginError(response.message)
            
        }
        
        localStorage.setItem('User', JSON.stringify(response))
        setUser(response)
    
    }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={loginUser}>
        <label htmlFor="email">
          User Email
          <input id="email" name="email" placeholder="Email" value={loginInfo.email}  onChange={(event) => updateLoginInfo({...loginInfo, email: event.target.value})} />
        </label>
        <label htmlFor="password">
          Password
          <input id="password" name="password" placeholder="Password" value={loginInfo.password}  onChange={(event) => updateLoginInfo({...loginInfo, password: event.target.value})}/>
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
