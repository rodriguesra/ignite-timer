import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { CyclesContextProvider } from "./contexts/CyclesContext.tsx";
import Router from "./Router.tsx";
import { GlobalStyles } from "./styles/global.ts";
import defaultTheme from "./styles/themes/default.ts";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyles />
    </ThemeProvider>
  );
}

export default App;
