import Layout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Components/login";
import Profile from "./Components/Profile";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Toaster position="top-right "/>
          <Routes>
            <Route path="" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
