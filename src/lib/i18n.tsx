import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "mg";

const dict = {
  home: { fr: "Accueil", mg: "Fandraisana" },
  services: { fr: "Services", mg: "Tolotra" },
  projects: { fr: "Réalisations", mg: "Zava-bita" },
  about: { fr: "À propos", mg: "Momba anay" },
  faq: { fr: "FAQ", mg: "Fanontaniana" },
  contact: { fr: "Contact", mg: "Fifandraisana" },
  legal: { fr: "Mentions légales", mg: "Fampahalalana ara-dalàna" },
  quote: { fr: "Demander un devis", mg: "Hangataka tombam-bidy" },
  heroEyebrow: { fr: "Concevoir · Construire · Durer", mg: "Mamolavola · Manorina · Maharitra" },
  heroTitle: { fr: "Votre projet de construction entre de bonnes mains.", mg: "Ny tetikasa fanorenanao eo am-pelatanana azo antoka." },
  heroText: {
    fr: "Bureau d'études et entreprise de construction à Madagascar. Des études aux plans, du suivi de chantier à la réalisation de votre bâtiment.",
    mg: "Biraon'ny fandalinana sy orinasa mpanorina eto Madagasikara. Manomboka amin'ny fandalinana ka hatramin'ny fanorenana ny tranonao.",
  },
  statProjects: { fr: "projets réalisés", mg: "tetikasa vita" },
  statServices: { fr: "services complets", mg: "tolotra feno" },
  statQuality: { fr: "engagement qualité", mg: "fanoloran-tena kalitao" },
  ourServices: { fr: "Nos services", mg: "Ny tolotray" },
  servicesSub: { fr: "Une expertise complète pour concrétiser vos projets", mg: "Fahaizana feno hanatanterahana ny tetikasanao" },
  allServices: { fr: "Voir tous les services", mg: "Hijery ny tolotra rehetra" },
  ourProjects: { fr: "Nos réalisations", mg: "Ny zava-bitanay" },
  projectsSub: { fr: "Découvrez quelques-unes de nos réalisations", mg: "Jereo ireo zava-bitanay sasany" },
  allProjects: { fr: "Voir toutes les réalisations", mg: "Hijery ny zava-bita rehetra" },
  ctaTitle: { fr: "Un projet ? Une question ? Contactez-nous dès maintenant !", mg: "Manana tetikasa? Fanontaniana? Mifandraisa aminay!" },
  ctaText: { fr: "Notre équipe vous accompagne pour étudier votre projet et vous proposer une solution adaptée à vos besoins.", mg: "Ny ekipanay dia hanampy anao handinika ny tetikasanao sy hanolotra vahaolana mifanaraka aminao." },
  testimonials: { fr: "Ils nous font confiance", mg: "Matoky anay izy ireo" },
  all: { fr: "Tous", mg: "Rehetra" },
  cat_maison: { fr: "Maison individuelle", mg: "Trano tokana" },
  cat_fondation: { fr: "Fondations", mg: "Fototra" },
  "cat_rendu-3d": { fr: "Rendu 3D", mg: "Sary 3D" },
  cat_chantier: { fr: "Chantier en cours", mg: "Tranokala mandeha" },
  steps: { fr: "Étapes", mg: "Dingana" },
  deliverables: { fr: "Livrables", mg: "Vokatra omena" },
  backHome: { fr: "Retour à l'accueil", mg: "Hiverina any am-piandohana" },
  notFound: { fr: "Page introuvable", mg: "Tsy hita ny pejy" },
  contactInfo: { fr: "Nos coordonnées", mg: "Ny adiresinay" },
  phone: { fr: "Téléphone / WhatsApp", mg: "Telefaona / WhatsApp" },
  email: { fr: "E-mail", mg: "Mailaka" },
  address: { fr: "Adresse", mg: "Adiresy" },
  hours: { fr: "Horaires", mg: "Ora fiasana" },
  formIntro: { fr: "Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.", mg: "Fenoy ity taratasy ity, hamaly anao haingana izahay." },
  f_name: { fr: "Nom complet", mg: "Anarana feno" },
  f_phone: { fr: "Téléphone", mg: "Telefaona" },
  f_email: { fr: "E-mail (facultatif)", mg: "Mailaka (tsy voatery)" },
  f_type: { fr: "Type de projet", mg: "Karazana tetikasa" },
  f_location: { fr: "Localisation du terrain", mg: "Toerana misy ny tany" },
  f_budget: { fr: "Budget indicatif", mg: "Tetibola eo ho eo" },
  f_surface: { fr: "Surface (m²)", mg: "Velarana (m²)" },
  f_message: { fr: "Message", mg: "Hafatra" },
  f_file: { fr: "Pièce jointe (plan ou photo, facultatif, 3 Mo max)", mg: "Rakitra (drafitra na sary, 3 Mo farafahabetsany)" },
  f_consent: { fr: "J'accepte la politique de confidentialité et l'utilisation de mes données pour traiter ma demande.", mg: "Ekeko ny politikan'ny tsiambaratelo sy ny fampiasana ny angon-drakitro." },
  f_send: { fr: "Envoyer ma demande", mg: "Alefaso ny fangatahako" },
  f_choose: { fr: "Choisir un type", mg: "Mifidiana karazana" },
  f_required: { fr: "Champ obligatoire", mg: "Tsy maintsy fenoina" },
  f_phoneInvalid: { fr: "Numéro de téléphone invalide", mg: "Laharana diso" },
  f_emailInvalid: { fr: "E-mail invalide", mg: "Mailaka diso" },
  f_consentReq: { fr: "Votre consentement est requis", mg: "Ilaina ny fanekenao" },
  f_tooSoon: { fr: "Merci de patienter une minute avant un nouvel envoi.", mg: "Miandrasa iray minitra azafady." },
  f_submitError: { fr: "Votre demande n'a pas pu être enregistrée. Vérifiez votre connexion et réessayez.", mg: "Tsy voatahiry ny fangatahanao. Hamarino ny fifandraisana ary andramo indray." },
  f_success: { fr: "Merci ! Votre demande a bien été enregistrée. Nous vous recontactons rapidement.", mg: "Misaotra! Voaray ny fangatahanao. Hiantso anao tsy ho ela izahay." },
  type_maison: { fr: "Maison individuelle", mg: "Trano tokana" },
  type_fondation: { fr: "Fondations", mg: "Fototra" },
  "type_rendu-3d": { fr: "Plans / Rendu 3D", mg: "Drafitra / Sary 3D" },
  type_chantier: { fr: "Suivi de chantier", mg: "Fanaraha-maso tranokala" },
  type_permis: { fr: "Permis de construire", mg: "Fahazoan-dalana" },
  type_etude: { fr: "Étude et devis", mg: "Fandalinana" },
  type_autre: { fr: "Autre", mg: "Hafa" },
  preferWa: { fr: "Vous préférez WhatsApp ? Écrivez-nous directement !", mg: "Aleonao WhatsApp? Soraty mivantana izahay!" },
  faqTitle: { fr: "Les questions les plus fréquentes", mg: "Fanontaniana matetika apetraka" },
  faqSub: { fr: "Trouvez ici les réponses aux questions courantes concernant nos services, les délais et les démarches.", mg: "Hitanao eto ny valin'ireo fanontaniana mahazatra." },
  ourStory: { fr: "Notre histoire", mg: "Ny tantaranay" },
  commitments: { fr: "Nos engagements", mg: "Ny fanoloran-tenanay" },
  quality: { fr: "Qualité des travaux", mg: "Kalitaon'ny asa" },
  deadlines: { fr: "Respect des délais", mg: "Fanajana fe-potoana" },
  transparency: { fr: "Transparence des prix", mg: "Vidiny mangarahara" },
  satisfaction: { fr: "Satisfaction client", mg: "Fahafaham-po" },
  legalInfo: { fr: "Informations légales", mg: "Fampahalalana ara-dalàna" },
  navigation: { fr: "Navigation", mg: "Fitetezana" },
  followUs: { fr: "Suivez-nous", mg: "Araho izahay" },
  rights: { fr: "Tous droits réservés.", mg: "Zo rehetra voatokana." },
  slogan: { fr: "Construire aujourd'hui, pour demain", mg: "Manorina anio ho an'ny rahampitso" },
  waMsg: { fr: "Bonjour ASTECH, je souhaite des informations pour un projet de construction.", mg: "Manao ahoana ASTECH, mila fanazavana momba ny tetikasa fanorenana aho." },
  servicesIntro: { fr: "De la conception à la réalisation, ASTECH vous accompagne à chaque étape de votre projet.", mg: "Manomboka amin'ny famolavolana ka hatramin'ny fanatanterahana, manampy anao isaky ny dingana ny ASTECH." },
  needQuote: { fr: "Besoin d'un devis ? Parlons de votre projet !", mg: "Mila tombam-bidy? Andao hiresaka ny tetikasanao!" },
} satisfies Record<string, Record<Lang, string>>;

export type DictKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string; pick: (row: Record<string, unknown>, field: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    const saved = localStorage.getItem("astech-lang");
    if (saved === "mg" || saved === "fr") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "mg" ? "mg" : "fr";
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("astech-lang", l);
  };
  const t = (k: DictKey) => dict[k]?.[lang] ?? k;
  const pick = (row: Record<string, unknown>, field: string) =>
    String(row[`${field}_${lang}`] || row[`${field}_fr`] || "");
  return <I18nContext.Provider value={{ lang, setLang, t, pick }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
