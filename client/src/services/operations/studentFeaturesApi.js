import { apiConnector } from "../apiConnector";
import { studentEndpoints } from "../apis";
import toast from "react-hot-toast";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export async function buyCourse(token,courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Loading...");
  try {
    //load the script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      console.error("Razorpay SDK failed to load");
      return;
    }

    // initiat the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    if(!orderResponse){
        throw new Error(orderResponse?.data?.message);
    }

   // console.log("razorpay key", import.meta.env.VITE_APP_RAZORPAY_KEY);
 
    // options 
    const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY,
        currency: orderResponse.data.message.currency,
        amount: `${orderResponse.data.message.amount}`,
        order_id: orderResponse.data.message.id,
        name:"StudyNotion",
        description:"Thank you for purchasing the course",
        image:rzpLogo,
        order_id: orderResponse.data.message.id,
        prefill: {
            name: `${userDetails.firstName}`,
            email: `${userDetails.email}`
        },
        handler: function(response){
         // console.log("razorpay handler response",response);
            //send successful wala email
            sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token);
            //verifyPayment
            verifyPayment({...response, courses}, token, navigate, dispatch);
        }
    }

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function(response){
        toast.error("oops, payment failed");
       // console.log(responseconsole.error);
    });

  } catch (error) {
   // console.log("PAYMENT API ERROR...", error);
    toast.error("Could not make payment");
  }
  toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response,amount, token) {
    
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    } catch (error) {
        console.log("Payment success email error...", error);
    }
}

// verify payment 
async function verifyPayment(bodyData, token, navigate, dispatch) {
   const toastId = toast.loading("Loading...");
   dispatch(setPaymentLoading(true));
   try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData,{
        Authorization: `Bearer ${token}`,
    })
    // console.log("response in verify payment", response);

    if(!response.data.success){
        throw new Error(response.data.message);
    }
    toast.success("Payment successful, You are added to the ccourse");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
   } catch (error) {
   // console.log("Payment verify error...", error);
    toast.error("Could not verify payment");
   } 
   toast.dismiss(toastId);
   dispatch(setPaymentLoading(false)); 
}
