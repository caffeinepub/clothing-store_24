import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import {
  useAllProducts,
  useOnSaleProducts,
  usePromotions,
} from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d"];

// Fallback local products for when store is loading/empty
const FALLBACK_PRODUCTS = [
  {
    id: "f1",
    name: "Royal Velvet Evening Gown",
    category: "dresses",
    price: BigInt(28900),
    salePrice: undefined,
    isOnSale: false,
    imageUrl: "/assets/generated/product-royal-dress.dim_600x750.jpg",
    description: "Exquisite velvet gown",
    stockQuantity: BigInt(10),
  },
  {
    id: "f2",
    name: "Gold Silk Blouse",
    category: "tops",
    price: BigInt(14500),
    salePrice: BigInt(10900),
    isOnSale: true,
    imageUrl: "/assets/generated/product-gold-blouse.dim_600x750.jpg",
    description: "Gold silk blouse",
    stockQuantity: BigInt(15),
  },
  {
    id: "f3",
    name: "Purple Velvet Blazer",
    category: "tops",
    price: BigInt(22000),
    salePrice: undefined,
    isOnSale: false,
    imageUrl: "/assets/generated/product-royal-blazer.dim_600x750.jpg",
    description: "Rich velvet blazer",
    stockQuantity: BigInt(8),
  },
  {
    id: "f4",
    name: "Palazzo Trousers",
    category: "bottoms",
    price: BigInt(18900),
    salePrice: BigInt(14900),
    isOnSale: true,
    imageUrl: "/assets/generated/product-palazzo-pants.dim_600x750.jpg",
    description: "Wide-leg palazzo pants",
    stockQuantity: BigInt(12),
  },
];

const FALLBACK_PROMOTIONS = [
  {
    title: "Royal Summer Sale",
    description: "Up to 40% off on selected evening wear",
    discountInfo: "40% OFF",
    imageUrl: "",
  },
  {
    title: "New Arrivals",
    description: "Exclusive new pieces just landed",
    discountInfo: "NEW",
    imageUrl: "",
  },
];

const CATEGORIES = [
  { name: "Dresses", slug: "dresses", emoji: "👗" },
  { name: "Tops", slug: "tops", emoji: "✨" },
  { name: "Bottoms", slug: "bottoms", emoji: "👔" },
  { name: "Accessories", slug: "accessories", emoji: "💎" },
];

export default function HomePage() {
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { data: onSaleProducts } = useOnSaleProducts();
  const { data: promotions } = usePromotions();

  const displayProducts =
    products && products.length > 0 ? products.slice(0, 8) : FALLBACK_PRODUCTS;
  const displaySaleProducts =
    onSaleProducts && onSaleProducts.length > 0
      ? onSaleProducts
      : FALLBACK_PRODUCTS.filter((p) => p.isOnSale);
  const displayPromotions =
    promotions && promotions.length > 0 ? promotions : FALLBACK_PROMOTIONS;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        data-ocid="hero.section"
      >
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-royal-fashion.dim_1600x900.jpg"
            alt="DS Trending Store Hero"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.09 0.04 295 / 0.92) 0%, oklch(0.09 0.04 295 / 0.7) 50%, oklch(0.09 0.04 295 / 0.3) 100%)",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p
              className="text-xs font-bold tracking-[0.4em] uppercase mb-4"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              ✦ DS Trending Store — New Collection 2026 ✦
            </p>
            <h1
              className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6"
              style={{ color: "oklch(0.97 0.015 80)" }}
            >
              Dress Like
              <br />
              <span style={{ color: "oklch(0.82 0.16 75)" }}>Royalty</span>
            </h1>
            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: "oklch(0.8 0.03 80)" }}
            >
              Discover exclusive luxury fashion pieces designed for those who
              command attention. Every stitch tells a story of elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="font-bold tracking-widest uppercase px-8 text-base h-14"
                style={{
                  background: "oklch(0.78 0.14 75)",
                  color: "oklch(0.12 0.04 295)",
                  border: "none",
                }}
                data-ocid="hero.primary_button"
              >
                <Link to="/shop">
                  Shop Now <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-bold tracking-widest uppercase px-8 text-base h-14"
                style={{
                  borderColor: "oklch(0.82 0.16 75)",
                  color: "oklch(0.82 0.16 75)",
                  background: "transparent",
                }}
                data-ocid="hero.secondary_button"
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Promotions Banner */}
      {displayPromotions.length > 0 && (
        <section
          className="py-4"
          style={{ background: "oklch(0.78 0.14 75)" }}
          data-ocid="promotions.section"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {displayPromotions.map((promo) => (
                <div
                  key={promo.title}
                  className="flex items-center gap-3"
                  data-ocid="promotions.item.1"
                >
                  <Zap
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: "oklch(0.12 0.04 295)" }}
                  />
                  <span
                    className="font-bold text-sm tracking-wide"
                    style={{ color: "oklch(0.12 0.04 295)" }}
                  >
                    {promo.discountInfo}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.2 0.04 295)" }}
                  >
                    {promo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20" data-ocid="categories.section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              EXPLORE
            </p>
            <h2
              className="font-serif text-4xl font-bold"
              style={{ color: "oklch(0.93 0.015 80)" }}
            >
              Shop by Category
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                data-ocid={`categories.item.${i + 1}`}
              >
                <Link
                  to="/shop"
                  className="group flex flex-col items-center justify-center p-8 rounded-lg border transition-all duration-300 hover-gold"
                  style={{
                    background: "oklch(0.16 0.055 295)",
                    borderColor: "oklch(0.28 0.07 295)",
                  }}
                  data-ocid="nav.link"
                >
                  <span className="text-4xl mb-3">{cat.emoji}</span>
                  <span
                    className="font-serif text-lg font-semibold"
                    style={{ color: "oklch(0.93 0.015 80)" }}
                  >
                    {cat.name}
                  </span>
                  <span
                    className="text-xs mt-1 tracking-wide"
                    style={{ color: "oklch(0.65 0.06 75)" }}
                  >
                    Browse →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section
        className="py-20"
        style={{ background: "oklch(0.14 0.05 295)" }}
        data-ocid="new-arrivals.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4"
          >
            <div>
              <p
                className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
                style={{ color: "oklch(0.82 0.16 75)" }}
              >
                CURATED FOR YOU
              </p>
              <h2
                className="font-serif text-4xl font-bold"
                style={{ color: "oklch(0.93 0.015 80)" }}
              >
                New Arrivals
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="tracking-widest uppercase font-bold"
              style={{
                borderColor: "oklch(0.82 0.16 75)",
                color: "oklch(0.82 0.16 75)",
                background: "transparent",
              }}
              data-ocid="new-arrivals.button"
            >
              <Link to="/shop">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {SKELETON_KEYS.map((key) => (
                <div key={key} className="flex flex-col gap-3">
                  <Skeleton
                    className="aspect-[4/5] rounded-lg"
                    style={{ background: "oklch(0.2 0.06 295)" }}
                  />
                  <Skeleton
                    className="h-4 w-3/4"
                    style={{ background: "oklch(0.2 0.06 295)" }}
                  />
                  <Skeleton
                    className="h-4 w-1/2"
                    style={{ background: "oklch(0.2 0.06 295)" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sale Strip */}
      {displaySaleProducts.length > 0 && (
        <section className="py-20" data-ocid="sale.section">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p
                className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
                style={{ color: "oklch(0.82 0.16 75)" }}
              >
                <Sparkles className="inline h-4 w-4 mr-2" />
                LIMITED TIME
              </p>
              <h2
                className="font-serif text-4xl font-bold"
                style={{ color: "oklch(0.93 0.015 80)" }}
              >
                Royal Offers
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displaySaleProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner Strip */}
      <section
        className="py-24 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.1 295) 0%, oklch(0.28 0.14 280) 50%, oklch(0.22 0.1 295) 100%)",
        }}
        data-ocid="promo-banner.section"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container mx-auto px-4"
        >
          <p
            className="font-serif text-5xl md:text-6xl font-bold mb-4"
            style={{ color: "oklch(0.82 0.16 75)" }}
          >
            Up to 40% Off
          </p>
          <p className="text-xl mb-8" style={{ color: "oklch(0.85 0.03 80)" }}>
            On our exclusive DS Trending Collection — this season only
          </p>
          <Button
            asChild
            size="lg"
            className="font-bold tracking-widest uppercase px-10 h-14 text-base"
            style={{
              background: "oklch(0.82 0.16 75)",
              color: "oklch(0.12 0.04 295)",
              border: "none",
            }}
            data-ocid="promo-banner.primary_button"
          >
            <Link to="/shop">Shop the Sale</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
