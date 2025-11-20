import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Login({ close }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      },{withCredentials:true});

      if (response.data.success) {
        toast.success(response.data.message || "Login Successful!");
        localStorage.setItem("token",response.data.data.token);
        localStorage.setItem("userId",response.data.data.id);
        setIsLoggedIn(true);
        await getUserData();
        navigate("/home");
        close();
      } else {
        toast.error(response.data.message || "Login Failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="bg-white/1 backdrop-blur-lg border border-orange-500 rounded-lg shadow-lg w-80 px-6 py-8 flex flex-col gap-4 font-sans relative">
      <button
        onClick={close}
        className="absolute top-3 right-3 text-orange-500 hover:text-orange-700 text-3xl font-bold"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-3xl font-semibold mb-2 text-center text-white">
        Login
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.email ? "border-red-500" : "border-orange-500"
          } bg-transparent text-white placeholder-white`}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.password ? "border-red-500" : "border-orange-500"
          } bg-transparent text-white placeholder-white`}
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Forgot Password Link */}
        <div className="text-right text-sm underline">
          <Link
            to="/forgot-password"
            className="text-orange-400 hover:text-orange-500"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 text-white rounded-md py-2 hover:bg-orange-600 transition disabled:opacity-50 font-bold"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
