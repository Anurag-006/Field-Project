import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<string>("password");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { employeeId: username, password };
    axios.post("http://localhost:4500/user/login", data, {
      withCredentials: true, 
    }
    )
      .then((response) => {
        if (response.status !== 200) {
          console.error("Login failed:", response.data);
          return;
        }
        console.log("Login successful:", response.data);
        const { user } = response.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
          navigate("/");
        }
        else if (user.role === "user") {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const togglePassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Login</h1>

        <form className="flex flex-col space-y-4 w-80" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Employee ID"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="relative">
            <input
              type={passwordType}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-2 pr-10 rounded border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300"
            >
              {passwordType === "password" ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 
              text-white font-bold rounded transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;