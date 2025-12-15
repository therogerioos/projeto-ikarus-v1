import * as React from "react";
import { X, MessageCircleWarning, TriangleAlert, CircleCheckBig, CircleX } from "lucide-react";
import clsx from "clsx";

type CalloutVariant = "info" | "success" | "warning" | "danger";

interface CalloutProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  variant?: CalloutVariant;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<CalloutVariant, {
  ring: string;
  bg: string;
  border: string;
  text: string;
  iconBg: string;
  icon: React.ReactNode;
}> = {
  info: {
    ring: "ring-blue-600",
    bg: "bg-blue-400",
    border: "border-blue-300",
    text: "text-blue-100",
    iconBg: "bg-blue-200",
    icon: <MessageCircleWarning className="h-8 w-8 text-blue-700" />,
  },
  success: {
    ring: "ring-green-600",
    bg: "bg-green-400",
    border: "border-green-300",
    text: "text-green-900",
    iconBg: "bg-green-200",
    icon: <CircleCheckBig className="h-8 w-8" />,
  },
  warning: {
    ring: "ring-yellow-600",
    bg: "bg-yellow-400",
    border: "border-yellow-300",
    text: "text-yellow-900",
    iconBg: "bg-yellow-200",
    icon: <TriangleAlert className="h-8 w-8" />,
  },
  danger: {
    ring: "ring-red-600",
    bg: "bg-red-400",
    border: "border-red-300",
    text: "text-red-900",
    iconBg: "bg-red-200",
    icon: <CircleX className="h-8 w-8" />,
  },
};

export const Callout: React.FC<CalloutProps> = ({
  id,
  title,
  children,
  variant = "info",
  dismissible = false,
  onClose,
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      id={id}
      className={clsx(
        "flex items-start gap-3 rounded-xl border p-4 ring-1 transition-all duration-200",
        styles.bg,
        styles.border,
        styles.text,
        styles.ring,
        className
      )}
    >
        <div className={clsx("p-2 rounded-full", styles.iconBg)}>
          {styles.icon}
        </div>
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <div className="text-sm">{children}</div>
      </div>

      {dismissible && (
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
