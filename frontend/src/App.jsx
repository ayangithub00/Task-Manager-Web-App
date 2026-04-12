import { Routes, Route, } from "react-router-dom";

import Login from "./Pages /login";
import Signup from "./Pages /signup";
import Dashboard from "./Pages /dashboard";
import ProjectDetail from "./Pages /projectdetail";
import Navbar from "./Components/navbar";
import CreateProject from "./Pages /createproject";
import EditProject from "./Pages /EditProject";


function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />}  />
      <Route path="/project/:id" element={<ProjectDetail/>} />
      <Route path="/create-project" element={<CreateProject/>} />
      <Route path="/edit-project/:id" element={<EditProject />} />
    </Routes>
    </>
    
  
  );
}

export default App;