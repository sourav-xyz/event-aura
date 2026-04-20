"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { categoryAPI, eventAPI } from "@/lib/api/config";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EventCardSkeleton, CategoryCardSkeleton } from "@/components/skeletons";
import { useToast } from "@/context/toast-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Heart,
  Cake,
  Sparkles,
  Gift,
  Building,
  GraduationCap,
  Baby,
  Home,
  Star,
  MapPin,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  X,
  ChevronDown,
  Grid3X3,
  List,
  IndianRupee,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

interface Event {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  basePrice: number;
  rating: { average: number; count: number };
  locations: string[];
  category: { name: string; slug: string; icon: string; color: string };
  isFeatured?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Cake,
  Sparkles,
  Gift,
  Building,
  GraduationCap,
  Baby,
  Home,
};

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating-desc";
type ViewMode = "grid" | "list";

export default function EventsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const catData = (await categoryAPI.getAll()) as { success: boolean; categories: Category[] };
      if (catData.success) {
        setCategories(catData.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showToast("Failed to load categories", "error");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      const eventData = (await eventAPI.getAll(params)) as { success: boolean; events: Event[] };
      if (eventData.success) {
        setEvents(eventData.events);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      showToast("Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Sparkles;
    return Icon;
  };

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.shortDescription?.toLowerCase().includes(query) ||
          event.category?.name.toLowerCase().includes(query)
      );
    }

    // Price range filter
    result = result.filter(
      (event) => event.basePrice >= priceRange[0] && event.basePrice <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating-desc":
        result.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        break;
    }

    return result;
  }, [events, searchQuery, sortBy, priceRange]);

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)", icon: SortAsc },
    { value: "name-desc", label: "Name (Z-A)", icon: SortDesc },
    { value: "price-asc", label: "Price (Low to High)", icon: SortAsc },
    { value: "price-desc", label: "Price (High to Low)", icon: SortDesc },
    { value: "rating-desc", label: "Top Rated", icon: Star },
  ];

  const priceRanges = [
    { label: "All Prices", value: [0, 100000] as [number, number] },
    { label: "Under ₹15,000", value: [0, 15000] as [number, number] },
    { label: "₹15,000 - ₹35,000", value: [15000, 35000] as [number, number] },
    { label: "₹35,000 - ₹75,000", value: [35000, 75000] as [number, number] },
    { label: "Above ₹75,000", value: [75000, 100000] as [number, number] },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("name-asc");
    setPriceRange([0, 100000]);
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || sortBy !== "name-asc" || priceRange[0] !== 0 || priceRange[1] !== 100000;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 gradient-primary text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" /> Premium Events
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">
                Explore Our <span className="text-gradient">Event Categories</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                From intimate gatherings to grand celebrations, find the perfect event package for
                your special moments.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search events, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-10 py-6 text-lg rounded-full border-border/50 bg-card shadow-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-6 px-4 border-b border-border/50 sticky top-20 bg-background/95 backdrop-blur-sm z-30">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className={selectedCategory === "all" ? "gradient-primary shrink-0" : "shrink-0"}
                >
                  All Events
                </Button>
                {categories.slice(0, 5).map((cat) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <Button
                      key={cat._id}
                      variant={selectedCategory === cat.slug ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`shrink-0 ${selectedCategory === cat.slug ? "gradient-primary" : ""}`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {cat.name}
                    </Button>
                  );
                })}
                {categories.length > 5 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="shrink-0">
                        More <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {categories.slice(5).map((cat) => {
                        const Icon = getIcon(cat.icon);
                        return (
                          <DropdownMenuItem
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat.slug)}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {cat.name}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Right: Sort, View, Filter Toggle */}
              <div className="flex items-center gap-2">
                {/* Price Range */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      Price
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {priceRanges.map((range) => (
                      <DropdownMenuItem
                        key={range.label}
                        onClick={() => setPriceRange(range.value)}
                        className={
                          priceRange[0] === range.value[0] && priceRange[1] === range.value[1]
                            ? "bg-primary/10"
                            : ""
                        }
                      >
                        {range.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SortAsc className="h-4 w-4 mr-1" />
                      Sort
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={sortBy === option.value ? "bg-primary/10" : ""}
                      >
                        <option.icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* View Toggle */}
                <div className="hidden md:flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-r-none ${viewMode === "grid" ? "gradient-primary" : ""}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-l-none ${viewMode === "list" ? "gradient-primary" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {priceRange[0] !== 0 || priceRange[1] !== 100000 ? (
                  <Badge variant="secondary" className="gap-1">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                    <button onClick={() => setPriceRange([0, 100000])}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Results Count */}
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `Showing ${filteredAndSortedEvents.length} events`}
            </p>
          </div>
        </section>

        {/* Events Grid/List */}
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedEvents.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredAndSortedEvents.map((event, index) => {
                    const Icon = getIcon(event.category?.icon || "Sparkles");

                    if (viewMode === "list") {
                      return (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link href={`/events/${event.slug}`}>
                            <Card className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                              <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                  <div className="relative w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                                    <div
                                      className="w-16 h-16 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: event.category?.color || "#9333ea" }}
                                    >
                                      <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    {event.isFeatured && (
                                      <Badge className="absolute top-3 left-3 gradient-gold text-foreground border-0">
                                        Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <Badge
                                          variant="outline"
                                          className="mb-2"
                                          style={{
                                            borderColor: event.category?.color,
                                            color: event.category?.color,
                                          }}
                                        >
                                          {event.category?.name}
                                        </Badge>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                          {event.name}
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                          {event.shortDescription}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                          <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {event.locations.join(", ")}
                                          </span>
                                          {event.rating.count > 0 && (
                                            <span className="flex items-center gap-1">
                                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                              {event.rating.average.toFixed(1)} ({event.rating.count})
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="text-xs text-muted-foreground">Starting from</p>
                                        <p className="text-2xl font-bold text-primary">
                                          ₹{event.basePrice.toLocaleString()}
                                        </p>
                                        <Button className="mt-2 gradient-primary text-primary-foreground">
                                          View Details
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link href={`/events/${event.slug}`}>
                          <Card className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
                            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <div
                                className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ backgroundColor: event.category?.color || "#9333ea" }}
                              >
                                <Icon className="h-10 w-10 text-white" />
                              </div>
                              {event.rating.count > 0 && (
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium">
                                    {event.rating.average.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {event.isFeatured && (
                                <Badge className="absolute top-3 left-3 gradient-gold text-foreground border-0">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardContent className="p-5">
                              <Badge
                                variant="outline"
                                className="mb-2"
                                style={{
                                  borderColor: event.category?.color,
                                  color: event.category?.color,
                                }}
                              >
                                {event.category?.name}
                              </Badge>
                              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                {event.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {event.shortDescription}
                              </p>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground">Starting from</p>
                                  <p className="text-lg font-bold text-primary">
                                    ₹{event.basePrice.toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {event.locations.join(", ")}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-20">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No events found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters} className="gradient-primary text-primary-foreground">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat, index) => {
                const Icon = getIcon(cat.icon);
                return (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full group p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all text-center"
                    >
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: cat.color }} />
                      </div>
                      <p className="font-medium text-sm">{cat.name}</p>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
