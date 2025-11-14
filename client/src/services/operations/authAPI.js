import { toast } from "react-hot-toast";

import { setLoading, setSignupData, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {
  VERIFYMAIL_API,
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const otp = response.data.otp;

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function setSignupInfo(signupData) {
  return (dispatch) => {
    dispatch(setSignupData(signupData));
  };
}

export function verifyOtp(otp, navigate) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Verifying OTP...");
    dispatch(setLoading(true));
    const { signupData } = getState().auth;

    try {
      const verifyRes = await apiConnector("POST", VERIFYMAIL_API, {
        email: signupData.email,
        otp,
      });

      if (!verifyRes.data.success) {
        throw new Error(verifyRes.data.message);
      }

      const response = await apiConnector("POST", SIGNUP_API, {
        ...signupData,
        otp,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successfully");
      navigate("/login");
    } catch (error) {
      consoleconsole.log("SIGNUP ERROR: ", error);
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        LOGIN_API,
        {
          email,
          password,
        },
        // {
        //   withCredentials: true,
        // }
      );

      // console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const { token, user } = response.data;
      //   dispatch(setProgress(100))
      dispatch(setToken(token));
      toast.success("Login Successful");

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(token));
      navigate("/dashboard/my-profile");
    } catch (error) {
      //   dispatch(setProgress(100))
      console.log("LOGIN API ERROR............", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      // console.log("RESETPASSTOKEN RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      // console.log("RESETPASSTOKEN ERROR............", error);
      toast.error("Failed To Send Reset Email");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESET PASSWORD RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      // setresetComplete(true)
    } catch (error) {
      // console.log("RESET PASSWORD ERROR............", error);
      toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

export function forgotPassword(email, setEmailSent) {
  return async (dispatch) => {
    // const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      // console.log("FORGOTPASSWORD RESPONSE............", response);

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.error("FORGOTPASSWORD ERROR............", error);
    }
    // toast.dismiss(toastId)
    dispatch(setLoading(false));
  };
}
