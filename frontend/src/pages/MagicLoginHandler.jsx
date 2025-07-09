import { useEffect, Fragment } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/PrivateRoutes";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MagicLoginHandler = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");
  const navigate = useNavigate();
  // const { login } = useAuth();

  //console.log("ttttttttt token :::",token , "rollll ", role) ;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          toast.error("فشلت عملية التحقق ,حاول مره أخرى");
          throw new Error("Failed to verify token");
        }

        const data = await res.json();

        // console.log("sssss data ", data);
        // data.token =token;

        //console.log("emmmm" ,data.user.id);

        if (data.user.role === "admin") {
          navigate(`/ResetPasswordAdmin`, {
            state: {
              token: data.token,
              role: data.user.role,
              userId: data.user.id,
            },
          });
        } else if (data.user.role === "employee") {
          navigate(`/ResetPasswordEmployee`, {
            state: {
              token: data.token,
              role: data.user.role,
              userId: data.user.id,
            },
          });
        }



        

        // else navigate("/");
      } catch (error) {
        console.log("Magic login failed:", error);
        navigate("/");
      }
    };

    if (token) {
      verifyToken();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <Fragment>
      <ToastContainer position="middle-right" autoClose={7000} />
      <p className="text-center mt-5">...جاري التحقق من الدخول</p>;
    </Fragment>
  );
};

export default MagicLoginHandler;
