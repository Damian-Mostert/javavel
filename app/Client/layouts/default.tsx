import "../styles/global.scss";
import Footer from "../components/footer";
import NavBar from "../components/navbar";

export default function DefaultLayout({ Children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <Children />
      <Footer />
    </>
  );
}
