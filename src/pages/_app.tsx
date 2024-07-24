import { store } from "@/store";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Outlet />
      <Toaster />
    </Provider>
  );
};

export default App;
