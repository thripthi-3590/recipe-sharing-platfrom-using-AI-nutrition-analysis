import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext"; // Added
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedRecipes from "./pages/SavedRecipes";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import ChefRoute from "./components/ChefRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageRecipes from "./pages/admin/ManageRecipes";
import ManageComments from "./pages/admin/ManageComments";
import Profile from "./pages/Profile";
import ShoppingList from "./pages/ShoppingList";
import MealPlanner from "./pages/MealPlanner";
import GenerateRecipe from "./pages/GenerateRecipe";
import Feed from "./pages/Feed";
import Collections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
            <Navbar />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <main className="w-full pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
                <Route element={<ChefRoute />}>
                  <Route
                    path="/create-recipe"
                    element={
                      <ProtectedRoute>
                        <CreateRecipe />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route
                  path="/saved-recipes"
                  element={
                    <ProtectedRoute>
                      <SavedRecipes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:id"
                  element={<Profile />}
                />
                <Route
                  path="/shopping-list"
                  element={
                    <ProtectedRoute>
                      <ShoppingList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/meal-planner"
                  element={
                    <ProtectedRoute>
                      <MealPlanner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-generate"
                  element={
                    <ProtectedRoute>
                      <GenerateRecipe />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feed"
                  element={
                    <ProtectedRoute>
                      <Feed />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collections"
                  element={
                    <ProtectedRoute>
                      <Collections />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collections/:id"
                  element={
                    <ProtectedRoute>
                      <CollectionDetails />
                    </ProtectedRoute>
                  }
                />


                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="recipes" element={<ManageRecipes />} />
                  <Route path="comments" element={<ManageComments />} />
                </Route>


              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
