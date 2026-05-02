import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function MainContent({ children }) {
  const { dark } = useTheme();
  return (
    <div className={dark ? "dark" : ""}>
      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default function MainLayout({ children }) {
  return (
    <ThemeProvider>
      <MainContent>{children}</MainContent>
    </ThemeProvider>
  );
}
