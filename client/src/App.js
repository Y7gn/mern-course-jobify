// import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Error, Register, ProtectedRoute } from "./Pages";
import { 
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
  AddJob } from './Pages/dashboard';

// const Button = styled.button`
//   background: red;
//   color: white;
//   font-size: 1rem;
// `

// const ButtonSecond = styled.button`
//   background: blue;
//   color: white;
//   font-size: 1rem;
// `

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
        <ProtectedRoute>
          <SharedLayout/>
        </ProtectedRoute>
        }>
          <Route index element={<Stats/>}/>
          <Route path='/all-jobs' element={<AllJobs/>}/>
          <Route path='/add-job' element={<AddJob/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
        <Route path="/register" element={<Register />}/>
        <Route path="/landing" element={<Landing />}/>
        <Route path="*" element={<Error />}/>
      </Routes>
    </BrowserRouter>
    // <div>
    //   <Button>Click me</Button>
    //   <ButtonSecond>Click me</ButtonSecond>
    //   <h1>Jobify</h1>
    //   <Landing/>
    // </div>
  );
}


export default App;
