import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  status: 'draft' | 'sent' | 'paid' | 'delivered' | 'released' | 'disputed';
  className?: string;
}

const statusStyles = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800", 
  paid: "bg-green-100 text-green-800",
  delivered: "bg-yellow-100 text-yellow-800",
  released: "bg-emerald-100 text-emerald-800",
  disputed: "bg-red-100 text-red-800"
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "text-sm font-medium rounded-full px-3 py-1",
        statusStyles[status],
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}