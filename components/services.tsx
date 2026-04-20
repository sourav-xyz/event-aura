"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryAPI } from "@/lib/api/config";
import { CategoryCardSkeleton } from "@/components/skeletons";
import Link from "next/link";
import {
  Heart,
  Cake,
  Building2,
  GraduationCap,
  Baby,
  PartyPopper,
  Home,
  Sparkles,
  Gift,
  ArrowRight,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Cake,
  Building2,
  GraduationCap,
  Baby,
  PartyPopper,
  Home,
  Sparkles,
  Gift,
};

const gradientMap: Record<string, string> = {
  Heart: "from-pink-500 to-rose-500",
  Cake: "from-purple-500 to-violet-500",
  Sparkles: "from-amber-500 to-orange-500",
  Gift: "from-teal-500 to-cyan-500",
  Building2: "from-blue-500 to-indigo-500",
  GraduationCap: "from-green-500 to-emerald-500",
  Baby: "from-pink-400 to-fuchsia-500",
  PartyPopper: "from-red-500 to-rose-500",
  Home: "from-yellow-500 to-amber-500",
};

// Fallback data for static rendering
const fallbackServices = [
  {
    _id: "1",
    icon: "Heart",
    name: "Wedding Planner",
    slug: "wedding",
    description: "Complete wedding planning from venue to vows. Make your dream wedding a reality.",
    color: "#ec4899",
    isActive: true,
  },
  {
    _id: "2",
    icon: "Cake",
    name: "Birthday Party",
    slug: "birthday",
    description: "Memorable birthday celebrations for all ages with stunning decorations.",
    color: "#8b5cf6",
    isActive: true,
  },
  {
    _id: "3",
    icon: "Sparkles",
    name: "Thread Ceremony",
    slug: "thread-ceremony",
    description: "Traditional Upanayan ceremonies with elegant and auspicious decorations.",
    color: "#f59e0b",
    isActive: true,
  },
  {
    _id: "4",
    icon: "Gift",
    name: "Surprise Party",
    slug: "surprise-party",
    description: "Secret celebrations that leave your loved ones speechless with joy.",
    color: "#14b8a6",
    isActive: true,
  },
  {
    _id: "5",
    icon: "Building2",
    name: "Corporate Events",
    slug: "corporate",
    description: "Professional event management for conferences, seminars, and team events.",
    color: "#3b82f6",
    isActive: true,
  },
  {
    _id: "6",
    icon: "GraduationCap",
    name: "College Events",
    slug: "college-events",
    description: "Vibrant fests, farewells, and cultural events for educational institutions.",
    color: "#22c55e",
    isActive: true,
  },
  {
    _id: "7",
    icon: "Baby",
    name: "Baby Shower",
    slug: "baby-shower",
    description: "Adorable baby shower setups with creative themes and decorations.",
    color: "#d946ef",
    isActive: true,
  },
  {
    _id: "8",
    icon: "PartyPopper",
    name: "Anniversary",
    slug: "anniversary",
    description: "Celebrate love milestones with romantic and elegant anniversary setups.",
    color: "#ef4444",
    isActive: true,
  },
  {
    _id: "9",
    icon: "Home",
    name: "Housewarming",
    slug: "housewarming",
    description: "Welcome your new home with traditional and modern housewarming decor.",
    color: "#eab308",
    isActive: true,
  },
];

export function Services() {
  const [categories, setCategories] = useState<Category[]>(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = (await categoryAPI.getAll()) as { success: boolean; categories: Category[] };
        if (response.success && response.categories?.length > 0) {
          setCategories(response.categories.filter((c) => c.isActive));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-balance">
            Events We <span className="text-gradient">Specialize</span> In
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            From intimate gatherings to grand celebrations, we bring your vision to life with
            creativity and precision.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((service, index) => {
              const Icon = iconMap[service.icon] || Sparkles;
              const gradient = gradientMap[service.icon] || "from-purple-500 to-pink-500";

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/events?category=${service.slug}`}>
  <Card className="group h-full border-border/50 bg-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer rounded-2xl">
    <div className="aspect-[16/10] relative overflow-hidden rounded-t-2xl">
      <img
        src={service.image}
        alt={service.name}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
      />
      <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <CardContent className="p-6">
      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
        {service.name}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">
        {service.description}
      </p>
      <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        View Events <ArrowRight className="h-4 w-4 ml-1" />
      </div>
    </CardContent>
  </Card>
</Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button asChild className="gradient-primary text-primary-foreground" size="lg">
            <Link href="/events">
              View All Events <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
