import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/pages/Layout";
import Contact from "./components/pages/Contact";
import Home from "./components/pages/Home";
import LoginReg from "./components/pages/auth/LoginReg";
import SendPasswordResetEmail from "./components/pages/auth/SendPasswordResetEmail";
import ResetPassword from "./components/pages/auth/ResetPassword";
import Dashboard from "./components/pages/Dashboard";
import FileUpload from "./components/pages/FileUpload";
import FileList from "./components/pages/FileList";
import ChangePassword from "./components/pages/auth/ChangePassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<LoginReg />} />
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path="reset-password/:id/:token" element={<ResetPassword />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/dashboard/fileupload" element={<FileUpload />} />
          <Route path="/dashboard/filelist" element={<FileList />} />
          <Route path="/dashboard/changepassword" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
