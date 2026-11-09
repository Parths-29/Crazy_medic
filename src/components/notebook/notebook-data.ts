export interface NotebookTestimonial {
  name: string;
  rating: number;
  comment: string;
  avatarSeed: string;
}

export interface DemoPagePreview {
  id: string;
  title: string;
  pageNumber: number;
  highlight: string;
  badge: string;
}

export interface NotebookSpread {
  id: string;
  leftPage: {
    title?: string;
    text?: string;
    diagramLabel?: string;
    bulletPoints?: string[];
  };
  rightPage: {
    title?: string;
    text?: string;
    highlight?: string;
    bulletPoints?: string[];
  };
}

export interface NotebookItem {
  id: string;
  slug: string;
  title: string;
  creator: string;
  subject: string;
  pageCount: number;
  spreadCount: number;
  price: number;
  coverTone: string;
  tagline: string;
  summary: string;
  chapters: string[];
  spreads: NotebookSpread[];
  demoPages?: DemoPagePreview[];
  testimonials?: NotebookTestimonial[];
}

export const MOCK_NOTEBOOKS: NotebookItem[] = [
  {
    id: "nb-1",
    slug: "entire-ophthalmology-notes",
    title: "Entire Ophthal for Prof Exam",
    creator: "Vismay Sharma",
    subject: "Ophthalmology",
    pageCount: 60,
    spreadCount: 4,
    price: 49,
    coverTone: "#1c2030",
    tagline: "Complete 16 Chapters | 60 Pages | Exam Focused",
    summary:
      "Handwritten revision summaries covering every major university exam question. Direct flowcharts comparing bacterial, fungal, and viral keratitis, plus SICS vs Phaco surgical steps and fundus findings.",
    chapters: [
      "Optics and Refraction",
      "Diseases of Conjunctiva",
      "Diseases of Cornea & Corneal Ulcer",
      "Diseases of Sclera",
      "Diseases of Uveal Tract",
      "Diseases of Lens (Cataract & Surgery)",
      "Glaucoma (Open vs Angle-Closure)",
      "Diseases of Vitreous",
      "Diseases of Retina & Fundus Changes",
      "Neuro-ophthalmology",
      "Ocular Motility & Strabismus",
      "Disorders of Eyelids & Ptosis",
      "Lacrimal Apparatus & DCR",
      "Orbit and Ocular Injuries",
      "Ocular Therapeutics & Emergency Drops",
      "Systemic & Community Ophthalmology",
    ],
    demoPages: [
      {
        id: "demo-1",
        title: "Corneal Ulcer Differential",
        pageNumber: 14,
        highlight: "Bacterial vs Fungal vs Acanthamoeba with fluorescent stain patterns",
        badge: "High Yield",
      },
      {
        id: "demo-2",
        title: "Glaucoma Outflow & Gonioscopy",
        pageNumber: 22,
        highlight: "Angle closure algorithm + Nd:YAG iridotomy steps",
        badge: "Exam Favorite",
      },
      {
        id: "demo-3",
        title: "Cataract Surgery Steps (SICS vs Phaco)",
        pageNumber: 29,
        highlight: "Clear incision, capsulorhexis, nucleus delivery & IOL placement",
        badge: "Clinical Core",
      },
      {
        id: "demo-4",
        title: "Fundus & Retinal Disorders",
        pageNumber: 41,
        highlight: "Diabetic Retinopathy (NPDR/PDR) & CRVO blood-and-thunder retina",
        badge: "Flowchart",
      },
    ],
    testimonials: [
      {
        name: "Rohit",
        rating: 5,
        comment: "Best notes for university exams. Waiting for Surgery 🙏🙏",
        avatarSeed: "R",
      },
      {
        name: "Kashifa",
        rating: 5,
        comment: "Loved the handwritten notes Bhaiya ❤️ 😇",
        avatarSeed: "K",
      },
      {
        name: "Rakesh Yadav",
        rating: 5,
        comment: "Bhai same aisa notes Medicine ki upload karo 🙏 🥺",
        avatarSeed: "RY",
      },
      {
        name: "Inaya",
        rating: 5,
        comment: "Perfect for last time revision 😇 😇",
        avatarSeed: "I",
      },
    ],
    spreads: [
      {
        id: "sp-1",
        leftPage: {
          title: "Corneal Ulcers (Keratitis)",
          text: "Bacterial vs Fungal vs Acanthamoeba. Staining characteristics and prompt clinical differentials.",
          diagramLabel: "[Slit-lamp: dendritic branching ulcer vs satellite lesions]",
          bulletPoints: [
            "Bacterial: circumciliary congestion, hypopyon with mobile level.",
            "Fungal: dry slough, feathery margins, immune ring of Wessely.",
            "Viral: loss of corneal sensations (HSV), dendritic fluorescein uptake.",
          ],
        },
        rightPage: {
          title: "Treatment Protocol",
          text: "First-line empirical medications before microbiological confirmation.",
          highlight: "Exam Alert: Never prescribe topical steroids in suspected fungal or active epithelial viral ulcers!",
          bulletPoints: [
            "Bacterial: fortified Cefazolin (5%) + Tobramycin (1.3%) hourly.",
            "Fungal: Natamycin 5% suspension drops half-hourly.",
            "Acanthamoeba: PHMB (0.02%) or Chlorhexidine drops.",
          ],
        },
      },
      {
        id: "sp-2",
        leftPage: {
          title: "Glaucoma Classifications",
          text: "Open Angle vs Angle Closure. Van Herick grading & Gonioscopy structures from anterior to posterior.",
          diagramLabel: "[Gonioscopy View: Schwalbe's line to Ciliary body band]",
          bulletPoints: [
            "I Can See The Line (Iris, Ciliary body, Scleral spur, Trabecular meshwork, Schwalbe).",
            "Pathology: Trabecular outflow resistance vs pupillary block.",
            "Visual field: Bjerrum scotoma, Roenne step, tubular vision.",
          ],
        },
        rightPage: {
          title: "Management & IOP Control",
          text: "Medical & surgical stepwise escalation algorithms.",
          highlight: "Acute attack: IV Mannitol 20% + Acetazolamide 500mg stat + Timolol 0.5% + Pilocarpine 2%.",
          bulletPoints: [
            "Prostaglandin analogues (Latanoprost): increases uveoscleral outflow.",
            "Beta-blockers (Timolol): decreases aqueous production.",
            "Definitive: Nd:YAG peripheral iridotomy (LPI) for angle closure.",
          ],
        },
      },
    ],
  },
  {
    id: "nb-2",
    slug: "general-surgery-handwritten",
    title: "Your Surgery Handwritten Notes",
    creator: "Vismay Sharma",
    subject: "General Surgery",
    pageCount: 110,
    spreadCount: 5,
    price: 99,
    coverTone: "#181c2a",
    tagline: "Final Prof MBBS Surgery Exam? This is your sign to start revising smarter!",
    summary:
      "Handwritten diagrams for thyroid swellings, breast triple assessment, acute abdomen differentials, and trauma resuscitation checklists.",
    chapters: [
      "Arterial & Venous Vascular Disorders",
      "Thyroid Malignancies & Bethesda Staging",
      "Breast Triple Assessment & BIRADS",
      "Acute Abdomen & Intestinal Obstruction",
      "Trauma Primary & Secondary Surveys (ATLS)",
      "Inguinal Hernias: Anatomy & Mesh Repairs",
      "Salivary Glands & Pleomorphic Adenoma",
      "Burns Resuscitation & Parkland Formula",
    ],
    demoPages: [
      {
        id: "demo-surg-1",
        title: "Thyroid Bethesda Decision Tree",
        pageNumber: 18,
        highlight: "USG TIRADS to FNAC and lobectomy indications",
        badge: "Must Know",
      },
      {
        id: "demo-surg-2",
        title: "Acute Appendicitis Alvarado Score",
        pageNumber: 34,
        highlight: "MANTRELS criteria + open vs lap appendectomy steps",
        badge: "Emergency",
      },
    ],
    testimonials: [
      {
        name: "Arjun Verma",
        rating: 5,
        comment: "Bailey concepts simplified so neatly. Saved my surgery prof exam!",
        avatarSeed: "AV",
      },
      {
        name: "Sneha Nair",
        rating: 5,
        comment: "The hernia anatomy sketches are unmatched. Pure gold.",
        avatarSeed: "SN",
      },
    ],
    spreads: [
      {
        id: "sp-1",
        leftPage: {
          title: "Thyroid Swelling Workup",
          text: "Stepwise decision tree from clinical solitary nodule to surgery.",
          diagramLabel: "[Ultrasound EU-TIRADS criteria flowchart]",
          bulletPoints: [
            "Step 1: Serum TSH. If suppressed -> Radioiodine uptake scan.",
            "Step 2: If normal/high TSH -> High-resolution USG neck.",
            "Step 3: FNAC for suspicious features (microcalcifications, taller-than-wide).",
          ],
        },
        rightPage: {
          title: "Bethesda Classification (I-VI)",
          text: "Management rules based on cytological report.",
          highlight: "Bethesda V (Suspicious) & VI (Malignant) require upfront hemithyroidectomy or total thyroidectomy.",
          bulletPoints: [
            "Bethesda II (Benign, 60-70%): observation with annual repeat USG.",
            "Bethesda III/IV: repeat FNAC or diagnostic hemithyroidectomy.",
            "Papillary carcinoma: Psammoma bodies & Orphan Annie eyes on histology.",
          ],
        },
      },
    ],
  },
  {
    id: "nb-3",
    slug: "paediatrics-revision-booklet",
    title: "Paediatrics Revision Booklet",
    creator: "Vismay Sharma",
    subject: "Paediatrics",
    pageCount: 45,
    spreadCount: 3,
    price: 39,
    coverTone: "#161926",
    tagline: "Pediatrics in 60 minutes? 10 Master One-Pagers. Complete Pediatrics Revision.",
    summary:
      "All essential milestone tables (Gross motor, Fine motor, Language, Social), Nelson neonatal resuscitation algorithms, and national immunization schedule rules.",
    chapters: [
      "Developmental Milestones Mastery Matrix",
      "Neonatal Resuscitation Protocol 2024",
      "PEM: Kwashiorkor vs Marasmus Tables",
      "Congenital Heart Diseases (Cyanotic vs Acyanotic)",
      "National Immunization Schedule & Vaccines",
    ],
    demoPages: [
      {
        id: "demo-paed-1",
        title: "Developmental Milestones Matrix",
        pageNumber: 8,
        highlight: "Gross, fine motor, red flags at 3, 6, 9, 12, 18 months",
        badge: "Theory + Viva",
      },
    ],
    testimonials: [
      {
        name: "Pooja Hegde",
        rating: 5,
        comment: "Milestones was my nightmare until I read this one-pager. Full marks in viva!",
        avatarSeed: "PH",
      },
    ],
    spreads: [
      {
        id: "sp-1",
        leftPage: {
          title: "Key Developmental Milestones",
          text: "Ages to memorize for university theory and clinical examination cases.",
          diagramLabel: "[Milestone Timeline: 3mo to 36mo]",
          bulletPoints: [
            "Gross Motor: Neck holding (3m), Sitting without support (8m), Standing (10m), Walking (12m).",
            "Fine Motor: Bidextrous grasp (5m), Unidextrous (7m), Pincer grasp (9-10m).",
            "Social: Social smile (2m), Recognizes mother (3m), Stranger anxiety (6-7m).",
          ],
        },
        rightPage: {
          title: "Red Flag Delays",
          text: "Indications for formal neurodevelopmental evaluation.",
          highlight: "Red flag: No social smile by 3 months, no independent sitting by 9 months, not walking by 18 months.",
          bulletPoints: [
            "Language: Cooing (3m), Babbling (6m), Monosyllables (9m), 2-word sentences (2yr).",
            "Hearing screening must be requested immediately if babbling ceases.",
          ],
        },
      },
    ],
  },
  {
    id: "nb-4",
    slug: "gynaecology-and-obstetrics",
    title: "Your GYNAECOLOGY + OBSTETRICS Revision Booklet",
    creator: "Vismay Sharma",
    subject: "Obstetrics & Gynae",
    pageCount: 52,
    spreadCount: 3,
    price: 39,
    coverTone: "#1b1e2c",
    tagline: "A complete, concise & high-yield Gynaecology & Obs revision resource covering key concepts.",
    summary:
      "Handwritten diagrams explaining mechanism of labor, Pritchard regimen for Eclampsia, post-partum haemorrhage medical/surgical balloons, and Pap smear cytology algorithms.",
    chapters: [
      "Normal Labor Mechanisms & Partograph",
      "Pre-eclampsia & Pritchard MgSO4 Protocol",
      "PPH Medical & Surgical Interventions",
      "Cervical Cancer FIGO 2018 Staging",
      "Infertility & Polycystic Ovarian Syndrome",
    ],
    spreads: [
      {
        id: "sp-1",
        leftPage: {
          title: "Pre-Eclampsia & Eclampsia",
          text: "Blood pressure criteria, proteinuria, and emergency seizure prophylaxis.",
          diagramLabel: "[MgSO4 Pritchard Regimen Dosages Flowchart]",
          bulletPoints: [
            "Definition: BP >= 140/90 after 20 weeks with proteinuria (>=300mg/24h).",
            "Severe features: BP >= 160/110, platelets < 100k, creatinine > 1.1, epigastric pain.",
            "Antihypertensives: Labetalol oral/IV, Nifedipine, Hydralazine.",
          ],
        },
        rightPage: {
          title: "Pritchard Regimen Protocol",
          text: "Intramuscular magnesium sulphate regimen.",
          highlight: "Check before each repeat dose: Patellar reflex present, Respiratory rate > 14/min, Urine output > 30ml/hr.",
          bulletPoints: [
            "Loading dose: 4g IV (20% sol over 5-10 min) + 10g IM (5g in each buttock, 50% sol).",
            "Maintenance dose: 5g IM (50% sol) every 4 hours in alternate buttock.",
            "Antidote for toxicity: 10ml Calcium Gluconate 10% IV slowly.",
          ],
        },
      },
    ],
  },
  {
    id: "nb-5",
    slug: "ent-revision-one-posters",
    title: "Your ENT Subject Revision Booklet",
    creator: "Vismay Sharma",
    subject: "Otolaryngology",
    pageCount: 38,
    spreadCount: 3,
    price: 39,
    coverTone: "#181b28",
    tagline: "COMPLETE ENT REVISION in 10+ high-yield HD one-posters. No endless pages.",
    summary:
      "All tuning fork tests, pure-tone audiometry patterns, safe vs unsafe ear disease differences, Little's area cautery protocols, and mastoidectomy surgical planes.",
    chapters: [
      "Tuning Fork Tests & Audiometry Curves",
      "CSOM: Tubotympanic vs Atticoantral",
      "Epistaxis: Anterior vs Posterior Packing",
      "Meniere's Disease & Vestibular Schwannoma",
      "Tracheostomy Steps & Emergency Complications",
    ],
    spreads: [
      {
        id: "sp-1",
        leftPage: {
          title: "Tuning Fork Tests (Rinne & Weber)",
          text: "512 Hz fork interpretation for Conductive vs Sensorineural Hearing Loss.",
          diagramLabel: "[Audiogram curves: Carhart's notch at 2kHz in Otosclerosis]",
          bulletPoints: [
            "Rinne Positive: Air Conduction > Bone Conduction (Normal or Sensorineural).",
            "Rinne Negative: Bone Conduction >= Air Conduction (Conductive loss).",
            "Weber: Lateralizes to bad ear in Conductive; to better ear in Sensorineural.",
          ],
        },
        rightPage: {
          title: "CSOM Safe vs Unsafe",
          text: "Clinical differences between Tubotympanic and Atticoantral pathology.",
          highlight: "Atticoantral ear disease carries risk of intracranial complications (meningitis, brain abscess). Requires Tympanomastoid surgery.",
          bulletPoints: [
            "Tubotympanic: Central perforation, profuse non-foul mucous discharge.",
            "Atticoantral: Attic/marginal perforation, scanty foul discharge, Cholesteatoma.",
            "Investigation of choice: HRCT Temporal Bone.",
          ],
        },
      },
    ],
  },
  {
    id: "nb-6",
    slug: "entire-psm-revision-booklet",
    title: "Entire PSM Revision Booklet",
    creator: "Vismay Sharma",
    subject: "Community Medicine",
    pageCount: 49,
    spreadCount: 3,
    price: 49,
    coverTone: "#161b2b",
    tagline: "COMMUNITY MEDICINE FINAL REVISION BOOKLET. Biostats & epidemiology made crystal clear.",
    summary:
      "Epidemiology study designs, biostatistics tests of significance, screening sensitivity/specificity 2x2 tables, and national health programs.",
    chapters: [
      "Epidemiological Study Designs (Cohort vs Case Control)",
      "Biostatistics Tests (Chi-Square, Student t-test)",
      "Screening Tests: Sensitivity, Specificity & PPV",
      "Immunization & Cold Chain Monitoring",
      "Vector-Borne Disease Control Protocols",
    ],
    spreads: [
      {
        id: "sp-1",
        leftPage: {
          title: "Study Designs Quick-Matrix",
          text: "Distinguishing Case-Control from Cohort & RCTs.",
          diagramLabel: "[2x2 Contingency Table for Odds Ratio vs Relative Risk]",
          bulletPoints: [
            "Case-Control: Starts with disease, looks back at exposure. Measure: Odds Ratio (OR).",
            "Cohort: Starts with exposure, looks forward to disease. Measure: Relative Risk (RR).",
            "RCT: Experimental study with random allocation & blinding.",
          ],
        },
        rightPage: {
          title: "Biostatistics Formulas",
          text: "High-yield calculation cheat sheet.",
          highlight: "Sensitivity = a / (a + c) | Specificity = d / (b + d) | Positive Predictive Value = a / (a + b)",
          bulletPoints: [
            "Type I Error (alpha): Rejecting null hypothesis when it is true.",
            "Type II Error (beta): Accepting null hypothesis when it is false.",
            "Power of study: 1 - beta (usually set at 80% or 90%).",
          ],
        },
      },
    ],
  },
];

