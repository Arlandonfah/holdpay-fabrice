import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PaymentStatus = "pending" | "paid" | "delivered" | "released" | "disputed";

interface StatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "En attente",
    variant: "secondary" as const,
    className: "bg-status-pending text-status-pending-foreground"
  },
  paid: {
    label: "Payé",
    variant: "default" as const,
    className: "bg-status-paid text-status-paid-foreground"
  },
  delivered: {
    label: "Livré",
    variant: "secondary" as const,
    className: "bg-status-delivered text-status-delivered-foreground"
  },
  released: {
    label: "Finalisé",
    variant: "default" as const,
    className: "bg-status-released text-status-released-foreground"
  },
  disputed: {
    label: "Litige",
    variant: "destructive" as const,
    className: "bg-status-disputed text-status-disputed-foreground"
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}