import Wrapper from "../assets/wrappers/BigSidebar.js";
import { useAppContext } from "../context/appContext.js";
import Logo from "./Logo.js";
import NavLinks from "./NavLinks.js";

export const BigSideBar = () => {
  const { showSideBar } = useAppContext() //ToggleSideBar
  return (
    <Wrapper>
        <div className={showSideBar? 'sidebar-container show-sidebar':'sidebar-container'}>
          <div className="content">
            <header>
              <Logo/>

            </header>
            {/* ToggleSideBar={ToggleSideBar}  to close after click*/}
            <NavLinks />
          </div>
        </div>

    </Wrapper>
  )
}
export default BigSideBar;