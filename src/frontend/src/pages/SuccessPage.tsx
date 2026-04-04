import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Crown, Info } from "lucide-react";
import { motion } from "motion/react";

export default function SuccessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      data-ocid="success.page"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-lg w-full mx-auto px-8 py-16 rounded-2xl border"
        style={{
          background: "oklch(0.16 0.055 295)",
          borderColor: "oklch(0.82 0.16 75 / 0.4)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            type: "spring",
            bounce: 0.5,
          }}
          className="flex items-center justify-center mb-6"
        >
          <div
            className="p-4 rounded-full"
            style={{ background: "oklch(0.22 0.09 295)" }}
          >
            <CheckCircle
              className="h-14 w-14"
              style={{ color: "oklch(0.82 0.16 75)" }}
            />
          </div>
        </motion.div>

        <Crown
          className="h-8 w-8 mx-auto mb-4"
          style={{ color: "oklch(0.82 0.16 75)" }}
        />

        <h1
          className="font-serif text-4xl font-bold mb-4"
          style={{ color: "oklch(0.93 0.015 80)" }}
        >
          Order Placed!
        </h1>
        <p className="text-base mb-3" style={{ color: "oklch(0.75 0.04 80)" }}>
          Thank you for shopping with DS Trending Store. Your royal selection is
          being prepared with the utmost care.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-start gap-3 rounded-xl border p-4 mb-6 text-left"
          style={{
            background: "oklch(0.82 0.16 75 / 0.07)",
            borderColor: "oklch(0.82 0.16 75 / 0.25)",
          }}
          data-ocid="success.panel"
        >
          <Info
            className="h-4 w-4 flex-shrink-0 mt-0.5"
            style={{ color: "oklch(0.82 0.16 75)" }}
          />
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.8 0.06 80)" }}
          >
            If you paid via UPI, your order is being verified. If COD, our team
            will contact you shortly to confirm delivery details.
          </p>
        </motion.div>

        <p className="text-sm mb-10" style={{ color: "oklch(0.6 0.04 80)" }}>
          We appreciate your trust in us. Expect delivery within 3–7 business
          days.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="font-bold tracking-widest uppercase px-8"
            style={{
              background: "oklch(0.78 0.14 75)",
              color: "oklch(0.12 0.04 295)",
              border: "none",
            }}
            data-ocid="success.primary_button"
          >
            <Link to="/shop">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-bold tracking-widest uppercase px-8"
            style={{
              borderColor: "oklch(0.82 0.16 75)",
              color: "oklch(0.82 0.16 75)",
              background: "transparent",
            }}
            data-ocid="success.secondary_button"
          >
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
