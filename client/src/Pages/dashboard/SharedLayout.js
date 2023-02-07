import { Outlet, Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/SharedLayout';
import { 
    Navbar,
    BigSideBar,
    SmallSideBar,
} from '../../components'

const SharedLayout = () => {
    return (
        <Wrapper>
            <main className='dashboard'>
                <SmallSideBar/>
                {/* only with 992 px`` */}
                <BigSideBar/> 
                <div>
                    <Navbar/>
                    <div className="dashboard-pages">
                        <Outlet /> 
                    </div>
                </div>
            </main>
        </Wrapper>
    )
}

export default SharedLayout;