import Layout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Components/login";
import Profile from "./Components/Profile";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout/>}>
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
