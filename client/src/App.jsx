import './App.css'
import GalleryPage from './pages/GalleryPage'
import { createTheme, ThemeProvider } from '@mui/material/styles';


// Add theming here
const theme = createTheme({
  // typography: {
  //  "fontFamily": "Reenie Beanie"
  // }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{width: 500}}>
        <GalleryPage></GalleryPage>
      </div>
    </ThemeProvider>     
  )
}

export default App
