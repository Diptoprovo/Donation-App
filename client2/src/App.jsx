import React, { Suspense, lazy, useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "./components/NavBar"
import { AppProvider } from "./context/AppContext"
import { SocketProvider } from "./context/SocketContext"
import { Route, Routes } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"

// Lazy-loaded components for better performance
const Index = lazy(() => import("./pages/Index"))
const SignIn = lazy(() => import("./pages/SignIn"))
const SignUp = lazy(() => import("./pages/SignUp"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const ItemUpload = lazy(() => import("./pages/ItemUpload"))
const Transactions = lazy(() => import("./pages/Transactions"))
const NotFound = lazy(() => import("./pages/NotFound"))
const NewRequest = lazy(() => import("./pages/NewRequest"))
// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="text-center py-10">
      <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="mb-4">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
  </div>
)

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProvider>
        <SocketProvider>
          <ToastContainer position="top-center" autoClose={3000} />
          <div>
            <NavBar />
          </div>
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<ItemUpload />} />
                <Route path="/newreq" element={<NewRequest />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </SocketProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
