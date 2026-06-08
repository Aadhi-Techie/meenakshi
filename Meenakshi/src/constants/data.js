// ─────────────────────────────────────────────────────────────
//  src/constants/data.js
//  All static data that was previously hardcoded inside App.jsx.
//  Components import only what they need.
// ─────────────────────────────────────────────────────────────

// ── Products ─────────────────────────────────────────────────

export const PRODS = {
  glass: {
    id: "glass", name: "Glass", tn: "கண்ணாடி", icon: "🪟",
    tag: "Clarity Redefined",
    clr: "#38bdf8", ga: "#082240", gb: "#041528",
    desc:
      "Premium architectural glass solutions — from shatter-resistant safety " +
      "glass to artistic decorative panels. 200+ variants for every design vision.",
    full:
      "Sri Meenakshi Glass brings Chennai's widest architectural glass range. " +
      "Our collection spans toughened safety glass for facades and shower " +
      "enclosures, laminated glass for noise reduction and UV protection, " +
      "reflective glass for energy-efficient buildings, and exclusive decorative " +
      "patterned glass that transforms ordinary spaces into design statements. " +
      "Every piece certified and quality-checked.",
    feats: [
      "Toughened Safety Glass", "Laminated Glass", "Reflective / One-Way",
      "Frosted & Acid-Etched", "Spider Fittings", "Structural Glazing",
      "Decorative Patterns", "Low-E Coated Glass",
    ],
    vars: [
      { n: "Clear Float Glass",  d: "Crystal-clear 4–19 mm for windows, doors & facades" },
      { n: "Tinted Glass",       d: "Heat-absorbing — grey, green, bronze & blue tones" },
      { n: "Tempered Glass",     d: "5× stronger, safety-rated for high-traffic areas" },
      { n: "Laminated Glass",    d: "PVB-bonded — holds shards on breakage" },
      { n: "Frosted Glass",      d: "Acid-etched for privacy with diffused light" },
      { n: "Reflective Glass",   d: "Solar-control mirror effect for modern facades" },
      { n: "Decorative Glass",   d: "Printed, patterned & colour-back options" },
      { n: "Low-E Glass",        d: "Thermal coating for energy-efficient buildings" },
    ],
    uses: [
      "Shopfronts", "Office Partitions", "Shower Enclosures", "Glass Railings",
      "Table Tops", "Skylights", "Interior Screens", "Feature Walls",
    ],
    gallery: ["🏢", "🚿", "🪟", "✨", "🏗️", "💎"],
  },

  plywoods: {
    id: "plywoods", name: "Plywoods", tn: "பிளைவுட்", icon: "🪵",
    tag: "Built to Last",
    clr: "#f59e0b", ga: "#2a1500", gb: "#180d00",
    desc:
      "Top-grade plywood & boards from certified brands. Marine, BWP, BWR, MDF, " +
      "particle board — everything for construction and interior millwork.",
    full:
      "Our plywood range covers every need from heavy structural use to delicate " +
      "interior millwork. We partner with Greenply, Century, Kitply and Duroply " +
      "for consistent quality. Our technical team guides you on the right grade — " +
      "BWP for exteriors, BWR for kitchens, MR for interiors — saving cost " +
      "without compromising durability.",
    feats: [
      "BWP / BWR Grade", "Commercial MR Grade", "Fire Retardant Boards",
      "Marine Plywood", "Moisture Resistant", "FSC Certified",
      "ISI Marked", "Anti-Termite Treated",
    ],
    vars: [
      { n: "BWP Plywood",    d: "Boiling water proof — fully waterproof for exterior use" },
      { n: "BWR Plywood",    d: "Boiling water resistant — ideal for kitchens & baths" },
      { n: "Commercial MR",  d: "Moisture resistant interior-grade plywood" },
      { n: "Marine Plywood", d: "Maximum waterproofing for marine applications" },
      { n: "MDF Boards",     d: "Dense smooth surface — ideal for furniture & cabinetry" },
      { n: "Particle Board", d: "Economical core for furniture and shelving" },
      { n: "Block Board",    d: "Strong screw-holding for doors and shelves" },
      { n: "Flexi Plywood",  d: "Bendable plywood for curved furniture & interiors" },
    ],
    uses: [
      "Kitchen Cabinets", "Wardrobes", "False Ceilings", "Flooring Substrate",
      "Furniture", "Wall Panelling", "Commercial Fitouts", "Interior Millwork",
    ],
    gallery: ["🪵", "🪑", "🚪", "🏠", "🛋️", "🗄️"],
  },

  upvc: {
    id: "upvc", name: "UPVC", tn: "UPVC", icon: "🏗️",
    tag: "Insulate & Elevate",
    clr: "#34d399", ga: "#012a1a", gb: "#011810",
    desc:
      "Premium UPVC window & door systems. Superior thermal insulation, acoustic " +
      "performance and multi-point security. The smart choice for modern buildings.",
    full:
      "UPVC profiles offer the best combination of performance and economics. Our " +
      "systems feature multi-chamber designs that trap air for thermal insulation, " +
      "double or triple glazing, and high-security multi-point locking. UPVC never " +
      "rusts, rots or needs painting — delivering lifetime value with zero maintenance.",
    feats: [
      "Multi-Chamber Profile", "Double / Triple Glazing", "Thermal Break Design",
      "Acoustic Insulation", "Multi-Point Locks", "UV Stabilised",
      "Lead-Free Formula", "Custom RAL Colours",
    ],
    vars: [
      { n: "Casement Windows",  d: "Classic outward-opening — maximum ventilation" },
      { n: "Sliding Windows",   d: "Space-saving track-based sliding system" },
      { n: "Tilt & Turn",       d: "European-style dual-function window" },
      { n: "Fixed Windows",     d: "Maximum light with fixed glazed panel" },
      { n: "UPVC Doors",        d: "Entrance & interior door systems" },
      { n: "Bay Windows",       d: "Projecting multi-panel arrangements" },
      { n: "Combination Units", d: "Mixed operable and fixed panels" },
      { n: "Mosquito Mesh",     d: "Integrated fly-screen system" },
    ],
    uses: [
      "Residential Villas", "Apartment Complexes", "Hotels", "Hospitals",
      "IT Parks", "Schools", "Hospitals", "Commercial Buildings",
    ],
    gallery: ["🏗️", "🏢", "🏨", "🏫", "🏥", "🏠"],
  },

  wpvc: {
    id: "wpvc", name: "WPVC", tn: "WPVC", icon: "🚪",
    tag: "Weather-Proof Excellence",
    clr: "#a78bfa", ga: "#1e0a42", gb: "#100522",
    desc:
      "Engineered WPVC door & panel solutions built for Chennai's coastal humidity " +
      "and harsh monsoon conditions. Low maintenance, high durability, lasting beauty.",
    full:
      "WPVC profiles are specially formulated for tropical and coastal climates. " +
      "Unlike wood that swells or metal that rusts, WPVC maintains its form through " +
      "monsoons, salty sea air and intense heat. Our WPVC doors are ideal for " +
      "bathrooms, kitchens and exterior applications where traditional materials " +
      "fail within years.",
    feats: [
      "100% Waterproof", "Salt-Air Resistant", "Anti-Fungal Surface",
      "No Painting Needed", "Termite Proof", "Impact Resistant",
      "Easy to Clean", "15-Year Warranty",
    ],
    vars: [
      { n: "Interior Doors",       d: "Bedroom, bathroom & kitchen doors" },
      { n: "Bathroom Doors",       d: "Waterproof, anti-fungal for baths" },
      { n: "Exterior Panels",      d: "Rain-screen cladding & facade panels" },
      { n: "Cabinet Shutters",     d: "Kitchen and wardrobe door shutters" },
      { n: "Partition Walls",      d: "Demountable office & home partitions" },
      { n: "False Ceiling Tiles",  d: "Moisture-proof ceiling panel systems" },
      { n: "WPC Boards",           d: "Wood-polymer composite for decking" },
      { n: "Custom Profiles",      d: "Bespoke sizes and colours on order" },
    ],
    uses: [
      "Bathrooms", "Coastal Villas", "Kitchens", "Resort Projects",
      "Marine Applications", "Hospitals", "Swimming Pool Areas", "Wet Areas",
    ],
    gallery: ["🚪", "🏊", "🏖️", "🏨", "🏥", "🛁"],
  },

  aluminium: {
    id: "aluminium", name: "Aluminium", tn: "அலுமினியம்", icon: "⚙️",
    tag: "Precision Fabricated",
    clr: "#94a3b8", ga: "#111827", gb: "#080e1a",
    desc:
      "Professional aluminium profiles & custom fabrication. Sleek, strong, " +
      "corrosion-free — from slim-line residential to heavy commercial curtain wall systems.",
    full:
      "Aluminium's unmatched strength-to-weight ratio makes it the architect's " +
      "preferred choice for windows, doors, curtain walls and structural glazing. " +
      "Our fabrication workshop handles cutting, welding, anodising and powder " +
      "coating. We work with Hindalco, Jindal and Aludecor profiles with custom " +
      "extrusion available.",
    feats: [
      "Powder Coat Finish", "Anodized Options", "Slim 45mm Profile",
      "Thermal Break", "CNC Fabricated", "Corrosion Resistant",
      "Marine-Grade Alloy", "Custom Extrusion",
    ],
    vars: [
      { n: "Sliding Doors",          d: "Heavy-duty multi-panel sliding systems" },
      { n: "Casement Windows",       d: "Precision-hinged, weather-sealed" },
      { n: "Curtain Wall",           d: "Structural glazing facade systems" },
      { n: "Partition Systems",      d: "Office demountable glass partitions" },
      { n: "Louvres & Vents",        d: "Adjustable blade ventilation panels" },
      { n: "ACP Cladding",           d: "Aluminium composite panel cladding" },
      { n: "Canopies & Pergolas",    d: "Architectural shade structures" },
      { n: "Handrails & Balustrades",d: "Staircase and balcony guard systems" },
    ],
    uses: [
      "Commercial Facades", "IT Parks", "Shopping Malls", "Airports",
      "Showrooms", "Luxury Residences", "Hotels", "Hospitals",
    ],
    gallery: ["🏢", "✈️", "🏬", "🏨", "🏭", "🏛️"],
  },

  hardwares: {
    id: "hardwares", name: "Hardwares", tn: "வன்பொருள்", icon: "🔩",
    tag: "Every Fitting, Perfected",
    clr: "#fbbf24", ga: "#251500", gb: "#150c00",
    desc:
      "3,000+ hardware SKUs — hinges, handles, locks, channels, patch fittings " +
      "and more. Brands: Dorma, Häfele, HETTICH, Godrej, Yale. In stock, ready to deliver.",
    full:
      "No installation is complete without the right hardware. Our section stocks " +
      "3,000+ SKUs from Dorma, Häfele, HETTICH, Godrej and Yale. Whether you need " +
      "soft-close cabinet hinges, SS glass patch fittings, heavy-duty door closers " +
      "or mortise locks — we have it in stock. Technical team helps specify the " +
      "right hardware for load, frequency and aesthetic requirements.",
    feats: [
      "SS 304 Grade", "European Brands", "3000+ SKUs In Stock",
      "Same-Day Delivery", "Bulk Discounts", "Technical Support",
      "Warranty Backed", "Installation Help",
    ],
    vars: [
      { n: "Door Handles",         d: "SS, brass, zinc alloy in all finishes" },
      { n: "Glass Patch Fittings", d: "Spider, patch and floor spring fittings" },
      { n: "Door Closers",         d: "Overhead and concealed door closers" },
      { n: "Mortise Locks",        d: "Multi-point security locking systems" },
      { n: "Cabinet Hardware",     d: "Hinges, channels, handles & knobs" },
      { n: "Tower Bolts",          d: "SS flush & surface bolts" },
      { n: "Seals & Gaskets",      d: "EPDM & silicone weather sealing" },
      { n: "Screws & Fasteners",   d: "SS, zinc and nylon fixing accessories" },
    ],
    uses: [
      "Residential Interiors", "Commercial Fitouts", "Modular Kitchen",
      "Office Furniture", "Glass Installations", "Entry Systems",
      "Retail Shops", "Hospitality Projects",
    ],
    gallery: ["🔩", "🚪", "🏠", "🏢", "🍳", "🏨"],
  },
};

/** Flat array — used wherever a list of all products is needed */
export const PROD_LIST = Object.values(PRODS);

// ── Hero Slides ───────────────────────────────────────────────

export const SLIDES = [
  {
    id: 0, catId: "glass", color: "#38bdf8", icon: "🪟",
    heading: ["Premium", "Glass", "Traders"],
    sub: "Toughened · Laminated · Decorative · Structural",
    bg: "radial-gradient(ellipse at 65% 40%, rgba(56,189,248,0.14) 0%, transparent 58%), radial-gradient(ellipse at 20% 80%, rgba(249,115,22,0.07) 0%, transparent 50%)",
    shapes: [
      { w: 200, h: 200, t: "8%",  l: "72%", br: "14px", o: 0.07, rot: 15 },
      { w: 120, h: 120, t: "60%", l: "78%", br: "50%",  o: 0.05, rot: 0  },
      { w: 80,  h: 80,  t: "20%", l: "58%", br: "12px", o: 0.06, rot: 30 },
    ],
  },
  {
    id: 1, catId: "plywoods", color: "#f59e0b", icon: "🪵",
    heading: ["Quality", "Plywood", "Collection"],
    sub: "BWP · BWR · Marine · MDF · Particle Board",
    bg: "radial-gradient(ellipse at 35% 35%, rgba(245,158,11,0.12) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(249,115,22,0.06) 0%, transparent 50%)",
    shapes: [
      { w: 180, h: 220, t: "5%",  l: "68%", br: "18px", o: 0.07, rot: -8 },
      { w: 100, h: 100, t: "65%", l: "82%", br: "12px", o: 0.05, rot: 20 },
      { w: 60,  h: 60,  t: "40%", l: "60%", br: "50%",  o: 0.06, rot: 0  },
    ],
  },
  {
    id: 2, catId: "upvc", color: "#34d399", icon: "🏗️",
    heading: ["Premium", "UPVC", "Systems"],
    sub: "Windows · Doors · Thermal Break · Multi-Point Lock",
    bg: "radial-gradient(ellipse at 60% 30%, rgba(52,211,153,0.12) 0%, transparent 56%), radial-gradient(ellipse at 25% 70%, rgba(249,115,22,0.06) 0%, transparent 48%)",
    shapes: [
      { w: 160, h: 240, t: "3%",  l: "70%", br: "16px", o: 0.07, rot: 5   },
      { w: 90,  h: 90,  t: "70%", l: "76%", br: "50%",  o: 0.05, rot: 0   },
      { w: 70,  h: 70,  t: "30%", l: "62%", br: "14px", o: 0.06, rot: -20 },
    ],
  },
  {
    id: 3, catId: "aluminium", color: "#94a3b8", icon: "⚙️",
    heading: ["Expert", "Aluminium", "Fabrication"],
    sub: "Curtain Wall · Cladding · Doors · Pergolas · ACP",
    bg: "radial-gradient(ellipse at 55% 45%, rgba(148,163,184,0.1) 0%, transparent 55%), radial-gradient(ellipse at 30% 65%, rgba(249,115,22,0.06) 0%, transparent 48%)",
    shapes: [
      { w: 220, h: 180, t: "6%",  l: "66%", br: "12px", o: 0.06, rot: -12 },
      { w: 110, h: 110, t: "62%", l: "80%", br: "50%",  o: 0.05, rot: 0   },
      { w: 75,  h: 75,  t: "25%", l: "57%", br: "10px", o: 0.07, rot: 25  },
    ],
  },
  {
    id: 4, catId: "hardwares", color: "#fbbf24", icon: "🔩",
    heading: ["Complete", "Hardware", "Range"],
    sub: "Handles · Locks · Hinges · Patch Fittings · 3000+ SKUs",
    bg: "radial-gradient(ellipse at 62% 38%, rgba(251,191,36,0.11) 0%, transparent 56%), radial-gradient(ellipse at 22% 72%, rgba(249,115,22,0.07) 0%, transparent 48%)",
    shapes: [
      { w: 150, h: 150, t: "10%", l: "74%", br: "50%",  o: 0.07, rot: 0   },
      { w: 100, h: 130, t: "58%", l: "78%", br: "14px", o: 0.05, rot: 10  },
      { w: 65,  h: 65,  t: "35%", l: "63%", br: "10px", o: 0.06, rot: -30 },
    ],
  },
];

// ── Services ──────────────────────────────────────────────────

export const SVCS = [
  {
    ic: "🪟", c: "#38bdf8",
    t: "Glass Installation",
    d: "Precision cutting, fitting & silicone sealing for all glass applications — shopfronts to shower enclosures.",
  },
  {
    ic: "⚙️", c: "#94a3b8",
    t: "Aluminium Fabrication",
    d: "Custom aluminium door, window & partition fabrication with CNC precision and powder-coat finishing.",
  },
  {
    ic: "🪵", c: "#f59e0b",
    t: "Interior Material Supply",
    d: "Complete supply of plywood, laminates, veneers, mouldings and hardware for interior fit-outs.",
  },
  {
    ic: "🏗️", c: "#34d399",
    t: "UPVC Window Solutions",
    d: "Full-service UPVC supply-and-fix — site survey, design, installation and after-care support.",
  },
  {
    ic: "📦", c: "#a78bfa",
    t: "Bulk & Custom Orders",
    d: "Competitive pricing for large-volume orders with dedicated account management and priority dispatch.",
  },
  {
    ic: "🔧", c: "#f97316",
    t: "On-Site Technical Support",
    d: "Trained technicians visit your site for measurement, installation guidance and troubleshooting.",
  },
];

// ── Why Choose Us ─────────────────────────────────────────────
// Icons are imported and injected at the component level (avoids
// importing lucide-react here and keeping data.js framework-agnostic).

export const WHY_DATA = [
  { iconKey: "Shield",     c: "#f97316", stat: "100%", sl: "Certified",   t: "ISI Certified Quality",  d: "Every product sourced from certified manufacturers. We never compromise on material standards." },
  { iconKey: "Zap",        c: "#38bdf8", stat: "30%",  sl: "Cost Saving", t: "Best Market Prices",     d: "Direct brand relationships deliver the most competitive rates in Chennai, consistently." },
  { iconKey: "Truck",      c: "#34d399", stat: "24hr", sl: "Dispatch",    t: "Same-Day Delivery",      d: "Same-day dispatch within Chennai. Outstation orders ship within 24 hours guaranteed." },
  { iconKey: "Award",      c: "#a78bfa", stat: "20+",  sl: "Years",       t: "20+ Years Expertise",    d: "Two decades serving architects, contractors and homeowners across Tamil Nadu." },
  { iconKey: "Users",      c: "#f59e0b", stat: "2000+",sl: "Clients",     t: "Dedicated Account Team", d: "A named contact for every project — no call centres, just people who know your job." },
  { iconKey: "Headphones", c: "#fb923c", stat: "6",    sl: "Days/Week",   t: "After-Sales Support",    d: "Post-installation technical help, warranty claims and replacement parts readily available." },
];

// ── Testimonials ──────────────────────────────────────────────

export const TESTS = [
  {
    n: "Rajesh Kumar",    r: "Interior Designer, Chennai",  s: 5,
    t: "Outstanding quality and delivery. I've sourced glass and aluminium for 15+ projects through Sri Meenakshi — never a single complaint. Their technical knowledge is exceptional and the team genuinely cares about project outcomes.",
  },
  {
    n: "Priya Venkatesh", r: "Homeowner, Anna Nagar",       s: 5,
    t: "Renovated our entire home with their plywood and UPVC windows. The quality speaks for itself three years later — no warping, no rust, zero maintenance issues. Highly recommended to anyone doing interior work in Chennai.",
  },
  {
    n: "Mohammed Irfan",  r: "Contractor, Perambur",        s: 5,
    t: "Best bulk supplier in North Chennai. Pricing is sharp, stock is always available and delivery is never late. Sri Meenakshi is my go-to vendor for every project — residential and commercial alike.",
  },
  {
    n: "Lakshmi Devi",    r: "Architect, Kilpauk",          s: 4,
    t: "Professional team that understands architectural specifications. Their aluminium curtain wall system for our commercial project was fabricated perfectly to drawing without a single revision needed.",
  },
  {
    n: "Santhosh Babu",   r: "Developer, Ambattur",         s: 5,
    t: "Ordered 200 UPVC windows for a residential block — flawless quality, on-time delivery and their site team handled the entire installation. Zero snagging issues on final inspection.",
  },
  {
    n: "Anitha Rajan",    r: "Interior Consultant, Adyar",  s: 5,
    t: "Their hardware range is unmatched in Chennai. Same-day delivery saved us on multiple urgent projects. The team's product knowledge helped us specify the right fittings for each application.",
  },
];

// ── Gallery ───────────────────────────────────────────────────

export const GALLERY = [
  { ic: "🪟", l: "Glass Showroom",           cat: "glass",     span: "2/1", h: 240, bg: "rgba(56,189,248,.07)",  c: "#38bdf8" },
  { ic: "🪵", l: "Plywood Stock",            cat: "plywoods",  span: "1/1", h: 180, bg: "rgba(245,158,11,.07)",  c: "#f59e0b" },
  { ic: "⚙️", l: "Aluminium Works",          cat: "aluminium", span: "1/1", h: 180, bg: "rgba(148,163,184,.05)", c: "#94a3b8" },
  { ic: "🏗️", l: "UPVC Window Systems",      cat: "upvc",      span: "1/1", h: 200, bg: "rgba(52,211,153,.07)",  c: "#34d399" },
  { ic: "🔩", l: "Hardware Collection",      cat: "hardwares", span: "1/1", h: 200, bg: "rgba(251,191,36,.07)",  c: "#fbbf24" },
  { ic: "✨", l: "Premium Showroom",         cat: "all",       span: "2/1", h: 240, bg: "rgba(249,115,22,.07)",  c: "#f97316" },
  { ic: "🚪", l: "WPVC Door Showcase",       cat: "wpvc",      span: "1/1", h: 200, bg: "rgba(167,139,250,.07)", c: "#a78bfa" },
  { ic: "🏠", l: "Interior Projects",        cat: "all",       span: "1/1", h: 200, bg: "rgba(56,189,248,.05)",  c: "#38bdf8" },
  { ic: "🏢", l: "Commercial Installations", cat: "aluminium", span: "1/2", h: 240, bg: "rgba(148,163,184,.06)", c: "#94a3b8" },
  { ic: "🔧", l: "On-Site Fabrication",      cat: "all",       span: "1/1", h: 190, bg: "rgba(249,115,22,.06)",  c: "#f97316" },
];

export const GAL_CATS = [
  "All", "Glass", "Plywoods", "UPVC", "WPVC", "Aluminium", "Hardwares",
];
