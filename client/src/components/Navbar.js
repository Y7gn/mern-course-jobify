import Wrapper from "../assets/wrappers/Navbar.js";
import { FaAlignLeft, FaUserCircle,FaCaretDown } from 'react-icons/fa';
import { useAppContext } from "../context/appContext";
import Logo from './Logo';
import { useState } from "react";
export const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false)
    const {ToggleSideBar,logoutUser,user} = useAppContext()
  return (
    <Wrapper>
        <div className="nav-center">
            <button 
            type="button"
            className="toggle-btn"
            onClick={ToggleSideBar}>
            <FaAlignLeft/>
            </button>
        <div>
            <Logo/>
            <h3 className="logo-text">dashboard</h3>
        </div>

        <div className="btn-container">
            <button type="button"
            className="btn"
            onClick={()=> setShowLogout(!showLogout)}>
                <FaUserCircle/>
                {user?.name} 
                {/* if user exist grap name */}
                <FaCaretDown/>
            </button>

            <div className={showLogout ? "dropdown show-dropdown":"dropdown"}>
                <button 
                type="button" 
                className="dropdown-btn"
                onClick={logoutUser}
                >
                    logout
                </button>
            </div>
            </div>
        </div>
    </Wrapper>
  )
}


export default Navbar; 