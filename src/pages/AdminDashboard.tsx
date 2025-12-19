import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Eye, EyeOff, Image as ImageIcon, Plus, Trash2, Settings, LayoutGrid } from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type PortfolioItem = {
  id: number;
  img: string;
  title: string;
};

type DesignListing = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  image: string;
  video?: string;
  starting?: boolean;
  discountEnabled?: boolean;
  discountPercentage?: number;
  createdAt: number;
};

type GalleryItem = {
  id: string;
  category: string;
  subtitle: string;
  image: string;
  video?: string;
  url: string;
  createdAt: number;
};

const LS_KEYS = {
  portfolio: "yasa_portfolio_images",
  navbarDisplay: "yasa_navbar_display",
  navbarText: "yasa_navbar_marquee_text",
  feedNews: "yasa_feed_news_marquee",
  heroTitle: "yasa_hero_title",
  heroSubtitle: "yasa_hero_subtitle",
  heroDescription: "yasa_hero_description",
  portfolioHeading: "yasa_portfolio_heading",
  listings: "yasa_design_listings_v1",
  gallery: "yasa_gallery_items",
};

const GALLERY_CATEGORIES = [
  "Business Card Design",
  "Letterhead Design",
  "Envelope Design",
  "Flyer Design",
  "Leaflet Design",
  "Poster Design",
  "Motion Poster",
  "Ticket Design",
  "Banner & Cutout Design",
  "Label & Packaging Design",
  "Product Design",
  "Social Media Post Design",
  "Social Media Story Design",
  "Social Media Ad Creatives",
  "Instagram Reels Cover Design",
  "Facebook & YouTube Thumbnails",
  "Employee ID Card Design",
  "Company Profile Design",
  "Presentation (PPT) Design",
  "Invoice & Quotation Design",
  "TikTok Video Editing",
  "Short Video Editing (Reels / Shorts)",
  "AI Video Animation",
  "Intro / Outro Videos",
  "Promo Video Editing",
  "T-Shirt Design",
  "Hoodie & Apparel Design",
  "Sticker Design",
  "Mug & Merchandise Design",
  "Web Design",
  "Landing Page Design",
  "Website Banner Design",
  "Logo Design",
  "Logo Animation",
  "Ai Marketing Video",
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: 1, img: "/Assets/portfolio1.png", title: "Logo Design" },
  { id: 2, img: "/Assets/portfolio2.png", title: "Social Media Post" },
  { id: 3, img: "/Assets/portfolio3.png", title: "Web Design" },
  { id: 4, img: "/Assets/portfolio4.png", title: "Branding" },
  { id: 5, img: "/Assets/portfolio5.png", title: "Animation" },
];

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("localStorage save failed:", error);
  }
}


// Compress and resize image to optimize storage
async function compressImage(file: File, maxWidth = 900, maxHeight = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context error"));

        ctx.drawImage(img, 0, 0, width, height);
        const out = canvas.toDataURL(file.type || "image/jpeg", quality);
        resolve(out);
      };
      img.onerror = () => reject(new Error("Image load error"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"listings" | "portfolio" | "gallery" | "navbar" | "hero">("listings");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showNavbar, setShowNavbar] = useState(true);
  const [navbarText, setNavbarText] = useState("");
  const [feedNews, setFeedNews] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [portfolioHeading, setPortfolioHeading] = useState("");

  // Listings form fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [listTitle, setListTitle] = useState("");
  const [listSubtitle, setListSubtitle] = useState("");
  const [listCategory, setListCategory] = useState("Business Card Design");
  const [listPrice, setListPrice] = useState<number>(5000);
  const [listImage, setListImage] = useState("");
  const [listVideo, setListVideo] = useState("");
  const [listStarting, setListStarting] = useState(false);
  const [listDiscountEnabled, setListDiscountEnabled] = useState(false);
  const [listDiscountPercentage, setListDiscountPercentage] = useState<number>(0);

  const [portTitle, setPortTitle] = useState("");
  const [portImg, setPortImg] = useState("");

  // Gallery form fields
  const [galleryCategory, setGalleryCategory] = useState("Business Card Design");
  const [gallerySubtitle, setGallerySubtitle] = useState("");
  const [galleryImage, setGalleryImage] = useState("");
  const [galleryVideo, setGalleryVideo] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const username = localStorage.getItem("adminUser");

    if (!token || !username) {
      navigate("/admin-login");
      return;
    }

    setIsAuthenticated(true);

    const storedPortfolio = loadJSON<PortfolioItem[]>(LS_KEYS.portfolio, DEFAULT_PORTFOLIO);
    const storedNavbarDisplay = loadJSON<boolean>(LS_KEYS.navbarDisplay, true);
    const storedNavbarText = loadJSON<string>(
      LS_KEYS.navbarText,
      "📢 Welcome to Yasa Graphics — Expert Design Solutions!"
    );
    const storedFeedNews = loadJSON<string>(LS_KEYS.feedNews, "🔥 Logo Design • Branding • Social Media Posts | 🎬 Video Editing • Logo Animations • Reels | 🖼 Posters • Banners • Flyers • Print Designs | 👕 T-Shirt & Merchandise Designs | 🌟 Modern UI/UX & Website Design");
    const storedHeroTitle = loadJSON<string>(LS_KEYS.heroTitle, "Welcome to Yasa Graphics");
    const storedHeroSubtitle = loadJSON<string>(LS_KEYS.heroSubtitle, "Designs that grow your brand.");
    const storedHeroDescription = loadJSON<string>(LS_KEYS.heroDescription, "We specialize in creating stunning visual identities that make your business stand out. From logo design and branding to social media graphics, posters, banners, video edits, and logo animations — we bring your creative vision to life.");
    const storedPortfolioHeading = loadJSON<string>(LS_KEYS.portfolioHeading, "Our Portfolio");

    setPortfolio(storedPortfolio);
    setShowNavbar(storedNavbarDisplay);
    setNavbarText(storedNavbarText);
    setFeedNews(storedFeedNews);
    setHeroTitle(storedHeroTitle);
    setHeroSubtitle(storedHeroSubtitle);
    setHeroDescription(storedHeroDescription);
    setPortfolioHeading(storedPortfolioHeading);

    setLoading(false);
  }, [navigate]);

  // Load data from Convex
  const listingsData = useQuery(api.designs.list) || [];
  const galleryData = useQuery(api.gallery.list) || [];

  // Convert Convex data to component format
  const listings: DesignListing[] = listingsData.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    subtitle: item.subtitle,
    category: item.category,
    price: item.price,
    image: item.image,
    video: item.video,
    starting: item.starting,
    discountEnabled: item.discountEnabled,
    discountPercentage: item.discountPercentage,
    createdAt: item.createdAt,
  }));

  const gallery: GalleryItem[] = galleryData.map((item) => ({
    id: item.id.toString(),
    category: item.category,
    subtitle: item.description,
    image: item.image_url || "",
    video: item.video_url || "",
    url: item.url || "",
    createdAt: item.createdAt,
  }));

  // Convex mutations
  const createListing = useMutation(api.designs.create);
  const updateListing = useMutation(api.designs.update);
  const deleteListing = useMutation(api.designs.remove);
  const createGalleryItem = useMutation(api.gallery.create);
  const deleteGalleryItem = useMutation(api.gallery.remove);
  const uploadToCloudinary = useAction(api.cloudinary.uploadFile);

  // Site settings mutations
  const updateHeroSection = useMutation(api.siteSettings.updateHeroSection);
  const updatePortfolioHeadingMutation = useMutation(api.siteSettings.updatePortfolioHeading);
  const updateNavbarTextMutation = useMutation(api.siteSettings.updateNavbarText);
  const updateFeedNewsMutation = useMutation(api.siteSettings.updateFeedNews);
  const updatePortfolioImagesMutation = useMutation(api.siteSettings.updatePortfolioImages);

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper function to upload file to Cloudinary
  const uploadFile = async (file: File, folder: string = "yasagraphics"): Promise<string> => {
    const token = localStorage.getItem("adminToken") || "";
    
    try {
      // Convert file to base64
      const fileData = await fileToBase64(file);
      
      // Upload to Cloudinary via Convex action
      const result = await uploadToCloudinary({
        fileData,
        fileName: file.name,
        fileType: file.type,
        folder,
        token,
      });

      if (result.success && result.url) {
        return result.url;
      } else {
        throw new Error("Upload failed: No URL returned");
      }
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      throw new Error(error.message || "Failed to upload file to Cloudinary");
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const categories = [
    "Business Card Design",
    "Letterhead Design",
    "Envelope Design",
    "Flyer Design",
    "Leaflet Design",
    "Poster Design",
    "Motion Poster",
    "Ticket Design",
    "Banner & Cutout Design",
    "Label & Packaging Design",
    "Product Design",
    "Social Media Post Design",
    "Social Media Story Design",
    "Social Media Ad Creatives",
    "Instagram Reels Cover Design",
    "Facebook & YouTube Thumbnails",
    "Employee ID Card Design",
    "Company Profile Design",
    "Presentation (PPT) Design",
    "Invoice & Quotation Design",
    "TikTok Video Editing",
    "Short Video Editing (Reels / Shorts)",
    "AI Video Animation",
    "Intro / Outro Videos",
    "Promo Video Editing",
    "T-Shirt Design",
    "Hoodie & Apparel Design",
    "Sticker Design",
    "Mug & Merchandise Design",
    "Web Design",
    "Landing Page Design",
    "Website Banner Design",
    "Logo Design",
    "Logo Animation",
    "Ai Marketing Video",
  ];

  const addListing = async () => {
    const title = listTitle.trim();
    const subtitle = listSubtitle.trim();
    const category = listCategory.trim();

    if (!title || !subtitle || !category) {
      showToast("Please fill all required fields (title, subtitle, category).", "error");
      return;
    }

    if (!listImage && !listVideo) {
      showToast("Please upload at least an image or video.", "error");
      return;
    }

    if (listPrice <= 0) {
      showToast("Price must be greater than 0.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken") || "";

      if (editingId) {
        // Update existing listing
        await updateListing({
          id: editingId as Id<"designs">,
          title,
          subtitle,
          category,
          price: listPrice,
          image: listImage.trim() || undefined,
          video: listVideo.trim() || undefined,
          starting: listStarting,
          discountEnabled: listDiscountEnabled,
          discountPercentage: listDiscountEnabled ? listDiscountPercentage : 0,
          token,
        });
        showToast("✓ Design listing updated successfully!", "success");
        setEditingId(null);
      } else {
        // Create new listing
        await createListing({
          title,
          subtitle,
          category,
          price: listPrice,
          image: listImage.trim() || undefined,
          video: listVideo.trim() || undefined,
          starting: listStarting,
          discountEnabled: listDiscountEnabled,
          discountPercentage: listDiscountEnabled ? listDiscountPercentage : 0,
          token,
        });
        showToast("✓ Design listing created successfully!", "success");
      }

      setListTitle("");
      setListSubtitle("");
      setListImage("");
      setListVideo("");
      setListPrice(5000);
      setListCategory("Business Card Design");
      setListStarting(false);
      setListDiscountEnabled(false);
      setListDiscountPercentage(0);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to save listing.", "error");
    }
  };

  const editListing = (listing: DesignListing) => {
    setEditingId(listing.id);
    setListTitle(listing.title || "");
    setListSubtitle(listing.subtitle || "");
    setListCategory(listing.category || "Business Card Design");
    setListPrice(listing.price || 5000);
    setListImage(listing.image || "");
    setListVideo(listing.video || "");
    setListStarting(listing.starting || false);
    setListDiscountEnabled(listing.discountEnabled || false);
    setListDiscountPercentage(listing.discountPercentage || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setListTitle("");
    setListSubtitle("");
    setListImage("");
    setListVideo("");
    setListPrice(5000);
    setListCategory("Business Card Design");
    setListStarting(false);
    setListDiscountEnabled(false);
    setListDiscountPercentage(0);
  };

  const deleteListingHandler = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken") || "";
      await deleteListing({
        id: id as Id<"designs">,
        token,
      });
      showToast("✓ Listing deleted successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to delete listing.", "error");
    }
  };

  const addPortfolio = () => {
    const title = portTitle.trim();
    const img = portImg.trim();

    if (!title || !img) {
      showToast("Please add a title and upload an image.", "error");
      return;
    }

    if (portfolio.length >= 5) {
      showToast("Maximum 5 portfolio items allowed.", "error");
      return;
    }

    const newItem: PortfolioItem = {
      id: Math.max(0, ...portfolio.map((p) => p.id)) + 1,
      img,
      title,
    };

    setPortfolio((prev) => [newItem, ...prev]);
    setPortTitle("");
    setPortImg("");
    showToast("✓ Portfolio item saved!", "success");
  };

  const deletePortfolio = (id: number) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
    showToast("Deleted!", "success");
  };

  // Gallery functions
  const addGalleryItem = async () => {
    const category = galleryCategory.trim();
    const subtitle = gallerySubtitle.trim();
    const url = galleryUrl.trim();

    if (!category || !subtitle) {
      showToast("Please fill in category and subtitle.", "error");
      return;
    }

    // At least one of image, video, or url must be provided
    if (!galleryImage && !galleryVideo && !url) {
      showToast("Please upload at least an image or video, or provide a URL.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken") || "";
      
      await createGalleryItem({
        category,
        title: category, // Using category as title to match DB structure
        description: subtitle,
        image_url: galleryImage || undefined,
        video_url: galleryVideo || undefined,
        url: url || undefined,
        token,
      });

      setGalleryCategory("Business Card Design");
      setGallerySubtitle("");
      setGalleryImage("");
      setGalleryVideo("");
      setGalleryUrl("");
      showToast("✓ Gallery item added successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to add gallery item.", "error");
    }
  };

  const deleteGalleryItemHandler = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken") || "";
      await deleteGalleryItem({
        id: id as Id<"profiling">,
        token,
      });
      showToast("Gallery item deleted!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to delete gallery item.", "error");
    }
  };

  // Auto-save portfolio images to Convex
  useEffect(() => {
    if (portfolio.length > 0) {
      const t = setTimeout(async () => {
        try {
          await updatePortfolioImagesMutation({ images: portfolio });
          saveJSON(LS_KEYS.portfolio, portfolio); // Also save to localStorage as backup
        } catch (err) {
          console.error("Failed to save portfolio images:", err);
        }
      }, 400);
      return () => clearTimeout(t);
    }
  }, [portfolio, updatePortfolioImagesMutation]);

  // Auto-save hero section to Convex
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        await updateHeroSection({ title: heroTitle, subtitle: heroSubtitle, description: heroDescription });
        saveJSON(LS_KEYS.heroTitle, heroTitle);
        saveJSON(LS_KEYS.heroSubtitle, heroSubtitle);
        saveJSON(LS_KEYS.heroDescription, heroDescription);
      } catch (err) {
        console.error("Failed to save hero section:", err);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [heroTitle, heroSubtitle, heroDescription, updateHeroSection]);

  // Auto-save navbar text to Convex
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        if (navbarText) {
          await updateNavbarTextMutation({ text: navbarText });
          saveJSON(LS_KEYS.navbarText, navbarText);
        }
      } catch (err) {
        console.error("Failed to save navbar text:", err);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [navbarText, updateNavbarTextMutation]);

  // Auto-save feed news to Convex
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        if (feedNews) {
          await updateFeedNewsMutation({ feedNews });
          saveJSON(LS_KEYS.feedNews, feedNews);
        }
      } catch (err) {
        console.error("Failed to save feed news:", err);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [feedNews, updateFeedNewsMutation]);

  // Auto-save portfolio heading to Convex
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        if (portfolioHeading) {
          await updatePortfolioHeadingMutation({ heading: portfolioHeading });
          saveJSON(LS_KEYS.portfolioHeading, portfolioHeading);
        }
      } catch (err) {
        console.error("Failed to save portfolio heading:", err);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [portfolioHeading, updatePortfolioHeadingMutation]);

  useEffect(() => {
    const t = setTimeout(() => saveJSON(LS_KEYS.navbarDisplay, showNavbar), 300);
    return () => clearTimeout(t);
  }, [showNavbar]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0708]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0b0708] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-sm md:text-base font-extrabold">
              Admin Panel <span className="text-[#f7b500]">• Yasa Graphics</span>
            </h1>
            <p className="text-xs text-white/60 mt-1">Manage portfolio and navbar only.</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 hover:bg-red-700 px-3 py-2 text-xs font-extrabold text-white transition inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTab("listings")}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition inline-flex items-center gap-2
              ${tab === "listings" ? "bg-[#f7b500] text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Design Listings
          </button>

          <button
            onClick={() => setTab("portfolio")}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition inline-flex items-center gap-2
              ${tab === "portfolio" ? "bg-[#f7b500] text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
          >
            <ImageIcon className="w-4 h-4" /> Portfolio Images
          </button>

          <button
            onClick={() => setTab("gallery")}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition inline-flex items-center gap-2
              ${tab === "gallery" ? "bg-[#f7b500] text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
          >
            <ImageIcon className="w-4 h-4" /> Gallery
          </button>

          <button
            onClick={() => setTab("navbar")}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition inline-flex items-center gap-2
              ${tab === "navbar" ? "bg-[#f7b500] text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
          >
            <Settings className="w-4 h-4" /> Navbar Settings
          </button>

          <button
            onClick={() => setTab("hero")}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition inline-flex items-center gap-2
              ${tab === "hero" ? "bg-[#f7b500] text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
          >
            <Settings className="w-4 h-4" /> Hero Section
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Form */}
          <section className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              {tab === "listings" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">
                    {editingId ? "Edit Design Listing" : "Create Design Listing"}
                  </h2>
                  <p className="text-xs text-white/60 mt-1">
                    {editingId ? "Update the design service details." : "Add new design service to Design page."}
                  </p>

                  <div className="mt-4 space-y-3">
                    <label className="block">
                      <span className="text-xs text-white/70">Title</span>
                      <input
                        value={listTitle || ""}
                        onChange={(e) => setListTitle(e.target.value)}
                        placeholder="e.g., Logo Design"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Subtitle</span>
                      <input
                        value={listSubtitle || ""}
                        onChange={(e) => setListSubtitle(e.target.value)}
                        placeholder="e.g., Professional branding for businesses"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Category</span>
                      <select
                        value={listCategory || "Business Card Design"}
                        onChange={(e) => setListCategory(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60 text-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-black text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Price (LKR)</span>
                      <input
                        type="number"
                        value={listPrice || 0}
                        onChange={(e) => setListPrice(Math.max(0, parseInt(e.target.value) || 0))}
                        placeholder="5000"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Upload Image (optional, JPG/PNG/WebP)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const fileUrl = await uploadFile(file);
                              setListImage(fileUrl);
                              showToast("Image uploaded successfully", "success");
                            } catch (err: any) {
                              showToast(err.message || "Failed to upload image.", "error");
                              console.error(err);
                            }
                          }
                        }}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-[#f7b500] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black hover:file:brightness-95 transition"
                      />
                      {listImage && (
                        <div className="mt-2 relative rounded-lg overflow-hidden border border-[#f7b500]/30 bg-black/20 flex items-center justify-between">
                          <img src={listImage} alt="preview" className="h-32 w-full object-cover opacity-80" />
                          <button
                            type="button"
                            onClick={() => setListImage("")}
                            className="absolute top-1 right-1 text-white/50 hover:text-red-400 transition bg-black/50 rounded px-2 py-1 text-xs"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Video Upload (optional)</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.currentTarget.files?.[0];
                          if (!file) return;
                          
                          try {
                            const fileUrl = await uploadFile(file);
                            setListVideo(fileUrl);
                            showToast("Video uploaded successfully", "success");
                          } catch (err: any) {
                            showToast(err.message || "Failed to upload video", "error");
                            console.error(err);
                          }
                        }}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-[#f7b500] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black hover:file:brightness-95 transition"
                      />
                      {listVideo && (
                        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                          <span>✓</span> Video uploaded
                          <button
                            type="button"
                            onClick={() => setListVideo("")}
                            className="ml-auto text-white/50 hover:text-red-400 transition"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </label>

                    {/* Discount Section */}
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={listDiscountEnabled}
                            onChange={(e) => setListDiscountEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border border-white/20 bg-black/30 cursor-pointer accent-[#f7b500]"
                          />
                          <span className="text-xs font-semibold text-white">Enable Discount</span>
                        </label>
                        <span className="text-xs text-[#f7b500] font-bold">
                          {listDiscountEnabled && listDiscountPercentage > 0
                            ? `Discount: ${listDiscountPercentage}% OFF`
                            : ""}
                        </span>
                      </div>
                      {listDiscountEnabled && (
                        <div className="space-y-2">
                          <label className="block">
                            <span className="text-xs text-white/70">Discount Percentage (%)</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={listDiscountPercentage || 0}
                              onChange={(e) => setListDiscountPercentage(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                              placeholder="e.g., 15"
                              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                            />
                          </label>
                          {listDiscountPercentage > 0 && (
                            <div className="text-xs text-[#f7b500] bg-black/40 rounded p-2">
                              <p>Original: LKR {listPrice.toLocaleString()}</p>
                              <p>Discount: LKR {Math.round((listPrice * listDiscountPercentage) / 100).toLocaleString()}</p>
                              <p className="font-bold">Final: LKR {Math.round(listPrice * (1 - listDiscountPercentage / 100)).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={listStarting}
                        onChange={(e) => setListStarting(e.target.checked)}
                        className="w-4 h-4 rounded border border-white/20 bg-black/30 cursor-pointer accent-[#f7b500]"
                      />
                      <span className="text-xs text-white/70">Show "Starting" tag on Design page</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={addListing}
                        className="flex-1 rounded-lg bg-[#f7b500] px-4 py-2 text-sm font-extrabold text-black hover:brightness-95 transition inline-flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> {editingId ? "Update Listing" : "Create Listing"}
                      </button>
                      {editingId && (
                        <button
                          onClick={cancelEdit}
                          className="flex-1 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-extrabold text-red-300 hover:bg-red-500/30 transition inline-flex items-center justify-center gap-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : tab === "portfolio" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Add Portfolio Image</h2>
                  <p className="text-xs text-white/60 mt-1">Max 5 images.</p>

                  <div className="mt-4 space-y-3">
                    <label className="block">
                      <span className="text-xs text-white/70">Project Title</span>
                      <input
                        value={portTitle || ""}
                        onChange={(e) => setPortTitle(e.target.value)}
                        placeholder="e.g., Logo Design"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Upload Image (JPG/PNG/WebP)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const compressed = await compressImage(file);
                            setPortImg(compressed);
                          } catch (err) {
                            console.error(err);
                            showToast("Failed to process image.", "error");
                          }
                        }}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70
                          file:mr-3 file:rounded file:border-0 file:bg-[#f7b500] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black hover:file:brightness-95 transition"
                      />

                      {portImg && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-[#f7b500]/30 bg-black/20">
                          <img src={portImg} alt="preview" className="h-32 w-full object-cover opacity-90" />
                        </div>
                      )}
                    </label>

                    <button
                      onClick={addPortfolio}
                      className="w-full rounded-lg bg-[#f7b500] px-4 py-2 text-sm font-extrabold text-black hover:brightness-95 transition inline-flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Portfolio Item
                    </button>
                  </div>
                </>
              ) : tab === "gallery" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Add Gallery Item</h2>
                  <p className="text-xs text-white/60 mt-1">Upload images/videos with category and URL.</p>

                  <div className="mt-4 space-y-3">
                    <label className="block">
                      <span className="text-xs text-white/70">Category</span>
                      <select
                        value={galleryCategory || "Business Card Design"}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60 text-white"
                      >
                        {GALLERY_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} className="bg-black text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Subtitle/Description</span>
                      <input
                        value={gallerySubtitle || ""}
                        onChange={(e) => setGallerySubtitle(e.target.value)}
                        placeholder="e.g., Project description"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Upload Image (JPG/PNG/WebP)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const fileUrl = await uploadFile(file);
                              setGalleryImage(fileUrl);
                              showToast("Image uploaded successfully", "success");
                            } catch (err: any) {
                              showToast(err.message || "Failed to upload image.", "error");
                              console.error(err);
                            }
                          }
                        }}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-[#f7b500] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black hover:file:brightness-95 transition"
                      />
                      {galleryImage && (
                        <div className="mt-2 relative rounded-lg overflow-hidden border border-[#f7b500]/30 bg-black/20">
                          <img src={galleryImage} alt="preview" className="h-32 w-full object-cover opacity-80" />
                          <button
                            type="button"
                            onClick={() => setGalleryImage("")}
                            className="absolute top-1 right-1 text-white/50 hover:text-red-400 transition bg-black/50 rounded px-2 py-1 text-xs"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Upload Video (optional)</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.currentTarget.files?.[0];
                          if (!file) return;
                          
                          try {
                            const fileUrl = await uploadFile(file);
                            setGalleryVideo(fileUrl);
                            showToast("Video uploaded successfully", "success");
                          } catch (err: any) {
                            showToast(err.message || "Failed to upload video", "error");
                            console.error(err);
                          }
                        }}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-[#f7b500] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black hover:file:brightness-95 transition"
                      />
                      {galleryVideo && (
                        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                          <span>✓</span> Video uploaded
                          <button
                            type="button"
                            onClick={() => setGalleryVideo("")}
                            className="ml-auto text-white/50 hover:text-red-400 transition"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">URL/Link</span>
                      <input
                        type="text"
                        value={galleryUrl || ""}
                        onChange={(e) => setGalleryUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <button
                      onClick={addGalleryItem}
                      className="w-full rounded-lg bg-[#f7b500] px-4 py-2 text-sm font-extrabold text-black hover:brightness-95 transition inline-flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add to Gallery
                    </button>
                  </div>
                </>
              ) : tab === "navbar" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Navbar Settings</h2>
                  <p className="text-xs text-white/60 mt-1">Control navbar visibility + marquee text.</p>

                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="text-xs text-white/70">Marquee Text</span>
                      <textarea
                        value={navbarText || ""}
                        onChange={(e) => setNavbarText(e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60 resize-none"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Feed News (Home Page Marquee)</span>
                      <textarea
                        value={feedNews || ""}
                        onChange={(e) => setFeedNews(e.target.value)}
                        rows={3}
                        placeholder="Enter news items separated by | symbol&#10;e.g: 🔥 Logo Design | 🎬 Video Editing"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60 resize-none"
                      />
                      <p className="text-xs text-white/40 mt-1">💡 Separate items with " | " symbol</p>
                    </label>

                    <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-4 py-3">
                      <span className="text-sm font-semibold">Show Navbar</span>
                      <button
                        onClick={() => setShowNavbar((v) => !v)}
                        type="button"
                        className="inline-flex items-center gap-2 text-sm font-semibold"
                      >
                        {showNavbar ? (
                          <Eye className="w-5 h-5 text-[#f7b500]" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-white/60" />
                        )}
                      </button>
                    </label>

                    <p className="text-xs text-white/50 leading-5">
                      Changes auto-save to localStorage. Refresh your site to see updates.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Hero Section Settings</h2>
                  <p className="text-xs text-white/60 mt-1">Edit home page hero section text.</p>

                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="text-xs text-white/70">Hero Title</span>
                      <input
                        type="text"
                        value={heroTitle || ""}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        placeholder="Welcome to Yasa Graphics"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Hero Subtitle</span>
                      <input
                        type="text"
                        value={heroSubtitle || ""}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        placeholder="Designs that grow your brand."
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Hero Description</span>
                      <textarea
                        value={heroDescription || ""}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        rows={4}
                        placeholder="We specialize in creating stunning visual identities..."
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60 resize-none"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Portfolio Section Heading</span>
                      <input
                        type="text"
                        value={portfolioHeading || ""}
                        onChange={(e) => setPortfolioHeading(e.target.value)}
                        placeholder="Our Portfolio"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <div className="p-3 rounded-lg bg-[#f7b500]/10 border border-[#f7b500]/30">
                      <p className="text-xs text-white/70">
                        <strong>Preview:</strong>
                      </p>
                      <p className="text-sm font-bold text-white mt-2 line-clamp-2">{heroTitle}</p>
                      <p className="text-xs text-white/80 mt-1">{heroSubtitle}</p>
                      <p className="text-xs text-white/60 mt-2 line-clamp-3">{heroDescription}</p>
                    </div>

                    <p className="text-xs text-white/50 leading-5">
                      Changes auto-save to localStorage. Refresh your site to see updates.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Right List */}
          <section className="lg:col-span-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              {tab === "listings" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Design Listings</h2>
                  <p className="text-xs text-white/60 mt-1">
                    Total listings: {listings.length}
                  </p>

                  <div className="mt-4 grid gap-4 grid-cols-2 max-h-[600px] overflow-y-auto">
                    {listings.length === 0 ? (
                      <p className="text-center text-sm text-white/60 py-8 col-span-2">No listings created yet.</p>
                    ) : (
                      listings.map((listing) => (
                        <div
                          key={listing.id}
                          className="rounded-xl border border-[#f7b500]/20 bg-black/30 p-4"
                        >
                          <div className="flex flex-col gap-3">
                            {listing.image && (
                              <div className="h-24 w-full rounded-lg overflow-hidden bg-black/50">
                                <img
                                  src={listing.image}
                                  alt={listing.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h3 className="text-sm font-extrabold text-white truncate">{listing.title}</h3>
                                  <p className="text-xs text-white/60 mt-1 truncate">{listing.subtitle}</p>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                                <span className="rounded-full bg-[#f7b500]/20 px-2 py-1 text-[#f7b500] font-semibold">
                                  {listing.category}
                                </span>
                                <span className="font-semibold text-white">
                                  LKR {listing.price.toLocaleString()}
                                </span>
                                {listing.video && (
                                  <span className="text-blue-300">📹</span>
                                )}
                              </div>
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => editListing(listing)}
                                  className="flex-1 rounded-lg bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/30 transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteListingHandler(listing.id)}
                                  className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : tab === "portfolio" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Portfolio Images</h2>
                  <p className="text-xs text-white/60 mt-1">
                    {portfolio.length} / 5 uploaded
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const p = portfolio[idx];
                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border overflow-hidden transition ${
                            p
                              ? "border-[#f7b500]/20 bg-white/[0.06] backdrop-blur-xl"
                              : "border-dashed border-white/20 bg-black/20"
                          }`}
                        >
                          <div className="h-40 bg-black/40 flex items-center justify-center overflow-hidden">
                            {p?.img ? (
                              <img src={p.img} alt={p.title} className="h-full w-full object-cover opacity-90" />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-white/30 mx-auto mb-2" />
                                <p className="text-xs text-white/40">Slot {idx + 1}</p>
                              </div>
                            )}
                          </div>

                          {p && (
                            <div className="p-4">
                              <h3 className="text-sm font-extrabold truncate">{p.title}</h3>
                              <button
                                onClick={() => deletePortfolio(p.id)}
                                className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4 text-red-300" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : tab === "gallery" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Gallery Items</h2>
                  <p className="text-xs text-white/60 mt-1">
                    Total items: {gallery.length}
                  </p>

                  <div className="mt-4 grid gap-4 grid-cols-2 max-h-[600px] overflow-y-auto">
                    {gallery.length === 0 ? (
                      <p className="text-center text-sm text-white/60 py-8 col-span-2">No gallery items added yet.</p>
                    ) : (
                      gallery.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-[#f7b500]/20 bg-black/30 p-4"
                        >
                          {item.image && (
                            <div className="h-24 w-full rounded-lg overflow-hidden bg-black/50 mb-3">
                              <img
                                src={item.image}
                                alt={item.category}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-extrabold text-white truncate">{item.category}</h3>
                                <p className="text-xs text-white/60 mt-1 truncate">{item.subtitle}</p>
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#f7b500] hover:underline mt-1 block truncate"
                                  >
                                    {item.url}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              {item.video && (
                                <span className="text-xs text-blue-300">📹 Video</span>
                              )}
                              <button
                                onClick={() => deleteGalleryItemHandler(item.id)}
                                className="ml-auto rounded-lg bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <>
                  {tab === "navbar" ? (
                    <>
                      <h2 className="text-sm font-extrabold text-[#f7b500]">Navbar Preview</h2>
                      <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4 space-y-3">
                        <div>
                          <div className="text-xs text-white/70 font-semibold mb-2">Marquee Text</div>
                          <div className="rounded-lg bg-black/50 p-3 border border-white/5">
                            <p className="text-sm text-yellow-300 break-all">
                              {navbarText || "(empty)"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-white/70 font-semibold mb-2">Navbar Status</div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              showNavbar ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {showNavbar ? "✓ ENABLED" : "✗ DISABLED"}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-sm font-extrabold text-[#f7b500]">Hero Section Preview</h2>
                      <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-6 space-y-4">
                        <div>
                          <div className="text-xs text-white/70 font-semibold mb-2">Title</div>
                          <h1 className="text-2xl font-black text-white line-clamp-2">
                            {heroTitle.split("Yasa Graphics").length > 1 ? (
                              <>
                                {heroTitle.split("Yasa Graphics")[0]}
                                <span className="text-[#f7b500]">Yasa Graphics</span>
                              </>
                            ) : (
                              heroTitle
                            )}
                          </h1>
                        </div>

                        <div>
                          <div className="text-xs text-white/70 font-semibold mb-2">Subtitle</div>
                          <p className="text-lg font-bold text-white/90">{heroSubtitle}</p>
                        </div>

                        <div>
                          <div className="text-xs text-white/70 font-semibold mb-2">Description</div>
                          <p className="text-sm text-white/80 line-clamp-4 leading-5">{heroDescription}</p>
                        </div>

                        <div className="pt-3 text-xs text-white/50">
                          👉 Changes auto-save to localStorage. Refresh site to see updates.
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg font-semibold text-sm shadow-lg z-50 ${
            toast.type === "success"
              ? "bg-green-500/20 border border-green-500/50 text-green-200"
              : "bg-red-500/20 border border-red-500/50 text-red-200"
          }`}
          style={{ animation: "slideIn 0.25s ease-out forwards" }}
        >
          {toast.message}
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(300px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
