import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/LandingPage/Home";
import Signup from "./pages/LandingPage/Signup";
import Login from "./pages/LandingPage/Login";
import About from "./pages/LandingPage/About";
import NotFound from "./pages/NotFound";
import { UserHome, ChatPage, Profile, AddBook, EditBook, BooksPage } from "./pages/User";
import { AdminDashboard } from "./pages/Admin";
import { useAuth } from "./hooks/useAuth";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        <Routes>
          <Route path="*" element={<NotFound />} />
          {/* Admin Dashboard: no header, only for admin */}
          <Route
            path="/admin/dashboard"
            element={
              isAuthenticated && isAdmin ? <AdminDashboard /> : <NotFound />
            }
          />
          {/* User Home: only for authenticated users who are not admin */}
          <Route
            path="/user/home"
            element={
              isAuthenticated && !isAdmin ? (
                <>
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <UserHome />
                  </main>
                </>
              ) : (
                <NotFound />
              )
            }
          />
          {/* User Chat: only for authenticated users who are not admin */}
          <Route
            path="/user/chat"
            element={
              isAuthenticated && !isAdmin ? (
                <ChatPage />
              ) : (
                <NotFound />
              )
            }
          />
          {/* User Profile: only for authenticated users who are not admin */}
          <Route
            path="/user/profile"
            element={
              isAuthenticated && !isAdmin ? (
                <>
                  <Header />
                  <main>
                    <Profile />
                  </main>
                </>
              ) : (
                <NotFound />
              )
            }
          />
          {/* User Books: only for authenticated users who are not admin */}
          <Route
            path="/user/books"
            element={
              isAuthenticated && !isAdmin ? (
                <>
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <BooksPage />
                  </main>
                </>
              ) : (
                <NotFound />
              )
            }
          />
          {/* Add Book: only for authenticated users who are not admin */}
          <Route
            path="/user/books/add"
            element={
              isAuthenticated && !isAdmin ? (
                <>
                  <Header />
                  <main>
                    <AddBook />
                  </main>
                </>
              ) : (
                <NotFound />
              )
            }
          />
          {/* Edit Book: only for authenticated users who are not admin */}
          <Route
            path="/user/books/edit/:bookId"
            element={
              isAuthenticated && !isAdmin ? (
                <>
                  <Header />
                  <main>
                    <EditBook />
                  </main>
                </>
              ) : (
                <NotFound />
              )
            }
          />
          {/* General Home: redirect to user/admin home if authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                isAdmin ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/user/home" replace />
                )
              ) : (
                <>
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <Home />
                  </main>
                </>
              )
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Signup />
                </main>
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Login />
                </main>
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <About />
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
