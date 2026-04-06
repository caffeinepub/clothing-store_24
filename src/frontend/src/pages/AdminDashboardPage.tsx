import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Crown,
  IndianRupee,
  Package,
  ShoppingBag,
  Truck,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  type OrderRecord,
  OrderStatus,
  PaymentMethod,
  UserRole,
} from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAdminOrders,
  useIsAdmin,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  [OrderStatus.pending]: {
    bg: "oklch(0.28 0.1 50)",
    text: "oklch(0.9 0.18 60)",
  },
  [OrderStatus.paid]: {
    bg: "oklch(0.22 0.1 150)",
    text: "oklch(0.8 0.15 150)",
  },
  [OrderStatus.shipped]: {
    bg: "oklch(0.22 0.1 220)",
    text: "oklch(0.8 0.12 220)",
  },
  [OrderStatus.delivered]: {
    bg: "oklch(0.22 0.12 295)",
    text: "oklch(0.82 0.16 75)",
  },
};

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderCard({ order, index }: { order: OrderRecord; index: number }) {
  const updateStatus = useUpdateOrderStatus();
  const statusKey = order.status as string;
  const colors = STATUS_COLORS[statusKey] ?? STATUS_COLORS[OrderStatus.pending];
  const totalRupees = Number(order.totalAmount) / 100;
  const paymentLabel =
    order.paymentMethod === PaymentMethod.upi ? "UPI" : "Cash on Delivery";

  function handleStatusChange(newStatus: string) {
    updateStatus.mutate({
      orderId: order.id,
      newStatus: newStatus as OrderStatus,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-xl border p-5 flex flex-col gap-4"
      style={{
        background: "oklch(0.15 0.05 295)",
        borderColor: "oklch(0.28 0.07 295)",
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Package
            className="h-5 w-5"
            style={{ color: "oklch(0.82 0.16 75)" }}
          />
          <div>
            <p
              className="font-bold text-sm"
              style={{ color: "oklch(0.93 0.015 80)" }}
            >
              {order.id}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.6 0.04 80)" }}>
              {formatDate(order.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xl font-bold font-serif"
            style={{ color: "oklch(0.82 0.16 75)" }}
          >
            ₹{totalRupees.toFixed(0)}
          </span>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: colors.bg, color: colors.text }}
          >
            {STATUS_LABELS[statusKey] ?? statusKey}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="border-t"
        style={{ borderColor: "oklch(0.25 0.06 295)" }}
      />

      {/* Customer + Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.65 0.06 75)" }}
          >
            Customer
          </p>
          <p
            className="font-semibold text-sm"
            style={{ color: "oklch(0.93 0.015 80)" }}
          >
            {order.deliveryAddress.fullName}
          </p>
          <p className="text-sm" style={{ color: "oklch(0.75 0.03 80)" }}>
            📞 {order.deliveryAddress.phone}
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(0.6 0.04 80)" }}>
            ID: {order.user.toString().slice(0, 20)}...
          </p>
        </div>
        <div>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.65 0.06 75)" }}
          >
            Delivery Address
          </p>
          <p className="text-sm" style={{ color: "oklch(0.8 0.03 80)" }}>
            {order.deliveryAddress.addressLine1}
            {order.deliveryAddress.addressLine2
              ? `, ${order.deliveryAddress.addressLine2}`
              : ""}
          </p>
          <p className="text-sm" style={{ color: "oklch(0.8 0.03 80)" }}>
            {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
            {order.deliveryAddress.pincode}
          </p>
        </div>
      </div>

      {/* Items */}
      <div>
        <p
          className="text-xs font-bold tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.65 0.06 75)" }}
        >
          Items Ordered
        </p>
        <div className="flex flex-col gap-1">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span style={{ color: "oklch(0.8 0.03 80)" }}>
                {item.productId} × {Number(item.quantity)}
              </span>
              <span style={{ color: "oklch(0.82 0.16 75)" }}>
                ₹
                {(
                  (Number(item.priceAtOrder) / 100) *
                  Number(item.quantity)
                ).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment + Status Update */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <IndianRupee
            className="h-4 w-4"
            style={{ color: "oklch(0.65 0.06 75)" }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "oklch(0.8 0.03 80)" }}
          >
            {paymentLabel}
          </span>
        </div>
        <Select
          value={statusKey}
          onValueChange={handleStatusChange}
          disabled={updateStatus.isPending}
        >
          <SelectTrigger
            className="w-40 text-xs font-bold"
            style={{
              background: "oklch(0.18 0.06 295)",
              borderColor: "oklch(0.32 0.08 295)",
              color: "oklch(0.85 0.05 80)",
            }}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "oklch(0.18 0.06 295)",
              borderColor: "oklch(0.32 0.08 295)",
            }}
          >
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <SelectItem
                key={val}
                value={val}
                className="text-xs font-bold"
                style={{ color: "oklch(0.85 0.05 80)" }}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}

function SetAdminPanel() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [done, setDone] = useState(false);

  const setAdminMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !identity) throw new Error("Not logged in");
      const principal = identity.getPrincipal();
      await actor.assignCallerUserRole(principal, UserRole.admin);
    },
    onSuccess: () => {
      setDone(true);
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      queryClient.refetchQueries({ queryKey: ["isAdmin"] });
    },
  });

  const principalId = identity?.getPrincipal().toString() ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 max-w-md w-full text-center"
      >
        <UserCheck
          className="h-16 w-16"
          style={{ color: "oklch(0.82 0.16 75)" }}
        />
        <h1
          className="font-serif text-3xl font-bold"
          style={{ color: "oklch(0.93 0.015 80)" }}
        >
          Admin Access
        </h1>

        {done ? (
          <div className="flex flex-col items-center gap-4">
            <p
              style={{ color: "oklch(0.8 0.15 150)" }}
              className="font-semibold"
            >
              ✅ Admin set ho gaya! Page reload karein.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="font-bold tracking-widest uppercase px-10 h-12"
              style={{
                background: "oklch(0.78 0.14 75)",
                color: "oklch(0.12 0.04 295)",
                border: "none",
              }}
            >
              Reload Karen
            </Button>
          </div>
        ) : (
          <>
            <p style={{ color: "oklch(0.65 0.04 80)" }} className="text-sm">
              Pehli baar admin access lene ke liye neeche button dabayein.
            </p>
            <div
              className="w-full rounded-lg p-4 text-left"
              style={{
                background: "oklch(0.15 0.05 295)",
                border: "1px solid oklch(0.28 0.07 295)",
              }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.65 0.06 75)" }}
              >
                Aapka Principal ID
              </p>
              <p
                className="text-xs break-all font-mono"
                style={{ color: "oklch(0.75 0.03 80)" }}
              >
                {principalId}
              </p>
            </div>
            <Button
              onClick={() => setAdminMutation.mutate()}
              disabled={setAdminMutation.isPending}
              size="lg"
              className="font-bold tracking-widest uppercase px-10 h-12 w-full"
              style={{
                background: "oklch(0.78 0.14 75)",
                color: "oklch(0.12 0.04 295)",
                border: "none",
              }}
            >
              {setAdminMutation.isPending ? "Setting..." : "Mujhe Admin Banao"}
            </Button>
            {setAdminMutation.isError && (
              <p className="text-sm" style={{ color: "oklch(0.65 0.18 30)" }}>
                Error aaya. Dobara try karein.
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();

  const totalOrders = orders?.length ?? 0;
  const totalRevenue =
    orders?.reduce((sum, o) => sum + Number(o.totalAmount) / 100, 0) ?? 0;
  const pendingOrders =
    orders?.filter((o) => o.status === OrderStatus.pending).length ?? 0;

  if (isInitializing || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Crown
            className="h-10 w-10 animate-pulse"
            style={{ color: "oklch(0.82 0.16 75)" }}
          />
          <p style={{ color: "oklch(0.65 0.04 80)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center gap-6 max-w-sm"
        >
          <Crown
            className="h-16 w-16"
            style={{ color: "oklch(0.82 0.16 75)" }}
          />
          <h1
            className="font-serif text-3xl font-bold"
            style={{ color: "oklch(0.93 0.015 80)" }}
          >
            Admin Login
          </h1>
          <p style={{ color: "oklch(0.65 0.04 80)" }}>
            Dashboard dekhne ke liye apne admin account se sign in karein.
          </p>
          <Button
            onClick={login}
            size="lg"
            className="font-bold tracking-widest uppercase px-10 h-12"
            style={{
              background: "oklch(0.78 0.14 75)",
              color: "oklch(0.12 0.04 295)",
              border: "none",
            }}
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  // Signed in but not admin yet — show setup panel
  if (isAdmin === false) {
    return <SetAdminPanel />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="py-12"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.05 295) 0%, oklch(0.12 0.045 295) 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              ❖ ADMIN ONLY
            </p>
            <h1
              className="font-serif text-4xl font-bold"
              style={{ color: "oklch(0.93 0.015 80)" }}
            >
              Orders Dashboard
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: "oklch(0.65 0.04 80)" }}
            >
              Saare customer orders yahan dikhenge
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Orders",
              value: String(totalOrders),
              icon: ShoppingBag,
            },
            {
              label: "Total Revenue",
              value: `₹${totalRevenue.toFixed(0)}`,
              icon: IndianRupee,
            },
            {
              label: "Pending Orders",
              value: String(pendingOrders),
              icon: Truck,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border p-5 flex items-center gap-4"
              style={{
                background: "oklch(0.15 0.05 295)",
                borderColor: "oklch(0.28 0.07 295)",
              }}
            >
              <div
                className="p-3 rounded-lg"
                style={{ background: "oklch(0.22 0.08 295)" }}
              >
                <stat.icon
                  className="h-6 w-6"
                  style={{ color: "oklch(0.82 0.16 75)" }}
                />
              </div>
              <div>
                <p
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "oklch(0.65 0.06 75)" }}
                >
                  {stat.label}
                </p>
                <p
                  className="font-serif text-2xl font-bold"
                  style={{ color: "oklch(0.93 0.015 80)" }}
                >
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders List */}
        {ordersLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((k) => (
              <Skeleton
                key={k}
                className="h-48 rounded-xl"
                style={{ background: "oklch(0.18 0.06 295)" }}
              />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag
              className="h-16 w-16 mx-auto mb-4"
              style={{ color: "oklch(0.35 0.06 295)" }}
            />
            <p
              className="font-serif text-2xl"
              style={{ color: "oklch(0.6 0.04 80)" }}
            >
              Abhi koi order nahi aaya
            </p>
            <p className="text-sm mt-2" style={{ color: "oklch(0.5 0.03 80)" }}>
              Jab koi buy karega, order yahan dikhega
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
