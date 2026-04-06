import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Copy,
  ExternalLink,
  Instagram,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareWebsiteProps {
  variant?: "icon" | "full";
}

export default function ShareWebsite({ variant = "full" }: ShareWebsiteProps) {
  const [open, setOpen] = useState(false);

  const siteUrl = window.location.origin;
  const shareText =
    "DS Trending Store – Fashion jo trend banaye, style jo aapko define kare. Check karein:";

  const copyLink = () => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      toast.success("Link copy ho gaya!", {
        description: "Ab apne doston ke saath share karo.",
      });
      setOpen(false);
    });
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`${shareText} ${siteUrl}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    setOpen(false);
  };

  const shareInstagram = () => {
    // Copy the link first, then open Instagram
    navigator.clipboard.writeText(siteUrl).then(() => {
      toast.success("Link copy ho gaya!", {
        description: "Instagram story ya bio mein paste kar sakte ho.",
      });
    });
    window.open("https://www.instagram.com/d_naruto_king", "_blank");
    setOpen(false);
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "DS Trending Store",
          text: shareText,
          url: siteUrl,
        })
        .catch(() => {
          // User cancelled share
        });
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === "icon" ? (
          <button
            type="button"
            className="p-2 rounded-full transition-colors hover:bg-secondary"
            aria-label="Share website"
            data-ocid="share.trigger"
          >
            <Share2
              className="h-5 w-5"
              style={{ color: "oklch(0.82 0.16 75)" }}
            />
          </button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 font-bold tracking-wide uppercase text-sm h-10"
            style={{
              borderColor: "oklch(0.82 0.16 75 / 0.5)",
              color: "oklch(0.82 0.16 75)",
              background: "transparent",
            }}
            data-ocid="share.trigger"
          >
            <Share2 className="h-4 w-4" />
            Share Store
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-3"
        style={{
          background: "oklch(0.15 0.055 295)",
          border: "1px solid oklch(0.28 0.07 295)",
        }}
        data-ocid="share.popover"
      >
        <p
          className="text-xs font-bold tracking-widest uppercase mb-3 px-1"
          style={{ color: "oklch(0.82 0.16 75)" }}
        >
          Store Share Karo
        </p>

        <div className="flex flex-col gap-1">
          {/* Copy Link */}
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary text-left"
            style={{ color: "oklch(0.85 0.04 80)" }}
            data-ocid="share.copy_link"
          >
            <Copy
              className="h-4 w-4 flex-shrink-0"
              style={{ color: "oklch(0.78 0.14 75)" }}
            />
            Link Copy Karo
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary text-left"
            style={{ color: "oklch(0.85 0.04 80)" }}
            data-ocid="share.whatsapp"
          >
            <MessageCircle
              className="h-4 w-4 flex-shrink-0"
              style={{ color: "#25D366" }}
            />
            WhatsApp par Share Karo
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={shareInstagram}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary text-left"
            style={{ color: "oklch(0.85 0.04 80)" }}
            data-ocid="share.instagram"
          >
            <Instagram
              className="h-4 w-4 flex-shrink-0"
              style={{ color: "#E1306C" }}
            />
            Instagram par Share Karo
          </button>

          {/* Native Share (mobile) */}
          {typeof navigator !== "undefined" && !!navigator.share && (
            <button
              type="button"
              onClick={nativeShare}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary text-left"
              style={{ color: "oklch(0.85 0.04 80)" }}
              data-ocid="share.native"
            >
              <ExternalLink
                className="h-4 w-4 flex-shrink-0"
                style={{ color: "oklch(0.78 0.14 75)" }}
              />
              Aur Options
            </button>
          )}
        </div>

        {/* URL display */}
        <div
          className="mt-3 px-3 py-2 rounded-lg text-xs break-all font-mono"
          style={{
            background: "oklch(0.10 0.04 295)",
            color: "oklch(0.6 0.04 80)",
          }}
        >
          {siteUrl}
        </div>
      </PopoverContent>
    </Popover>
  );
}
