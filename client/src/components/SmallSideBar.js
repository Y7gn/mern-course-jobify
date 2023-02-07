import Wrapper from '../assets/wrappers/SmallSidebar.js'
import { FaTimes } from 'react-icons/fa';
import Logo from './Logo';
import { useAppContext } from '../context/appContext.js';
import NavLinks from './NavLinks.js';

export const SmallSideBar = () => {
    const { showSideBar, ToggleSideBar } = useAppContext();
  return (
    <Wrapper>
        <div className={
            showSideBar ? "sidebar-container show-sidebar" : "sidebar-container"
        }>
            <div className="content">
                <button 
                type='button'
                className="close-btn" 
                onClick={ToggleSideBar}>
                    <FaTimes/>
                </button>
                <header>
                    <Logo/>
                </header>

                <NavLinks ToggleSideBar={ToggleSideBar}/>
            </div>
        </div>
    </Wrapper>
  )
}

export default SmallSideBar;
