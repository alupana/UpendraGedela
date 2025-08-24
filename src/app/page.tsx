"use client"
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Film, Instagram, Facebook, Youtube, Mail, ExternalLink, Play, X, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { easeInOut } from "framer-motion";
import Image from "next/image";
/**
 * Cinematographer Portfolio – Single File React Component
 * ------------------------------------------------------
 * ✅ Tech: React + TailwindCSS + Framer Motion + shadcn/ui + lucide-react
 * ✅ Features:
 *   - Responsive sticky navbar with smooth scrolling
 *   - Hero section with call-to-action
 *   - Photo gallery with tag filters + search + lightbox modal
 *   - Video showcase with embedded YouTube iframes and external links
 *   - Social links (Instagram / Facebook / YouTube) with follower callouts
 *   - Contact section (mailto fallback) with location and phone
 *   - Subtle animations and polished, modern UI
 */

// ---------------------------
// 🧩 DATA BLOCKS – EDIT ME!
// ---------------------------
const BRAND = {
  name: "Upendra Gedela",
  role: "Cinematographer",
  tagline: "Stories in motion. Light as a language.",
  email: "upendragedela85@gmail.com",
  phone: "+91 8555050020",
  location: "Hyderabad, India",
};

// Photo items – use real image URLs (preferably high-res). Include tags for filtering.
const PHOTOS: Array<{
  id: string;
  src: string;
  alt: string;
  tags: string[];
  width: number;
  height: number;
}> = [
    {
      id: "p1",
      src: "/images/QUTUB.jpg",
      alt: "Golden hour portrait on 35mm",
      tags: ["portrait", "35mm", "golden hour"],
      width: 1600,
      height: 1067,
    },
    {
      id: "p2",
      src: "/images/paint.jpg",
      alt: "Urban night scene – neon",
      tags: ["night", "neon", "urban"],
      width: 1600,
      height: 900,
    },
    {
      id: "p3",
      src: "/images/pigion.jpg",
      alt: "Wide landscape establishing shot",
      tags: ["landscape", "establishing", "wide"],
      width: 1600,
      height: 900,
    },
    {
      id: "p4",
      src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
      alt: "Documentary close-up",
      tags: ["documentary", "close-up"],
      width: 1600,
      height: 1067,
    },
    {
      id: "p5",
      src: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
      alt: "Product cinematic lighting",
      tags: ["product", "studio", "commercial"],
      width: 1600,
      height: 1067,
    },
    {
      id: "p6",
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
      alt: "Silhouette against sunset",
      tags: ["silhouette", "sunset", "drama"],
      width: 1600,
      height: 900,
    },
  ];

// Video items – use YouTube IDs. Thumbnails are generated automatically via img.youtube.com
const VIDEOS: Array<{
  id: string;
  title: string;
  youtubeId: string;
  tags: string[];
}> = [
    { id: "v1", title: "Em Ledu", youtubeId: "QSuFKByG_R0", tags: ["Short Film", "Drama"] },
    { id: "v2", title: "Panic Button - PSA", youtubeId: "suwIRZ9wLT4", tags: ["Awareness", "Public Service Announcement"] },
    { id: "v3", title: "Save Water - PSA", youtubeId: "H0ibKa4zXKo", tags: ["Environmental", "Public Service Announcement"] },
  ];

// Social links – swap your handles/URLs
const SOCIALS = [
  {
    name: "Instagram", icon: Instagram, href: "https://instagram.com/ft.upii._", handle: "@ᴜᴘᴇɴᴅʀᴀ"
  },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/172JEGxper/", handle: "@ᴜᴘᴇɴᴅʀᴀ" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@upendra_xi?feature=shared", handle: "@ᴜᴘᴇɴᴅʀᴀ" },
];

// ---------------------------
// 🎨 DESIGN TOKENS
// ---------------------------
const CONTAINER = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const SECTION = "py-16 sm:py-20";

// Motion helpers - FIXED: Changed ease to use proper cubic bezier array
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: easeInOut },
};

// Smooth scroll for in-page anchors (no external dep needed)
function useSmoothScroll() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLAnchorElement;
      if (t && t.matches('a[href^="#"]')) {
        const id = t.getAttribute("href")!.slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}

// Utility: Get YouTube thumbnail
const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

// ---------------------------
// 🔥 MAIN COMPONENT
// ---------------------------
export default function CinematographerPortfolio() {
  useSmoothScroll();
  const [photoQuery, setPhotoQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; photo?: typeof PHOTOS[number] }>(() => ({ open: false }));
  const [videoId, setVideoId] = useState<string | null>(null);

  const photoTags = useMemo(() => {
    const tags = new Set<string>();
    PHOTOS.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const filteredPhotos = useMemo(() => {
    let list = PHOTOS;
    if (activeTag) list = list.filter(p => p.tags.includes(activeTag));
    if (photoQuery.trim()) {
      const q = photoQuery.toLowerCase();
      list = list.filter(p => p.alt.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    return list;
  }, [photoQuery, activeTag]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <Nav />

      {/* HERO */}
      <section id="home" className={`${SECTION} ${CONTAINER}`}>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-1 text-sm shadow-sm ring-1 ring-zinc-200 backdrop-blur">
              <Camera className="h-4 w-4" />
              <span>{BRAND.role}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {BRAND.name}
            </h1>
            <p className="mt-3 max-w-prose text-zinc-600">
              {BRAND.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-2xl">
                <a href="#photos" className="inline-flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  View Work
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="rounded-2xl">
                <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact
                </a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-600">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{BRAND.location}</span>
              <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" />{BRAND.phone}</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-zinc-200">
              <Image
                src={PHOTOS[0].src}
                alt={PHOTOS[0].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-pink-300/50 to-purple-300/50 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-300/50 to-teal-300/50 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={`${SECTION}`}>
        <div className={`${CONTAINER}`}>
          <motion.div {...fadeUp}>
            <Card className="rounded-3xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">About</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-700">
                <p>
                  I frame worlds through light, texture, and movement. From narrative films to
                  commercial spots and music videos, I partner with directors and producers to
                  craft visuals that feel inevitable.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* PHOTOS */}
      <section id="photos" className={`${SECTION} bg-zinc-50/60`}>
        <div className={`${CONTAINER}`}>
          <motion.div {...fadeUp} className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Photography</h2>
              <p className="mt-1 text-zinc-600">Curated stills from sets, locations, and studio work.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search by caption or tag…"
                className="w-56 rounded-2xl"
                value={photoQuery}
                onChange={(e) => setPhotoQuery(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="mb-6 flex flex-wrap gap-2">
            <Badge
              onClick={() => setActiveTag(null)}
              variant={activeTag === null ? "default" : "secondary"}
              className="cursor-pointer rounded-2xl px-3 py-1"
            >
              All
            </Badge>
            {photoTags.map((tag) => (
              <Badge
                key={tag}
                onClick={() => setActiveTag(tag)}
                variant={activeTag === tag ? "default" : "secondary"}
                className="cursor-pointer rounded-2xl px-3 py-1 capitalize"
              >
                {tag}
              </Badge>
            ))}
          </motion.div>

          {/* Masonry-style grid using CSS columns for a lightweight layout */}
          <div className="[&>figure]:mb-4 columns-1 gap-4 sm:columns-2 md:columns-3">
            {filteredPhotos.map((p) => (
              <motion.figure key={p.id} {...fadeUp} className="break-inside-avoid">
                <button
                  onClick={() => setLightbox({ open: true, photo: p })}
                  className="group relative block w-full overflow-hidden rounded-2xl ring-1 ring-zinc-200"
                  aria-label={`Open photo: ${p.alt}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-3 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    <span className="line-clamp-2 pr-2">{p.alt}</span>
                    <span className="flex shrink-0 gap-1">
                      {p.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm">{t}</span>
                      ))}
                    </span>
                  </figcaption>
                </button>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos" className={`${SECTION}`}>
        <div className={`${CONTAINER}`}>
          <motion.div {...fadeUp} className="mb-8">
            <h2 className="text-3xl font-semibold">Video Work</h2>
            <p className="mt-1 text-zinc-600">Selected commercials, shorts, and music videos.</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((v) => (
              <motion.div key={v.id} {...fadeUp}>
                <Card className="group overflow-hidden rounded-2xl border-zinc-200 shadow-sm">
                  <div className="relative">
                    <button
                      onClick={() => setVideoId(v.youtubeId)}
                      className="block w-full"
                      aria-label={`Play ${v.title}`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={ytThumb(v.youtubeId)}
                          alt={v.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/50 p-3 backdrop-blur">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">{v.title}</h3>
                      <p className="mt-0.5 text-xs text-zinc-500 capitalize">{v.tags.join(" • ")}</p>
                    </div>
                    <Button variant="outline" asChild size="sm" className="rounded-xl">
                      <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4" />
                        Watch
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIALS */}
      <section id="socials" className={`${SECTION} bg-zinc-50/60`}>
        <div className={`${CONTAINER}`}>
          <motion.div {...fadeUp} className="mb-8">
            <h2 className="text-3xl font-semibold">Social</h2>
            <p className="mt-1 text-zinc-600">Latest frames, BTS, and announcements.</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIALS.map((s) => (
              <motion.div key={s.name} {...fadeUp}>
                <Card className="overflow-hidden rounded-2xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur transition hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <s.icon className="h-6 w-6" />
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-zinc-500">{s.handle}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button asChild className="rounded-xl">
                        <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" /> Visit
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="rounded-xl">
                        <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4" /> Follow
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`${SECTION}`}>
        <div className={`${CONTAINER}`}>
          <motion.div {...fadeUp} className="mb-8">
            <h2 className="text-3xl font-semibold">Let&apos;s Collaborate</h2>
            <p className="mt-1 text-zinc-600">Share your project brief, dates, and references.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Input placeholder="Your name" required className="rounded-xl" />
                  <Input type="email" placeholder="Your email" required className="rounded-xl" />
                  <Input placeholder="Subject / Project" className="rounded-xl" />
                  <Textarea placeholder="Tell me about your project…" className="min-h-[120px] rounded-xl" />
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => window.location.href = `mailto:${BRAND.email}`}
                      className="rounded-xl"
                    >
                      Send
                    </Button>
                    <Button variant="outline" className="rounded-xl">Reset</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <ul className="space-y-3 text-zinc-700">
                  <li className="flex items-center gap-3"><Mail className="h-5 w-5" /><a className="hover:underline" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
                  <li className="flex items-center gap-3"><Phone className="h-5 w-5" /><span>{BRAND.phone}</span></li>
                  <li className="flex items-center gap-3"><MapPin className="h-5 w-5" /><span>{BRAND.location}</span></li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  {SOCIALS.map((s) => (
                    <Button key={s.name} asChild variant="outline" className="rounded-xl">
                      <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                        <s.icon className="h-4 w-4" /> {s.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white/80 py-8 text-sm text-zinc-600">
        <div className={`${CONTAINER} flex flex-col items-center justify-between gap-4 sm:flex-row`}>
          <div className="inline-flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>{BRAND.name} — {BRAND.role}</span>
          </div>
          <nav className="flex flex-wrap items-center gap-4">
            <a href="#home" className="hover:text-zinc-900">Home</a>
            <a href="#about" className="hover:text-zinc-900">About</a>
            <a href="#photos" className="hover:text-zinc-900">Photos</a>
            <a href="#videos" className="hover:text-zinc-900">Videos</a>
            <a href="#socials" className="hover:text-zinc-900">Social</a>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </nav>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      <Dialog open={lightbox.open} onOpenChange={(o) => !o && setLightbox({ open: false })}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <div className="relative overflow-hidden rounded-2xl">
            <button
              onClick={() => setLightbox({ open: false })}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur"
              aria-label="Close image"
            >
              <X className="h-5 w-5" />
            </button>
            {lightbox.photo && (
              <Image src={lightbox.photo.src} alt={lightbox.photo.alt} className="max-h-[80vh] w-full object-contain bg-black" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* VIDEO MODAL */}
      <Dialog open={!!videoId} onOpenChange={(o) => !o && setVideoId(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <div className="relative overflow-hidden rounded-2xl">
            <button
              onClick={() => setVideoId(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            {videoId && (
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------
// 🧭 NAVBAR
// ---------------------------
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-40 w-full ${scrolled ? "backdrop-blur bg-white/70 shadow-sm" : "bg-transparent"}`}>
      <div className={`${CONTAINER} flex h-16 items-center justify-between`}>
        <a href="#home" className="inline-flex items-center gap-2 font-medium">
          <Camera className="h-5 w-5" /> {BRAND.name}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#about" className="text-sm text-zinc-600 hover:text-zinc-900">About</a>
          <a href="#photos" className="text-sm text-zinc-600 hover:text-zinc-900">Photos</a>
          <a href="#videos" className="text-sm text-zinc-600 hover:text-zinc-900">Videos</a>
          <a href="#socials" className="text-sm text-zinc-600 hover:text-zinc-900">Social</a>
          <a href="#contact" className="text-sm text-zinc-600 hover:text-zinc-900">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="rounded-xl">
            <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> Hire Me
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}