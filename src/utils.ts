import Swal from "sweetalert2";

enum ToastIcon {
  INFO = `info`,
  SUCCESS = `success`,
  ERROR = `error`,
  WARNING = `warning`,
  QUESTION = `question`,
}

const getToast = (titleText: string, icon: ToastIcon) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-start",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon,
    titleText,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  return Toast;
};

export const errorToast = (message: string) => {
  const toast = getToast(message, ToastIcon.ERROR);
  toast.fire();
};

export const warningToast = (message: string) => {
  const toast = getToast(message, ToastIcon.WARNING);
  toast.fire();
};

export const successToast = (message: string) => {
  const toast = getToast(message, ToastIcon.SUCCESS);
  toast.fire();
};

export const capitalized = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const arraysAreEqual = (a: any[], b: any[]) => {
  return a.length === b.length && a.every((v, i) => v === b[i]);
};

export const noop = () => {};
