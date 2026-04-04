import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Heart, Instagram, Star } from "lucide-react";
import { motion } from "motion/react";
import { useAboutPage } from "../hooks/useQueries";

const VALUES = [
  {
    icon: Crown,
    title: "Royal Craftsmanship",
    desc: "Every piece is handpicked and quality-verified to meet the standards of true luxury.",
  },
  {
    icon: Heart,
    title: "Passion for Fashion",
    desc: "We curate with love — because fashion is more than clothing, it's self-expression.",
  },
  {
    icon: Star,
    title: "Exclusive Collections",
    desc: "Limited-edition pieces that ensure you stand out in every room you walk into.",
  },
];

export default function AboutPage() {
  const { data: aboutPage, isLoading } = useAboutPage();

  const instagramHandle = aboutPage?.instagramHandle || "d_naruto_king";
  const aboutText =
    aboutPage?.aboutText ||
    "We are DS Trending Store — a luxury fashion brand born from a love of regal elegance and modern style. Our collections draw inspiration from royal courts and haute couture, bringing you pieces that make every day feel like a coronation.";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.045 295) 0%, oklch(0.22 0.12 295) 50%, oklch(0.14 0.05 295) 100%)",
        }}
        data-ocid="about.section"
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src="/assets/generated/about-royal-lifestyle.dim_800x600.jpg"
            alt="About DS Trending Store"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 text-center"
        >
          <Crown
            className="h-12 w-12 mx-auto mb-6"
            style={{ color: "oklch(0.82 0.16 75)" }}
          />
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase mb-4"
            style={{ color: "oklch(0.82 0.16 75)" }}
          >
            OUR STORY
          </p>
          <h1
            className="font-serif text-5xl md:text-6xl font-bold mb-6"
            style={{ color: "oklch(0.93 0.015 80)" }}
          >
            About DS Trending Store
          </h1>
          <div
            className="max-w-2xl mx-auto h-px mb-6"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.82 0.16 75), transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="py-20" data-ocid="about.panel">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img
                  src="/assets/generated/about-royal-lifestyle.dim_800x600.jpg"
                  alt="DS Trending Store brand story"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 60%, oklch(0.12 0.045 295 / 0.8) 100%)",
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p
                className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
                style={{ color: "oklch(0.82 0.16 75)" }}
              >
                THE BRAND
              </p>
              <h2
                className="font-serif text-4xl font-bold mb-6"
                style={{ color: "oklch(0.93 0.015 80)" }}
              >
                Born from Elegance
              </h2>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton
                    className="h-4 w-full"
                    style={{ background: "oklch(0.2 0.06 295)" }}
                  />
                  <Skeleton
                    className="h-4 w-5/6"
                    style={{ background: "oklch(0.2 0.06 295)" }}
                  />
                  <Skeleton
                    className="h-4 w-4/5"
                    style={{ background: "oklch(0.2 0.06 295)" }}
                  />
                </div>
              ) : (
                <p
                  className="text-base leading-relaxed mb-8"
                  style={{ color: "oklch(0.72 0.04 80)" }}
                >
                  {aboutText}
                </p>
              )}

              {/* Instagram Card */}
              <div
                className="rounded-xl p-6 border"
                style={{
                  background: "oklch(0.16 0.055 295)",
                  borderColor: "oklch(0.28 0.07 295)",
                }}
                data-ocid="about.card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-full"
                    style={{ background: "oklch(0.22 0.09 295)" }}
                  >
                    <Instagram
                      className="h-5 w-5"
                      style={{ color: "oklch(0.82 0.16 75)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: "oklch(0.6 0.04 80)" }}
                    >
                      Follow us on Instagram
                    </p>
                    {isLoading ? (
                      <Skeleton
                        className="h-5 w-40 mt-1"
                        style={{ background: "oklch(0.2 0.06 295)" }}
                      />
                    ) : (
                      <p
                        className="font-bold text-base"
                        style={{ color: "oklch(0.82 0.16 75)" }}
                      >
                        @{instagramHandle}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full font-bold tracking-widest uppercase"
                  style={{
                    background: "oklch(0.78 0.14 75)",
                    color: "oklch(0.12 0.04 295)",
                    border: "none",
                  }}
                  data-ocid="about.primary_button"
                >
                  <a
                    href={`https://instagram.com/${instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Visit Our Instagram
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20"
        style={{ background: "oklch(0.14 0.05 295)" }}
        data-ocid="about.values.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p
              className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              WHY DS TRENDING
            </p>
            <h2
              className="font-serif text-4xl font-bold"
              style={{ color: "oklch(0.93 0.015 80)" }}
            >
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center p-8 rounded-xl border hover-gold transition-all duration-300"
                style={{
                  background: "oklch(0.16 0.055 295)",
                  borderColor: "oklch(0.28 0.07 295)",
                }}
                data-ocid={`about.item.${i + 1}`}
              >
                <div
                  className="inline-flex p-4 rounded-full mb-5"
                  style={{ background: "oklch(0.22 0.09 295)" }}
                >
                  <Icon
                    className="h-7 w-7"
                    style={{ color: "oklch(0.82 0.16 75)" }}
                  />
                </div>
                <h3
                  className="font-serif text-xl font-bold mb-3"
                  style={{ color: "oklch(0.93 0.015 80)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.65 0.04 80)" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
