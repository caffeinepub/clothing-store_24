import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  LogIn,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllProducts,
  useCart,
  useCartTotal,
  useRemoveFromCart,
  useUpdateCartItem,
} from "../hooks/useQueries";

const SKELETON_CART_KEYS = ["sk-c1", "sk-c2", "sk-c3"];

export default function CartPage() {
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const { data: cartTotal } = useCartTotal();
  const { data: products } = useAllProducts();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const productMap: Record<string, Product> = {};
  for (const p of products ?? []) {
    productMap[p.id] = p;
  }

  const totalCents = Number(cartTotal ?? 0);
  const totalRupees = totalCents / 100;

  function handleProceedToCheckout() {
    if (!identity) {
      setLoginDialogOpen(true);
      return;
    }
    navigate({ to: "/checkout" });
  }

  function handleRemove(productId: string) {
    removeFromCart.mutate(productId, {
      onSuccess: () => toast.success("Item removed from cart."),
      onError: () => toast.error("Failed to remove item."),
    });
  }

  function handleQuantityChange(
    productId: string,
    currentQty: number,
    delta: number,
  ) {
    const newQty = Math.max(1, currentQty + delta);
    updateCartItem.mutate(
      { productId, newQuantity: BigInt(newQty) },
      {
        onError: () => toast.error("Failed to update quantity."),
      },
    );
  }

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <div className="min-h-screen" data-ocid="cart.page">
      {/* Header */}
      <div
        className="py-16 text-center"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.05 295) 0%, oklch(0.12 0.045 295) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
            style={{ color: "oklch(0.82 0.16 75)" }}
          >
            YOUR SELECTION
          </p>
          <h1
            className="font-serif text-5xl font-bold"
            style={{ color: "oklch(0.93 0.015 80)" }}
          >
            Shopping Cart
          </h1>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {cartLoading ? (
          <div className="space-y-4" data-ocid="cart.loading_state">
            {SKELETON_CART_KEYS.map((key) => (
              <div
                key={key}
                className="flex gap-4 p-4 rounded-xl"
                style={{ background: "oklch(0.16 0.055 295)" }}
              >
                <Skeleton
                  className="w-24 h-28 rounded-lg flex-shrink-0"
                  style={{ background: "oklch(0.22 0.07 295)" }}
                />
                <div className="flex-1 space-y-3">
                  <Skeleton
                    className="h-5 w-1/2"
                    style={{ background: "oklch(0.22 0.07 295)" }}
                  />
                  <Skeleton
                    className="h-4 w-1/4"
                    style={{ background: "oklch(0.22 0.07 295)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
            data-ocid="cart.empty_state"
          >
            <ShoppingCart
              className="h-16 w-16 mx-auto mb-6"
              style={{ color: "oklch(0.4 0.05 295)" }}
            />
            <h2
              className="font-serif text-3xl mb-3"
              style={{ color: "oklch(0.7 0.04 80)" }}
            >
              Your cart is empty
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "oklch(0.55 0.03 80)" }}
            >
              Explore our royal collection and add pieces you love.
            </p>
            <Button
              asChild
              size="lg"
              className="font-bold tracking-widest uppercase"
              style={{
                background: "oklch(0.78 0.14 75)",
                color: "oklch(0.12 0.04 295)",
                border: "none",
              }}
              data-ocid="cart.primary_button"
            >
              <Link to="/shop">
                Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4" data-ocid="cart.list">
              <AnimatePresence initial={false}>
                {cartItems.map((item, i) => {
                  const product = productMap[item.productId];
                  const price = product
                    ? (product.isOnSale && product.salePrice
                        ? Number(product.salePrice)
                        : Number(product.price)) / 100
                    : 0;
                  const displayImage = product?.imageUrl?.startsWith("http")
                    ? product.imageUrl
                    : "/assets/generated/product-royal-dress.dim_600x750.jpg";

                  return (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 p-4 rounded-xl border"
                      style={{
                        background: "oklch(0.16 0.055 295)",
                        borderColor: "oklch(0.28 0.07 295)",
                      }}
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <div className="w-24 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={displayImage}
                          alt={product?.name ?? "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-serif font-bold text-base mb-1 truncate"
                          style={{ color: "oklch(0.93 0.015 80)" }}
                        >
                          {product?.name ?? item.productId}
                        </h3>
                        <p
                          className="text-xs mb-3 capitalize"
                          style={{ color: "oklch(0.65 0.06 75)" }}
                        >
                          {product?.category}
                        </p>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div
                            className="flex items-center gap-2 rounded-lg overflow-hidden border"
                            style={{ borderColor: "oklch(0.3 0.07 295)" }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  Number(item.quantity),
                                  -1,
                                )
                              }
                              className="px-3 py-2 hover:bg-secondary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span
                              className="px-3 font-bold text-sm"
                              style={{ color: "oklch(0.93 0.015 80)" }}
                            >
                              {Number(item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  Number(item.quantity),
                                  1,
                                )
                              }
                              className="px-3 py-2 hover:bg-secondary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span
                            className="font-bold text-base"
                            style={{ color: "oklch(0.82 0.16 75)" }}
                          >
                            ₹{(price * Number(item.quantity)).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.productId)}
                            className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                            aria-label="Remove item"
                            data-ocid={`cart.delete_button.${i + 1}`}
                          >
                            <Trash2
                              className="h-4 w-4"
                              style={{ color: "oklch(0.65 0.18 15)" }}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div
              className="p-6 rounded-xl border h-fit sticky top-24"
              style={{
                background: "oklch(0.16 0.055 295)",
                borderColor: "oklch(0.28 0.07 295)",
              }}
              data-ocid="cart.panel"
            >
              <h2
                className="font-serif text-xl font-bold mb-6"
                style={{ color: "oklch(0.93 0.015 80)" }}
              >
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "oklch(0.65 0.04 80)" }}>Subtotal</span>
                  <span style={{ color: "oklch(0.93 0.015 80)" }}>
                    ₹{totalRupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "oklch(0.65 0.04 80)" }}>Shipping</span>
                  <span style={{ color: "oklch(0.65 0.06 75)" }}>
                    Calculated at checkout
                  </span>
                </div>
              </div>
              <Separator
                className="mb-6"
                style={{ background: "oklch(0.28 0.07 295)" }}
              />
              <div className="flex justify-between font-bold text-lg mb-8">
                <span style={{ color: "oklch(0.93 0.015 80)" }}>Total</span>
                <span style={{ color: "oklch(0.82 0.16 75)" }}>
                  ₹{totalRupees.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleProceedToCheckout}
                className="w-full font-bold tracking-widest uppercase h-12 text-base"
                style={{
                  background: "oklch(0.78 0.14 75)",
                  color: "oklch(0.12 0.04 295)",
                  border: "none",
                }}
                data-ocid="cart.submit_button"
              >
                <span className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Proceed to Checkout
                </span>
              </Button>
              <p
                className="text-xs text-center mt-4"
                style={{ color: "oklch(0.5 0.03 80)" }}
              >
                Sign in required to complete purchase
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent
          style={{
            background: "oklch(0.16 0.055 295)",
            borderColor: "oklch(0.82 0.16 75 / 0.3)",
          }}
          data-ocid="cart.dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="font-serif text-xl"
              style={{ color: "oklch(0.93 0.015 80)" }}
            >
              Sign In Required
            </DialogTitle>
            <DialogDescription style={{ color: "oklch(0.65 0.04 80)" }}>
              Please sign in to your account to proceed with checkout and track
              your royal orders.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setLoginDialogOpen(false)}
              style={{ color: "oklch(0.65 0.04 80)" }}
              data-ocid="cart.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setLoginDialogOpen(false);
                login();
              }}
              style={{
                background: "oklch(0.78 0.14 75)",
                color: "oklch(0.12 0.04 295)",
                border: "none",
              }}
              data-ocid="cart.confirm_button"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
