import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Product } from "../backend.d";
import ProductCard from "../components/ProductCard";
import { useProductsByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Shirts", value: "shirts" },
  { label: "Tops", value: "tops" },
  { label: "Bottoms", value: "bottoms" },
  { label: "Dresses", value: "dresses" },
  { label: "Accessories", value: "accessories" },
];

const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "shirt-royal-001",
    name: "Royal Color Premium Shirt",
    category: "shirts",
    price: BigInt(30000),
    salePrice: undefined,
    isOnSale: false,
    imageUrl: "/assets/generated/product-royal-shirt.dim_600x750.png",
    description:
      "Ek premium quality royal shirt jo aapko ek alag hi andaaz deta hai -- vibrant color, superior fabric, aur unmatched style.",
    stockQuantity: BigInt(50),
  },
  {
    id: "f1",
    name: "Royal Velvet Evening Gown",
    category: "dresses",
    price: BigInt(289900),
    salePrice: undefined,
    isOnSale: false,
    imageUrl: "/assets/generated/product-royal-dress.dim_600x750.jpg",
    description: "Exquisite velvet gown with gold trim",
    stockQuantity: BigInt(10),
  },
  {
    id: "f2",
    name: "Gold Silk Blouse",
    category: "tops",
    price: BigInt(145000),
    salePrice: BigInt(109000),
    isOnSale: true,
    imageUrl: "/assets/generated/product-gold-blouse.dim_600x750.jpg",
    description: "Luxurious gold silk blouse",
    stockQuantity: BigInt(15),
  },
  {
    id: "f3",
    name: "Purple Velvet Blazer",
    category: "tops",
    price: BigInt(220000),
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
    price: BigInt(189000),
    salePrice: BigInt(149000),
    isOnSale: true,
    imageUrl: "/assets/generated/product-palazzo-pants.dim_600x750.jpg",
    description: "Wide-leg palazzo pants",
    stockQuantity: BigInt(12),
  },
  {
    id: "f5",
    name: "Jeweled Statement Necklace",
    category: "accessories",
    price: BigInt(95000),
    salePrice: undefined,
    isOnSale: false,
    imageUrl: "/assets/generated/product-royal-necklace.dim_600x750.jpg",
    description: "Gold and amethyst necklace",
    stockQuantity: BigInt(20),
  },
  {
    id: "f6",
    name: "Royal Pleated Mini Skirt",
    category: "bottoms",
    price: BigInt(129000),
    salePrice: BigInt(99000),
    isOnSale: true,
    imageUrl: "/assets/generated/product-royal-skirt.dim_600x750.jpg",
    description: "Elegant pleated mini skirt",
    stockQuantity: BigInt(18),
  },
];

export default function ShopPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  const {
    data: products,
    isLoading,
    isFetching,
  } = useProductsByCategory(category);

  // After 3 seconds, stop showing skeleton and use fallback products
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const showSkeleton = (isLoading || isFetching) && !timedOut;

  const displayProducts =
    products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  const filtered = displayProducts.filter(
    (p) => search === "" || p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div
        className="py-16 text-center"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.05 295) 0%, oklch(0.12 0.045 295) 100%)",
        }}
        data-ocid="shop.section"
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
            THE COLLECTION
          </p>
          <h1
            className="font-serif text-5xl font-bold"
            style={{ color: "oklch(0.93 0.015 80)" }}
          >
            Royal Boutique
          </h1>
          <p
            className="mt-3 text-base"
            style={{ color: "oklch(0.65 0.04 80)" }}
          >
            Curated luxury, exclusively yours
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div
        className="sticky top-[73px] z-40 border-b border-border"
        style={{
          background: "oklch(0.12 0.045 295 / 0.97)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <Tabs value={category} onValueChange={setCategory}>
              <TabsList
                className="gap-1"
                style={{ background: "oklch(0.18 0.06 295)" }}
                data-ocid="shop.tab"
              >
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="text-xs font-bold tracking-widest uppercase data-[state=active]:text-background"
                    data-ocid="shop.tab"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "oklch(0.6 0.04 80)" }}
              />
              <Input
                placeholder="Search styles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64 bg-secondary border-border"
                data-ocid="shop.search_input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal
            className="h-4 w-4"
            style={{ color: "oklch(0.65 0.06 75)" }}
          />
          <span className="text-sm" style={{ color: "oklch(0.65 0.04 80)" }}>
            {showSkeleton ? "Loading..." : `${filtered.length} pieces`}
          </span>
        </div>

        {showSkeleton ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            data-ocid="shop.loading_state"
          >
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-24" data-ocid="shop.empty_state">
            <p
              className="font-serif text-2xl mb-2"
              style={{ color: "oklch(0.6 0.04 80)" }}
            >
              No styles found
            </p>
            <p className="text-sm" style={{ color: "oklch(0.5 0.03 80)" }}>
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            data-ocid="shop.list"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
