import { BrowserRouter } from "react-router-dom";
import { EmployeeProvider } from "./context/EmployeeContext";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router/AppRouter";

/**
 * App Component
 * Root component with BrowserRouter and Context Providers
 * Wraps the entire application with routing and state management
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <AppRouter />
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
