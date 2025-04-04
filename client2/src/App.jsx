import React from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "./components/NavBar"
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ItemUpload from "./pages/ItemUpload";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";
import { AppProvider } from "./context/AppContext"
import { SocketProvider } from "./context/SocketContext"

import { Route, Routes } from "react-router-dom";

function App() {

  return (
    <AppProvider>
      <SocketProvider>
        <ToastContainer />
        <div>
          <NavBar />
        </div>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<ItemUpload />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </SocketProvider>
    </AppProvider>
  )
}

export default App
