import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useAddToCart } from "../hooks/useQueries";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addToCart = useAddToCart();

  const price = Number(product.price) / 100;
  const salePrice = product.salePrice ? Number(product.salePrice) / 100 : null;

  function handleAddToCart() {
    addToCart.mutate(
      { productId: product.id, quantity: BigInt(1) },
      {
        onSuccess: () => toast.success(`${product.name} added to cart!`),
        onError: () => toast.error("Failed to add to cart. Please try again."),
      },
    );
  }

  const displayImage = product.imageUrl?.startsWith("http")
    ? product.imageUrl
    : `https://placehold.co/400x500/3D0C6B/C9A24A?text=${encodeURIComponent(product.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col card-royal rounded-lg overflow-hidden hover-gold transition-all duration-300"
      data-ocid={`products.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.isOnSale && (
          <div className="absolute top-3 left-3">
            <Badge
              className="text-xs font-bold px-2 py-1 tracking-wide"
              style={{
                background: "oklch(0.82 0.16 75)",
                color: "oklch(0.12 0.04 295)",
                border: "none",
              }}
            >
              <Tag className="h-3 w-3 mr-1" />
              SALE
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p
            className="text-xs font-medium tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.65 0.06 75)" }}
          >
            {product.category}
          </p>
          <h3
            className="font-serif text-base font-semibold line-clamp-2 leading-snug"
            style={{ color: "oklch(0.93 0.015 80)" }}
          >
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          {product.isOnSale && salePrice ? (
            <>
              <span
                className="font-bold text-lg"
                style={{ color: "oklch(0.82 0.16 75)" }}
              >
                ${salePrice.toFixed(2)}
              </span>
              <span
                className="text-sm line-through"
                style={{ color: "oklch(0.55 0.03 80)" }}
              >
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span
              className="font-bold text-lg"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
          className="w-full font-medium tracking-wide transition-all"
          style={{
            background: "oklch(0.78 0.14 75)",
            color: "oklch(0.12 0.04 295)",
            border: "none",
          }}
          data-ocid={`products.item.${index + 1}`}
        >
          {addToCart.isPending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⟳</span> Adding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
