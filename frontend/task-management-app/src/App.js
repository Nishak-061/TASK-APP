import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Cards from "./components/Cards/Cards"
import Layout from "./components/Layout/Layout";
import Setting from "./components/Set/Setting";
import Analytics from "./components/Analytics/Analytics";
import PublicTaskView from "./components/Public Task Folder/PublicTaskView";


function App() {
  return (
<Router>
  <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    
     {/* Routes with persistent sidebar */}
     <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} /> {/* Default to dashboard */}
          <Route path="cards" element={<Cards />} /> {/* Nested route for Cards */}
          <Route path="setting" element={<Setting />} /> {/* Nested route for Settings */}
          <Route path="analytics" element={<Analytics />} /> {/* Nested route for Settings */}
        </Route>
        <Route path="/tasks/:id/public" element={<PublicTaskView />} /> {/* Public task view route */}
  </Routes>
</Router>
  );
}

export default App;
