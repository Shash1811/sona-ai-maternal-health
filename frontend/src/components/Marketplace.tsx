import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketplaceProps {
  onBack: () => void;
}

const products = {
  mom: [
    { name: "Postpartum Recovery Kit", price: "₦12,500", rating: 4.8, image: "🧴" },
    { name: "Nursing Bra Set", price: "₦8,200", rating: 4.6, image: "👚" },
    { name: "Work-Return Blazer", price: "₦15,000", rating: 4.9, image: "🧥" },
    { name: "Belly Wrap Support", price: "₦6,800", rating: 4.7, image: "🩹" },
    { name: "Pelvic Floor Trainer", price: "₦9,500", rating: 4.5, image: "💪" },
    { name: "Herbal Tea Bundle", price: "₦4,200", rating: 4.8, image: "🍵" },
  ],
  baby: [
    { name: "Organic Swaddle Set", price: "₦7,500", rating: 4.9, image: "👶" },
    { name: "White Noise Machine", price: "₦11,000", rating: 4.7, image: "🔊" },
    { name: "Baby Carrier Wrap", price: "₦13,200", rating: 4.8, image: "🧸" },
    { name: "Teething Ring Set", price: "₦3,800", rating: 4.6, image: "🦷" },
    { name: "Diaper Bag Backpack", price: "₦14,500", rating: 4.9, image: "🎒" },
    { name: "Baby Monitor", price: "₦18,000", rating: 4.7, image: "📱" },
  ],
};

const Marketplace = ({ onBack }: MarketplaceProps) => {
  const [category, setCategory] = useState<"mom" | "baby">("mom");

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-serif text-foreground">Marketplace</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">3</span>
        </Button>
      </div>

      {/* Category Toggle */}
      <div className="flex gap-3 px-6 mb-6">
        {(["mom", "baby"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "flex-1 py-3 rounded-2xl text-sm font-medium transition-all",
              category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {cat === "mom" ? "🤱 Care for Mom" : "👶 Care for Baby"}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="px-6 grid grid-cols-2 gap-3">
        {products[category].map((product, i) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-card border border-border overflow-hidden"
          >
            <div className="h-28 bg-muted flex items-center justify-center text-4xl">
              {product.image}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{product.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-accent fill-accent" />
                <span className="text-xs text-muted-foreground">{product.rating}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-foreground">{product.price}</span>
                <Button size="sm" className="rounded-full bg-primary text-primary-foreground text-xs px-3 h-7">
                  Add
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
