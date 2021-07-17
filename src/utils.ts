import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export const errorToast = (message: string) => {
  return toast.error(message, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const warningToast = (message: string) => {
  return toast.warning(message, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const successToast = (message: string) => {
  return toast.success(message, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const capitalized = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const noop = () => {};
