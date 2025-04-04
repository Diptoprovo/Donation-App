import React from "react"
import { ToastContainer, toast } from "react-toastify"
import NavBar from "./components/NavBar"
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ItemUpload from "./pages/ItemUpload";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";

import { Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
      <ToastContainer />
      <div>
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/item-upload" element={<ItemUpload />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
