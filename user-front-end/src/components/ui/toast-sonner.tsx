import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface MyToastProps {
  type?: ToastType;
  message: string;
}

export const MyToast = ({ type = "info", message }: MyToastProps) => {
  const styles = {
    success: { backgroundColor: "#28a745", color: "white" },
    error: { backgroundColor: "#dc3545", color: "white" },
    info: { backgroundColor: "#007bff", color: "white" },
    warning: { backgroundColor: "#ffc107", color: "black" },
    default: { backgroundColor: "#343a40", color: "white" },
  };

  switch (type) {
    case "success":
        return toast.success(message, { style: styles.success });
    case "error":
        return toast.error(message, { style: styles.error });
    case "warning":
        return toast.warning(message, { style: styles.warning });
    case "info":
        return toast.info(message, { style: styles.info });
    default:
        return toast(message, { style: styles.default });
  }
};
