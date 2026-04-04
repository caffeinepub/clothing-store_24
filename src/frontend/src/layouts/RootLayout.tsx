import { Outlet } from "@tanstack/react-router";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
