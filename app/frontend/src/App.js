import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Error, Landing, Register, ProtectedRoute } from "./pages";
import "react-toastify/dist/ReactToastify.css";
import {
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
  AddJob,
} from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="/alljobs" element={<AllJobs />} />
          <Route path="AddJob" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/landing" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={1200}
        closeOnClick={true}
      />
    </BrowserRouter>
  );
}

export default App;
