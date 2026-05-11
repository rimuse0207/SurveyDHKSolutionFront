import { Provider } from "react-redux";
import AppRoutes from "./Routes";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Router } from "react-router-dom";
import store, { persistor } from "./Store";
import { theme } from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <BrowserRouter>
            <div className="App">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
