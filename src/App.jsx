import { BrowserRouter } from "react-router-dom";
import { EmployeeProvider } from "./context/EmployeeContext";
import AppRouter from "./router/AppRouter";

/**
 * App Component
 * Root component with BrowserRouter and Context Providers
 * Wraps the entire application with routing and state management
 */
function App() {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <AppRouter />
      </EmployeeProvider>
    </BrowserRouter>
  );
}

export default App;
