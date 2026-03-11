import "../styles/global.scss";
import Footer from "../components/footer";

export default function AuthLayout({ Children }: LayoutProps) {
  return (
    <>
      <Children />
      <Footer />
    </>
  );
}
