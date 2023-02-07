import main from '../assets/images/main-alternative.svg'
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';
import { Link, Navigate } from 'react-router-dom';
import React from 'react';
import { useAppContext } from '../context/appContext';

const Landing = () => {
  const {user} = useAppContext()
  return (
    <React.Fragment>
      {user && <Navigate to="/"/>}
    <Wrapper>
      <nav>
        <Logo/>
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>job <span>tracking</span> app</h1>
        <p>
        I'm baby bushwick green juice echo park raw denim 
        chartreuse hashtag kombucha brunch pop-up. 
        Affogato cray master cleanse thundercats lo-fi pitchfork gochujang. 
        Polaroid twee helvetica hella chillwave ramps master cleanse 
        truffaut photo booth bushwick listicle. 
        </p>
        <Link to="/register" className="btn btn-hero">
          Login/Register
        </Link>
      </div>

      <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
    </React.Fragment>
  )
}
export default Landing

// rafce component