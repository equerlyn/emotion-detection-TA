import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center gap-y-4">
      <div className="text-xl font-semibold raisin-black">Oops! The page you are looking for does not exist.</div>
      <button className="text-blue-700" onClick={()=>navigate("/")}>
        Go back
      </button>
    </div>
  );
};
  
export default ErrorPage;
  