export interface SampleNote {
  id: string;
  slug: string;
  title: string;
  creator: string;
  subject: string;
  category: "Anatomy" | "Physiology" | "Biochemistry" | "Pharmacology" | "Pathology" | "Opthalmology" | "Botany" | "Zoology";
  yearTag: string;
  price: number; // in Rupees
  mrp: number; // in Rupees
  pageCount: number;
  chapterCount: number;
  rating: number;
  ratingCount: number;
  studentsBought: number;
  featured?: boolean;
  tagline: string;
  description: string;
  whatsInside: string[];
  sampleImages: string[];
  color: string;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: "note-1",
    slug: "entire-ophthalmology-handwritten-notes",
    title: "Entire Ophthal for Prof Exam",
    creator: "Vismay Sharma",
    subject: "Ophthalmology",
    category: "Opthalmology",
    yearTag: "Final Year MBBS",
    price: 49,
    mrp: 149,
    pageCount: 60,
    chapterCount: 16,
    rating: 4.9,
    ratingCount: 312,
    studentsBought: 1240,
    featured: true,
    tagline: "16 High-Yield Chapters handwritten for university distinction.",
    description: `### Final Year MBBS Students, Your Ophthalmology Revision Just Got Way Easier!
Stop juggling between bulky 800-page textbooks and confusing PowerPoint slides. 
These **60 pages of crisp handwritten high-yield notes** are specifically organized to help you score honors in your university theory and viva exams.

- **16 complete chapters** synthesized directly from standard textbooks (Khurana + Parson)
- Full-color hand-drawn diagrams for slit lamp findings, corneal ulcers, and fundus exam
- High-yield mnemonics for optic pathways, ocular therapeutics, and strabismus
- Instant access in the protected study reader with custom watermark`,
    whatsInside: [
      "Optics & Refraction Simplified",
      "Diseases of Conjunctiva & Trachoma",
      "Corneal Ulcers (Bacterial, Viral, Fungal comparison table)",
      "Cataract Surgery & Complications (Phaco vs SICS)",
      "Glaucoma Classifications & Visual Field Defects",
      "Retinal Detachment, Diabetic & Hypertensive Retinopathy",
      "Neuro-Ophthalmology & Pupillary Reflexes",
      "Ocular Pharmacology & Emergency Drug Dosages"
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
    ],
    color: "#E8443A"
  },
  {
    id: "note-2",
    slug: "general-surgery-rapid-revision",
    title: "Your Surgery Handwritten Notes",
    creator: "Vismay Sharma",
    subject: "Surgery",
    category: "Pathology",
    yearTag: "Final Year MBBS",
    price: 99,
    mrp: 299,
    pageCount: 110,
    chapterCount: 22,
    rating: 5.0,
    ratingCount: 520,
    studentsBought: 2840,
    featured: true,
    tagline: "Bailey & Love condensed into rapid recall visual mind-maps.",
    description: `Final Prof MBBS surgery exams demand precise decision algorithms. These handwritten notes distill complex surgical procedures, staging, and post-op care into clean flowcharts.`,
    whatsInside: [
      "Arterial & Venous Disorders + Doppler Interpretation",
      "Thyroid Malignancies & Management Flowcharts",
      "Breast Triple Assessment & Staging",
      "Acute Abdomen & Intestinal Obstruction Algorithms",
      "Trauma Primary & Secondary Survey Checklists",
      "Hernias: Anatomy, Classifications & Mesh repairs"
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
    ],
    color: "#0F2B3C"
  },
  {
    id: "note-3",
    slug: "paediatrics-60-minute-revision-booklet",
    title: "Paediatrics Revision Booklet",
    creator: "Vismay Sharma",
    subject: "Pediatrics",
    category: "Physiology",
    yearTag: "Final Year MBBS",
    price: 39,
    mrp: 99,
    pageCount: 45,
    chapterCount: 12,
    rating: 4.8,
    ratingCount: 198,
    studentsBought: 930,
    featured: true,
    tagline: "Pediatrics in 60 minutes: 10 master one-pagers and milestone tables.",
    description: `Master developmental milestones, nutritional disorders, neonatal resuscitation, and pediatric immunization schedules in one crisp booklet.`,
    whatsInside: [
      "Developmental Milestones Mastery Matrix",
      "Neonatal Resuscitation Program (NRP) 2024 Steps",
      "Protein Energy Malnutrition (PEM) Kwashiorkor vs Marasmus",
      "Congenital Heart Diseases: Cyanotic vs Acyanotic",
      "National Immunization Schedule with Catch-up rules"
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=80"
    ],
    color: "#3ECFB4"
  },
  {
    id: "note-4",
    slug: "obstetrics-and-gynaecology-core-revision",
    title: "Gynaecology & Obstetrics Booklet",
    creator: "Vismay Sharma",
    subject: "OBGYN",
    category: "Anatomy",
    yearTag: "Final Year MBBS",
    price: 39,
    mrp: 99,
    pageCount: 52,
    chapterCount: 14,
    rating: 4.9,
    ratingCount: 240,
    studentsBought: 1100,
    featured: false,
    tagline: "High-yield OBGYN revision covering labor, high-risk pregnancy and oncology.",
    description: `Crisp visual notes covering mechanism of labor, CTG interpretation, pre-eclampsia management, and gynecological malignancies.`,
    whatsInside: [
      "Mechanism of Normal Labor & Partograph Interpretation",
      "Hypertensive Disorders of Pregnancy & MgSO4 Protocol",
      "Antepartum & Postpartum Hemorrhage Action Plan",
      "Cervical Cancer Screening (FIGO staging & HPV protocols)",
      "PCOS, Endometriosis & Infertility Workup"
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
    ],
    color: "#E8443A"
  },
  {
    id: "note-5",
    slug: "ent-high-yield-one-posters",
    title: "ENT Subject Revision Booklet",
    creator: "Vismay Sharma",
    subject: "ENT",
    category: "Anatomy",
    yearTag: "3rd Year MBBS",
    price: 39,
    mrp: 89,
    pageCount: 38,
    chapterCount: 10,
    rating: 4.8,
    ratingCount: 175,
    studentsBought: 840,
    featured: false,
    tagline: "Complete ENT revision in 10+ high-yield HD one-posters.",
    description: `No endless pages. Visual posters for mastoid surgeries, audiogram curves, tracheostomy steps, and epistaxis management.`,
    whatsInside: [
      "Audiology: Tuning Fork Tests & Pure Tone Audiometry",
      "CSOM: Safe (Tubotympanic) vs Unsafe (Atticoantral)",
      "Stapedectomy & Myringoplasty Techniques",
      "Epistaxis: Little's Area & Woodruff's Plexus Bleed Management",
      "Tracheostomy Complications & Care"
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80"
    ],
    color: "#3ECFB4"
  },
  {
    id: "note-6",
    slug: "community-medicine-psm-mastery",
    title: "Entire PSM Revision Booklet",
    creator: "Vismay Sharma",
    subject: "PSM",
    category: "Pathology",
    yearTag: "3rd Year MBBS",
    price: 49,
    mrp: 129,
    pageCount: 75,
    chapterCount: 18,
    rating: 4.7,
    ratingCount: 210,
    studentsBought: 1450,
    featured: false,
    tagline: "Biostatistics formulas, epidemiological study designs & national programs.",
    description: `All PSM math formulas, screening test metrics (sensitivity, specificity, PPV), and outbreak investigations condensed for quick marks.`,
    whatsInside: [
      "Epidemiological Studies: Cohort vs Case-Control vs RCT",
      "Biostatistics: Mean, Median, Mode, SD, Standard Error, P-value",
      "Demography & Family Planning Contraceptive Methods",
      "National Health Missions & Vector Control Programs"
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
    ],
    color: "#0F2B3C"
  }
];

export const CATEGORIES = [
  "All",
  "Opthalmology",
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pharmacology",
  "Pathology",
  "Botany",
  "Zoology"
];

