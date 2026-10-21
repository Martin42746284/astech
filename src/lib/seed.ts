import hero from "@/assets/hero.jpg";
import fondation from "@/assets/fondation.jpg";
import rendu3d from "@/assets/rendu3d.jpg";
import chantier from "@/assets/chantier.jpg";

const q = (v: string | number | null) =>
  v === null ? "NULL" : typeof v === "number" ? String(v) : `'${v.replace(/'/g, "''")}'`;

const ins = (table: string, row: Record<string, string | number | null>) =>
  `INSERT INTO ${table} (${Object.keys(row).join(",")}) VALUES (${Object.values(row).map(q).join(",")});`;

export function seedSql(): string {
  const settings: Record<string, string> = {
    company_name: "ASTECH",
    tagline_fr: "Bureau d'études & Entreprise de construction",
    tagline_mg: "Biraon'ny fandalinana & Orinasa mpanorina",
    phone1: "+261 38 71 579 41",
    phone2: "+261 32 60 955 61",
    whatsapp: "261387157941",
    email: "rjustmiravo@gmail.com",
    address: "Antananarivo, Madagascar",
    hours_fr: "Lun – Ven : 8h – 17h · Sam : 8h – 12h",
    hours_mg: "Alats – Zoma : 8 ora – 5 ora · Sab : 8 ora – 12 ora",
    facebook: "https://facebook.com",
    stat: "À compléter",
    nif: "À compléter",
    rcs: "À compléter",
    director: "Rajaonarison Andry",
    admin_password: "astech2026",
    about_fr:
      "ASTECH est un bureau d'études et une entreprise de construction à Madagascar. Forts de notre expérience et de notre savoir-faire, nous accompagnons nos clients dans la réalisation de leurs projets, du premier plan à la livraison.",
    about_mg:
      "ASTECH dia biraon'ny fandalinana sy orinasa mpanorina eto Madagasikara. Noho ny traikefa sy fahaizanay, manampy ny mpanjifa izahay amin'ny fanatanterahana ny tetikasany, manomboka amin'ny drafitra voalohany ka hatramin'ny fanolorana.",
    stat_projects: "100",
  };
  const services = [
    ["etudes-devis", "Études et devis", "Fandalinana sy tombana", "Étude de faisabilité et chiffrage", "Fandalinana ny fahafahana sy kajy vidiny", "FileSearch"],
    ["plans-construction", "Plans de construction et d'exécution", "Drafitra fanorenana sy fanatanterahana", "Plans 2D/3D, modélisation 3D", "Drafitra 2D/3D, modely 3D", "DraftingCompass"],
    ["permis-construire", "Dossiers de permis de construire", "Antontan-taratasy fahazoan-dalana hanorina", "Démarches administratives et suivi des autorisations", "Fikarakarana ara-pitantanana", "FileCheck"],
    ["suivi-chantier", "Suivi de chantier", "Fanaraha-maso ny tranokala", "Contrôle qualité et coordination", "Fanaraha-maso ny kalitao sy fandrindrana", "HardHat"],
    ["approvisionnement", "Approvisionnement en matériaux", "Famatsiana fitaovana", "Fourniture et logistique", "Fanomezana sy fitaterana", "Truck"],
    ["fondations", "Études et fouilles de fondation", "Fandalinana sy fihadiana fototra", "Analyse du sol et fondations", "Fandalinana ny tany sy fototra", "Shovel"],
    ["maintenance-realisation", "Maintenance et réalisation", "Fikojakojana sy fanorenana", "Construction et rénovation", "Fanorenana sy fanavaozana", "Home"],
    ["conseil-assistance", "Conseil et assistance", "Torohevitra sy fanampiana", "Accompagnement personnalisé", "Fanampiana manokana", "Users"],
  ];
  const rows: string[] = [];
  for (const [k, v] of Object.entries(settings)) rows.push(ins("settings", { key: k, value: v }));
  services.forEach(([slug, tf, tm, sf, sm, icon], i) =>
    rows.push(
      ins("services", {
        slug: slug!, title_fr: tf!, title_mg: tm!, summary_fr: sf!, summary_mg: sm!,
        description_fr: `${sf}. Notre équipe d'ingénieurs et de techniciens vous accompagne avec rigueur et transparence pour que votre projet respecte les normes, le budget et les délais convenus.`,
        description_mg: `${sm}. Ny ekipanay injeniera sy teknisianina dia manampy anao amin'ny fomba henjana sy mangarahara mba hanajana ny fenitra, ny tetibola ary ny fe-potoana.`,
        steps_fr: "Premier échange et visite du terrain\nAnalyse des besoins et proposition\nRéalisation et validation\nRemise des livrables et suivi",
        steps_mg: "Resaka voalohany sy fitsidihana ny tany\nFandalinana ny filana sy tolo-kevitra\nFanatanterahana sy fankatoavana\nFanolorana ny vokatra sy fanaraha-maso",
        deliverables_fr: "Rapport détaillé\nDevis chiffré\nPlans et documents techniques",
        deliverables_mg: "Tatitra amin'ny antsipiriany\nTombam-bidy\nDrafitra sy antontan-taratasy teknika",
        icon: icon!, ord: i + 1, active: 1,
      }),
    ),
  );
  const projects = [
    ["villa-antananarivo", "Villa moderne à Antananarivo", "Trano maoderina any Antananarivo", "maison", "Antananarivo", hero, 1],
    ["fondations-lotissement", "Fondations – Lotissement", "Fototra – Tanàna vaovao", "fondation", "Fianarantsoa", fondation, 1],
    ["rendu-3d-contemporaine", "Rendu 3D – Maison contemporaine", "Sary 3D – Trano maoderina", "rendu-3d", "Projet villa moderne", rendu3d, 1],
    ["immeuble-r2", "Immeuble R+2", "Trano rihana R+2", "chantier", "Toamasina", chantier, 1],
  ] as const;
  projects.forEach(([slug, tf, tm, cat, loc, img, feat]) =>
    rows.push(
      ins("projects", {
        slug, title_fr: tf, title_mg: tm, category: cat, location: loc, year: 2026,
        description_fr: "Projet réalisé par ASTECH : étude, plans, suivi de chantier et livraison dans le respect des délais et du budget.",
        description_mg: "Tetikasa natanterahin'ny ASTECH: fandalinana, drafitra, fanaraha-maso ary fanolorana ara-potoana sy ara-tetibola.",
        image: img, featured: feat,
      }),
    ),
  );
  const faqs = [
    ["Combien de temps faut-il pour obtenir un permis de construire ?", "Hafiriana vao azo ny fahazoan-dalana hanorina?", "En général 1 à 3 mois selon la commune et la complétude du dossier. Nous préparons et suivons le dossier pour vous.", "Matetika 1 ka hatramin'ny 3 volana arakaraka ny kaominina. Izahay no manomana sy manaraka ny antontan-taratasy."],
    ["Quels sont les délais pour la réalisation d'une maison ?", "Hafiriana ny fanorenana trano iray?", "Comptez 6 à 12 mois pour une maison individuelle, selon la taille et l'approvisionnement.", "6 ka hatramin'ny 12 volana ho an'ny trano tokana, arakaraka ny habeny."],
    ["Que comprend un devis ?", "Inona avy no ao anatin'ny tombam-bidy?", "Le détail des travaux, des matériaux, de la main-d'œuvre et un planning prévisionnel.", "Ny antsipirian'ny asa, ny fitaovana, ny mpiasa ary ny fandaharam-potoana."],
    ["Travaillez-vous avec des particuliers uniquement ?", "Olon-tsotra ihany ve no iarahanareo miasa?", "Non, nous travaillons aussi avec des promoteurs, entreprises et commerçants.", "Tsia, miara-miasa amin'ny mpandraharaha sy orinasa koa izahay."],
    ["Intervenez-vous dans toute Madagascar ?", "Miasa manerana an'i Madagasikara ve ianareo?", "Oui, nous intervenons sur l'ensemble du territoire. Les frais de déplacement sont précisés au devis.", "Eny, manerana ny nosy. Voalaza ao amin'ny tombam-bidy ny saran-dalana."],
    ["Proposez-vous un suivi pour la diaspora ?", "Manome fanaraha-maso ho an'ny Malagasy any ivelany ve ianareo?", "Oui : rapports photo réguliers, appels vidéo et visites de chantier sur demande.", "Eny: tatitra misy sary, antso video ary fitsidihana tranokala."],
  ];
  faqs.forEach(([qf, qm, af, am], i) => rows.push(ins("faqs", { q_fr: qf!, q_mg: qm!, a_fr: af!, a_mg: am!, ord: i + 1 })));
  rows.push(
    ins("testimonials", { name: "Hasina R.", role: "Particulier, Antananarivo", text_fr: "Équipe sérieuse et à l'écoute. Notre maison a été livrée dans les délais.", text_mg: "Ekipa matotra sy mihaino. Vita ara-potoana ny tranonay.", rating: 5 }),
    ins("testimonials", { name: "Mamy L.", role: "Diaspora, France", text_fr: "Grâce aux rapports réguliers, j'ai suivi mon chantier depuis Paris en toute confiance.", text_mg: "Noho ny tatitra tsy tapaka dia nanaraka ny tranokalako avy any Paris aho.", rating: 5 }),
    ins("testimonials", { name: "Tiana A.", role: "Commerçant, Toamasina", text_fr: "Plans clairs, devis transparent, je recommande ASTECH.", text_mg: "Drafitra mazava, tombam-bidy mangarahara, ankasitrahako ny ASTECH.", rating: 4 }),
  );
  return rows.join("\n");
}
