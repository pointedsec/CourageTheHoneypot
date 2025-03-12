import LoginForm from "../components/LoginForm";
import "../css/login.css";
export default function Home() {
  return (
    <div className="lines">
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <LoginForm />
    </div>
  );
}
