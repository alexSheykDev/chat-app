import { useContext, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [registerError, setRegisterError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { setUser } = useContext(AuthContext)

    const updateRegisterInfo = (info) => {
        setRegisterInfo(info)
    }

    const registerUser = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        setRegisterError(null)

        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo))

        if(response.error){
            setIsLoading(false)
            return setRegisterError(response.message)
            
        }
        
        localStorage.setItem('User', JSON.stringify(response))
        setUser(response)
        setIsLoading(false)
    }
    
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={registerUser}>
        <label htmlFor="name">
          User Name
          <input id="name" name="name" placeholder="Name" value={registerInfo.name}  onChange={(event) => updateRegisterInfo({...registerInfo, name: event.target.value})}/>
        </label>
        <label htmlFor="email">
          User Email
          <input id="email" name="email" placeholder="Email" value={registerInfo.email}  onChange={(event) => updateRegisterInfo({...registerInfo, email: event.target.value})}/>
        </label>
        <label htmlFor="password">
          Password
          <input id="password" name="password" placeholder="Password" value={registerInfo.password}  onChange={(event) => updateRegisterInfo({...registerInfo, password: event.target.value})}/>
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
