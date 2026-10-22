/*! FacetUI Industry Templates · Bioscience & Biotechnology · © 2026 ETKits. Demo content; Cellwright Labs is fictional. */
// Edit this file to rebrand: brand, theme, navigation, copy, images and demo data live here.
// Page structure lives in pages.mjs; composition styles in template.css.

/* Sample types are the matrix columns. */
const sampleTypes = [
  { id: "mab", short: "Monoclonal antibody", label: "Monoclonal antibodies", desc: "IgG1, IgG2, IgG4 and Fab fragments" },
  { id: "bispecific", short: "Bispecific or Fc-fusion", label: "Bispecifics and Fc-fusions", desc: "Multi-domain and engineered formats" },
  { id: "recombinant", short: "Recombinant protein", label: "Recombinant proteins and enzymes", desc: "Expressed in mammalian, insect or microbial hosts" },
  { id: "peptide", short: "Synthetic peptide", label: "Synthetic peptides", desc: "Linear, cyclic and lipidated, up to 60 residues" },
  { id: "biofluid", short: "Serum or plasma", label: "Serum and plasma", desc: "Preclinical study samples, any species" },
  { id: "harvest", short: "Harvest supernatant", label: "Cell culture harvest", desc: "Clarified supernatant from bioreactor or flask" },
];

/* Research areas group the assays and each gets a capability page. */
const areas = [
  { id: "mass-spec", code: "MS", name: "Mass spectrometry", long: "Mass spectrometry characterization", icon: "scan-line",
    summary: "Confirm what you made: intact mass, sequence coverage, post-translational modifications, glycans and process impurities.",
    intro: [
      "Most programs come to us with one question: is this molecule what we think it is? Our mass spectrometry group answers it at three levels, from intact and subunit mass down to residue-level modifications, so you can see clipping, oxidation, deamidation or a missing glycan before it shows up as a surprise in stability data.",
      "Every study starts from your sequence file. We build the search database with you, agree the modifications to look for, and report coverage against the full sequence rather than a percentage alone.",
    ],
    questions: ["Is the expressed protein the right sequence and mass?", "Which residues are oxidized or deamidated after stress?", "How does the glycan profile shift between clones or runs?", "Which host cell proteins persist after purification?"],
    instruments: [["High-resolution Q-TOF and ion-trap mass spectrometers", "Intact, subunit and peptide-level work"], ["Nano- and micro-flow UHPLC systems", "Reversed-phase and HILIC separations"], ["Automated digestion workstation", "Reduction, alkylation and enzymatic digests in 96-well format"]],
    requirements: [["Minimum amount", "50 µg per sample (10 µg for peptides)"], ["Concentration", "0.5 mg/mL or higher"], ["Buffer", "Avoid PEG, glycerol above 5% and non-volatile detergents"], ["Shipping", "Frozen on dry ice, or 2–8 °C if shipped same day"]],
    deliverables: ["Deconvoluted spectra with annotated mass assignments", "Sequence coverage map and modification table", "Raw data files in vendor and open formats", "Methods section written for your report or filing"] },
  { id: "biophysical", code: "BP", name: "Biophysical", long: "Biophysical characterization", icon: "activity",
    summary: "Size, charge and stability: the developability readouts that decide which candidate moves forward.",
    intro: [
      "Biophysical assays are where candidate selection usually happens. We run aggregation, thermal stability and charge-variant panels side by side so you can compare molecules on the same day, on the same instruments, with the same analyst.",
      "Panels can be run on as little as a few hundred micrograms per candidate, which makes them practical early in discovery when material is scarce.",
    ],
    questions: ["How much high-molecular-weight species is present?", "Where does each candidate unfold, and does it aggregate on the way?", "How many charge variants are there, and do they change under stress?", "Which formulation buffer holds up best?"],
    instruments: [["SEC-MALS with refractive index and UV detection", "Absolute molar mass and oligomeric state"], ["Differential scanning fluorimetry, label-free and dye-based", "Melting and aggregation onset"], ["Imaged capillary isoelectric focusing", "Charge heterogeneity profiling"]],
    requirements: [["Minimum amount", "300 µg per candidate for the full panel"], ["Concentration", "1 mg/mL or higher"], ["Buffer", "Send a matching buffer blank, at least 5 mL"], ["Shipping", "2–8 °C, or frozen if the molecule tolerates freeze–thaw"]],
    deliverables: ["Side-by-side candidate comparison table", "Chromatograms, melting curves and electropherograms", "Analyst notes on anything unusual", "Raw data and processing parameters"] },
  { id: "binding", code: "BK", name: "Binding and potency", long: "Binding kinetics and potency", icon: "chart-line",
    summary: "How tightly, how fast and how much: kinetics, affinity, drug concentration in study samples and cell-based potency.",
    intro: [
      "Binding data is only as good as the assay format behind it. Before running your samples we confirm surface activity, check for avidity effects and agree the fitting model, so the numbers you get back mean what they appear to mean.",
      "For preclinical studies we develop and qualify ligand-binding assays for drug concentration in serum or plasma, then run study samples in batches as they arrive.",
    ],
    questions: ["What are the on-rate, off-rate and affinity for the target?", "Do lead candidates compete for the same epitope?", "What is drug concentration over time in study animals?", "Is potency consistent between lots?"],
    instruments: [["Surface plasmon resonance systems", "Kinetics, affinity and epitope binning"], ["Electrochemiluminescence and absorbance plate readers", "Ligand-binding assays in 96- and 384-well plates"], ["Automated liquid handler", "Serial dilutions, plate replication and sample reformatting"]],
    requirements: [["Minimum amount", "100 µg analyte; ligand amount agreed at scoping"], ["Concentration", "0.2 mg/mL or higher"], ["Study samples", "At least 50 µL per time point, aliquoted"], ["Shipping", "Frozen on dry ice with a sample manifest"]],
    deliverables: ["Sensorgrams with fitted curves and residuals", "Kinetic and affinity tables with fitting model stated", "Concentration–time data per animal", "Assay qualification summary"] },
  { id: "structural", code: "SB", name: "Structural biology", long: "Structural biology", icon: "hexagon",
    summary: "Where it binds and what it looks like: crystallization screening, epitope mapping and higher-order structure.",
    intro: [
      "Structural questions usually come later in a program, when you need to understand an epitope, defend a binding mode or explain why one variant behaves differently from another.",
      "We start with a feasibility check: purity, homogeneity and stability of your complex. Only then do we commit to crystallization screens or hydrogen–deuterium exchange, so you don't pay for months of screening on a sample that was never going to cooperate.",
    ],
    questions: ["Which residues form the epitope?", "Will the protein or complex crystallize?", "Does a sequence change alter higher-order structure?", "Where do two binders overlap?"],
    instruments: [["Nanoliter crystallization robot with sitting-drop plates", "Sparse-matrix and optimization screens"], ["Automated plate imager with UV and visible light", "Drop monitoring at set intervals"], ["Hydrogen–deuterium exchange mass spectrometry", "Epitope and conformational mapping"]],
    requirements: [["Minimum amount", "2 mg for crystallization; 500 µg for HDX"], ["Purity", "95% or higher by SDS-PAGE and SEC"], ["Concentration", "5–20 mg/mL for crystallization"], ["Shipping", "Frozen in single-use aliquots"]],
    deliverables: ["Plate images and hit scoring for each screen", "Optimized conditions for any crystal hits", "HDX uptake plots and protection maps", "Interpretation call with the structural lead"] },
];

/* Matrix rows. std = standard turnaround in working days per sample type; null = not offered. */
const assays = [
  { id: "intact-mass", area: "mass-spec", name: "Intact and subunit mass", method: "LC-MS, reduced and non-reduced", std: { mab: 5, bispecific: 6, recombinant: 5, peptide: 3, biofluid: null, harvest: 7 } },
  { id: "peptide-map", area: "mass-spec", name: "Peptide mapping and PTMs", method: "LC-MS/MS, enzymatic digest", std: { mab: 8, bispecific: 10, recombinant: 8, peptide: 4, biofluid: null, harvest: null } },
  { id: "glycan", area: "mass-spec", name: "Released N-glycan profile", method: "HILIC-FLR-MS", std: { mab: 7, bispecific: 8, recombinant: 7, peptide: null, biofluid: null, harvest: 9 } },
  { id: "hcp", area: "mass-spec", name: "Host cell protein ID", method: "Data-independent LC-MS/MS", std: { mab: 10, bispecific: 10, recombinant: 10, peptide: null, biofluid: null, harvest: 12 } },
  { id: "sec-mals", area: "biophysical", name: "Aggregation and molar mass", method: "SEC-MALS", std: { mab: 4, bispecific: 5, recombinant: 4, peptide: null, biofluid: null, harvest: null } },
  { id: "thermal", area: "biophysical", name: "Thermal stability", method: "Label-free and dye-based DSF", std: { mab: 3, bispecific: 3, recombinant: 3, peptide: null, biofluid: null, harvest: null } },
  { id: "charge", area: "biophysical", name: "Charge variants", method: "Imaged cIEF", std: { mab: 5, bispecific: 6, recombinant: 5, peptide: null, biofluid: null, harvest: null } },
  { id: "spr", area: "binding", name: "Binding kinetics and affinity", method: "Surface plasmon resonance", std: { mab: 7, bispecific: 8, recombinant: 7, peptide: 6, biofluid: null, harvest: null } },
  { id: "lba", area: "binding", name: "Drug concentration", method: "Ligand-binding assay", std: { mab: null, bispecific: null, recombinant: null, peptide: null, biofluid: 10, harvest: 6 } },
  { id: "potency", area: "binding", name: "Cell-based potency", method: "Reporter gene assay", std: { mab: 12, bispecific: 14, recombinant: 12, peptide: null, biofluid: null, harvest: null } },
  { id: "hdx", area: "structural", name: "Epitope mapping", method: "HDX-MS", std: { mab: 16, bispecific: 18, recombinant: 16, peptide: null, biofluid: null, harvest: null } },
  { id: "crystal", area: "structural", name: "Crystallization screening", method: "Sparse-matrix, sitting drop", std: { mab: 18, bispecific: null, recombinant: 15, peptide: null, biofluid: null, harvest: null } },
];
// Priority queue: roughly 60% of standard time, never under two working days.
for (const a of assays) a.pri = Object.fromEntries(Object.entries(a.std).map(([k, v]) => [k, v == null ? null : Math.max(2, Math.round(v * 0.6))]));

/* Sample data: fictional journals, titles and authors. */
const publications = [
  { id: "p1", area: "mass-spec", year: 2026, type: "article", title: "Middle-down mass analysis of IgG4 hinge variants after accelerated stress", authors: "R. Okonjo, M. Lindqvist, T. Barrera", venue: "Journal of Applied Protein Analytics" },
  { id: "p2", area: "biophysical", year: 2026, type: "app-note", title: "Ranking twelve bispecific candidates on 400 µg each: a compact developability panel", authors: "S. Navarro, K. Adeyemi", venue: "Cellwright application note 26-03" },
  { id: "p3", area: "binding", year: 2026, type: "poster", title: "Reducing avidity artifacts in SPR kinetics for bivalent binders with low-density capture surfaces", authors: "J. Whitcombe, P. Iyer", venue: "Lakeshore Protein Methods Forum" },
  { id: "p4", area: "structural", year: 2025, type: "article", title: "HDX-MS epitope maps for two competing anti-receptor Fabs reconcile conflicting binning data", authors: "L. Haverford, R. Okonjo, D. Mbeki", venue: "Structural Bioassay Quarterly" },
  { id: "p5", area: "mass-spec", year: 2025, type: "app-note", title: "Twenty-minute released N-glycan workflow for clone screening", authors: "T. Barrera, A. Kowalczyk", venue: "Cellwright application note 25-11" },
  { id: "p6", area: "binding", year: 2025, type: "article", title: "Bridging ligand-binding assay design for an Fc-fusion in rodent and primate serum", authors: "P. Iyer, E. Sandoval, J. Whitcombe", venue: "Biotherapeutic Methods Letters" },
  { id: "p7", area: "biophysical", year: 2025, type: "poster", title: "SEC-MALS reveals reversible dimerization masked by standard UV-SEC", authors: "K. Adeyemi, S. Navarro", venue: "Northeast Biophysics Symposium" },
  { id: "p8", area: "mass-spec", year: 2024, type: "article", title: "Data-independent acquisition for host cell protein tracking across three purification steps", authors: "M. Lindqvist, A. Kowalczyk, R. Okonjo", venue: "Journal of Applied Protein Analytics" },
  { id: "p9", area: "structural", year: 2024, type: "app-note", title: "Feasibility first: a purity and homogeneity gate before crystallization screening", authors: "D. Mbeki, L. Haverford", venue: "Cellwright application note 24-07" },
  { id: "p10", area: "biophysical", year: 2024, type: "article", title: "Charge-variant drift in imaged cIEF after repeated freeze–thaw of a high-concentration formulation", authors: "S. Navarro, E. Sandoval", venue: "Formulation Science Reports" },
  { id: "p11", area: "binding", year: 2023, type: "app-note", title: "Plate-to-plate consistency for a reporter gene potency assay run on an automated liquid handler", authors: "E. Sandoval, J. Whitcombe", venue: "Cellwright application note 23-14" },
  { id: "p12", area: "mass-spec", year: 2023, type: "poster", title: "Localizing methionine oxidation in a heavily glycosylated enzyme by combined digests", authors: "A. Kowalczyk, T. Barrera", venue: "Lakeshore Protein Methods Forum" },
  { id: "p13", area: "structural", year: 2023, type: "article", title: "Crystallization of a lipidated peptide–receptor complex using detergent-exchanged protein", authors: "L. Haverford, D. Mbeki", venue: "Structural Bioassay Quarterly" },
  { id: "p14", area: "biophysical", year: 2022, type: "app-note", title: "Choosing between label-free and dye-based DSF for antibody fragments", authors: "K. Adeyemi", venue: "Cellwright application note 22-05" },
];

const pubTypes = { article: "Journal article", "app-note": "Application note", poster: "Poster" };

export default {
  slug: "bioscience",
  business: "contract research laboratory for protein characterization",
  description: "Cellwright Labs is a contract research lab for protein characterization and bioanalysis. See assays by sample type with turnaround times and scope a project online.",
  brand: { name: "Cellwright Labs", tagline: "Protein characterization and bioanalysis", markPath: "M16 2 28 9v14l-12 7-12-7V9L16 2Zm0 5-7.5 4.5v9L16 25l7.5-4.5v-9L16 7Zm0 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" },
  theme: { mode: "light", brand: "cobalt", density: "compact", themeColor: "#ffffff" },
  header: {
    variant: "bar",
    utility: [
      { icon: "package-check", label: "Sample receiving Mon–Thu, 8:00 AM – 3:00 PM ET" },
      { icon: "truck", label: "Shipping instructions", page: "home", hash: "shipping" },
      { icon: "phone", label: "Project team (555) 013-7740", href: "tel:+15550137740" },
    ],
    secondary: { label: "Ship samples", page: "home", hash: "shipping" },
    cta: { label: "Scope a project", page: "scope" },
  },
  nav: [
    { label: "Assays", page: "home", hash: "matrix" },
    { label: "Research areas", page: "home", hash: "areas" },
    { label: "Publications", page: "home", hash: "publications" },
    { label: "How projects run", page: "home", hash: "process" },
    { label: "Sample shipping", page: "home", hash: "shipping" },
  ],
  footer: {
    variant: "columns",
    blurb: "A contract research lab of 38 scientists characterizing proteins, antibodies and peptides for biotech R&D teams.",
    contact: [
      { icon: "map-pin", label: "1200 Foundry Row, Suite 300, Eastbank" },
      { icon: "phone", label: "(555) 013-7740", href: "tel:+15550137740" },
      { icon: "mail", label: "projects@cellwright.example", href: "mailto:projects@cellwright.example" },
    ],
    columns: [
      { title: "Research areas", links: areas.map((a) => ({ label: a.long, page: `capability-${a.id}` })) },
      { title: "Working with us", links: [{ label: "Scope a project", page: "scope" }, { label: "How projects run", page: "home", hash: "process" }, { label: "Sample shipping", page: "home", hash: "shipping" }, { label: "Publications", page: "home", hash: "publications" }] },
    ],
  },
  hero: {
    title: "Protein characterization, matched to your sample.",
    lede: "Pick a sample type and see which assays we run on it and how long they take. Every number below is working days from the day your samples clear receiving.",
    facts: [["Assays on the menu", "12"], ["Sample types accepted", "6"], ["Typical scoping reply", "2 working days"]],
  },
  sampleTypes,
  areas,
  assays,
  publications,
  pubTypes,
  process: [
    { title: "Scoping call", time: "Week 0", text: "A 30-minute call with the scientist who will run your study. We agree the question, the assays and what a useful answer looks like." },
    { title: "Study plan and quote", time: "2 working days", text: "A written plan listing methods, sample amounts, acceptance criteria and a fixed price. Nothing runs until you approve it." },
    { title: "Samples in", time: "Day 1 of turnaround", text: "Receiving logs each tube against your manifest, checks temperature on arrival and emails you a receipt with photos." },
    { title: "Data package", time: "Per the matrix", text: "Report, raw data and a debrief call. Questions after delivery are part of the study, not a new quote." },
  ],
  shipping: {
    address: ["Cellwright Labs, Sample Receiving", "1200 Foundry Row, Dock B", "Eastbank, ST 00140"],
    rules: [
      ["Ship Monday to Wednesday", "So samples never sit on a dock over a weekend. Thursday shipments arrive Friday and are held frozen until Monday."],
      ["Label every tube", "Use the sample IDs from your manifest. If you've asked for blinded coding, use your own codes and keep the key."],
      ["Frozen samples on dry ice", "At least 5 kg for overnight delivery. Refrigerated samples go with gel packs and a temperature logger."],
      ["Include the manifest", "One printed copy in the box and one emailed to receiving before the courier collects."],
    ],
  },
  images: {
    "bench-ms": { alt: "A high-resolution mass spectrometer coupled to a liquid chromatography system on a lab bench", brief: "High-resolution LC-MS instrument with UHPLC stack, analyst loading an autosampler tray", search: "mass spectrometer liquid chromatography lab", focal: "45% 50%", ratio: "4/3", icon: "scan-line", placement: "Home: instruments, large tile" },
    "bench-columns": { alt: "Close-up of chromatography columns and fittings in a column oven", brief: "Macro of HPLC/SEC columns with steel fittings in an open column compartment", search: "hplc chromatography column close up", focal: "50% 50%", ratio: "3/4", icon: "test-tubes", placement: "Home: instruments, tall tile" },
    "bench-plates": { alt: "A 96-well sitting-drop crystallization plate held up to the light", brief: "Gloved hand holding a clear 96-well crystallization plate, drops visible in each well", search: "protein crystallization plate 96 well", focal: "50% 50%", ratio: "1/1", icon: "grid-3x3", placement: "Home: instruments, square tile" },
    "bench-robot": { alt: "An automated pipetting robot dispensing into a microplate", brief: "Liquid-handling robot with multichannel head over a 96-well plate, tip racks beside it", search: "liquid handling robot pipetting microplate", focal: "50% 45%", ratio: "16/9", icon: "bot", placement: "Home: instruments, wide tile" },
    "receiving": { alt: "A technician unpacks sample tubes from a dry-ice shipping box at the receiving bench", brief: "Insulated shipper open on a bench, dry ice vapor, cryo boxes of labeled tubes, nitrile gloves", search: "dry ice sample shipment lab cryobox", focal: "50% 55%", ratio: "4/3", icon: "package-open", placement: "Home: sample shipping" },
    "cap-mass-spec": { alt: "Mass spectrometer ion source with a nano-flow emitter in position", brief: "Close detail of an electrospray ion source and emitter tip on a mass spectrometer", search: "mass spectrometer ion source electrospray", focal: "50% 50%", ratio: "16/9", icon: "scan-line", placement: "Mass spectrometry page header" },
    "cap-biophysical": { alt: "Size-exclusion chromatography system with light-scattering and refractive index detectors", brief: "SEC system with stacked detectors and solvent bottles, chromatogram on the screen", search: "size exclusion chromatography system detector", focal: "50% 50%", ratio: "16/9", icon: "activity", placement: "Biophysical page header" },
    "cap-binding": { alt: "Scientist loading a sensor chip into a surface plasmon resonance instrument", brief: "SPR instrument with the sensor chip door open, sample rack visible, sensorgram on monitor", search: "surface plasmon resonance instrument sensor chip", focal: "50% 50%", ratio: "16/9", icon: "chart-line", placement: "Binding and potency page header" },
    "cap-structural": { alt: "Protein crystals in a drop seen through a stereo microscope", brief: "Microscope view of small protein crystals in a sitting drop, polarized light", search: "protein crystals microscope drop", focal: "50% 50%", ratio: "16/9", icon: "hexagon", placement: "Structural biology page header" },
  },
};
