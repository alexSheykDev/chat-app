import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext)

  return (
    <div className="bg-slate-800 mb-4 h-14">
      <div className="flex justify-between items-center h-full">
        <Link to="/" className="text-white text-lg text-bold">
          <h2>ChatApp</h2>
        </Link>
        {user && <h3 className="text-orange-500">Logged in as {user?.name}</h3>}
        <div>
          <div className="flex gap-x-3">
            {!user && <Link className="text-white" to="/login">
              Login
            </Link>}
            {!user && <Link className="text-white" to="/register">
              Register
            </Link>}
            {user && <Link className="text-white" onClick={() => logoutUser()} to="/login">
              Logout
            </Link>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
