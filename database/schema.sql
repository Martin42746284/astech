CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL DEFAULT '',
  title_mg TEXT NOT NULL DEFAULT '',
  summary_fr TEXT NOT NULL DEFAULT '',
  summary_mg TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',
  description_mg TEXT NOT NULL DEFAULT '',
  steps_fr TEXT NOT NULL DEFAULT '',
  steps_mg TEXT NOT NULL DEFAULT '',
  deliverables_fr TEXT NOT NULL DEFAULT '',
  deliverables_mg TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Home',
  ord INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL DEFAULT '',
  title_mg TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'maison',
  location TEXT NOT NULL DEFAULT '',
  year INTEGER,
  description_fr TEXT NOT NULL DEFAULT '',
  description_mg TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  q_fr TEXT NOT NULL DEFAULT '',
  q_mg TEXT NOT NULL DEFAULT '',
  a_fr TEXT NOT NULL DEFAULT '',
  a_mg TEXT NOT NULL DEFAULT '',
  ord INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  text_fr TEXT NOT NULL DEFAULT '',
  text_mg TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quotes (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project_type TEXT NOT NULL,
  location TEXT,
  budget TEXT,
  surface TEXT,
  message TEXT NOT NULL,
  attachment TEXT,
  attachment_name TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS visits (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS whatsapp_clicks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO settings (key, value) VALUES
  ('company_name', 'ASTECH'),
  ('tagline_fr', 'Bureau d''études & Entreprise de construction'),
  ('tagline_mg', 'Biraon''ny fandalinana & Orinasa mpanorina'),
  ('phone1', '+261 38 71 579 41'),
  ('phone2', '+261 32 60 955 61'),
  ('whatsapp', '261387157941'),
  ('email', 'rjustmiravo@gmail.com'),
  ('address', 'Antananarivo, Madagascar'),
  ('hours_fr', 'Lun – Ven : 8h – 17h · Sam : 8h – 12h'),
  ('hours_mg', 'Alats – Zoma : 8 ora – 5 ora · Sab : 8 ora – 12 ora'),
  ('facebook', 'https://facebook.com'),
  ('stat', 'À compléter'),
  ('nif', 'À compléter'),
  ('rcs', 'À compléter'),
  ('director', 'Rajaonarison Andry'),
  ('stat_projects', '100'),
  ('about_fr', 'ASTECH est un bureau d''études et une entreprise de construction à Madagascar. Nous accompagnons nos clients de la conception à la livraison.'),
  ('about_mg', 'ASTECH dia biraon''ny fandalinana sy orinasa mpanorina eto Madagasikara. Manampy ny mpanjifa izahay manomboka amin''ny famolavolana ka hatramin''ny fanolorana.')
ON CONFLICT (key) DO NOTHING;

-- Change this initial password immediately after the first successful login.
INSERT INTO settings (key, value) VALUES ('admin_password', 'astech2026')
ON CONFLICT (key) DO NOTHING;

INSERT INTO services (slug, title_fr, title_mg, summary_fr, summary_mg, description_fr, description_mg, steps_fr, steps_mg, deliverables_fr, deliverables_mg, icon, ord, active) VALUES
  ('etudes-devis', 'Études et devis', 'Fandalinana sy tombana', 'Étude de faisabilité et chiffrage', 'Fandalinana sy kajy vidiny', 'Étude de faisabilité, analyse des besoins et devis détaillé.', 'Fandalinana ny fahafahana, ny filana ary ny tombam-bidy.', 'Premier échange et visite du terrain\nAnalyse des besoins et proposition\nValidation du devis', 'Resaka voalohany sy fitsidihana ny tany\nFandalinana ny filana sy tolo-kevitra\nFankatoavana ny tombam-bidy', 'Rapport détaillé\nDevis chiffré', 'Tatitra amin''ny antsipiriany\nTombam-bidy', 'FileSearch', 1, 1),
  ('plans-construction', 'Plans de construction et d''exécution', 'Drafitra fanorenana', 'Plans 2D/3D, modélisation 3D', 'Drafitra 2D/3D sy modely 3D', 'Conception des plans et modélisation de votre projet.', 'Famolavolana drafitra sy modely ho an''ny tetikasanao.', 'Échange sur les besoins\nConception\nValidation des plans', 'Fifanakalozana momba ny filana\nFamolavolana\nFankatoavana ny drafitra', 'Plans et documents techniques\nRendus 3D', 'Drafitra sy antontan-taratasy teknika\nSary 3D', 'DraftingCompass', 2, 1),
  ('permis-construire', 'Dossiers de permis de construire', 'Fahazoan-dalana hanorina', 'Démarches administratives et suivi', 'Fikarakarana sy fanaraha-maso ara-pitantanana', 'Préparation et suivi des démarches administratives.', 'Fanomanana sy fanaraha-maso ny antontan-taratasy ara-pitantanana.', 'Vérification des pièces\nPréparation du dossier\nSuivi auprès des services concernés', 'Fanamarinana antontan-taratasy\nFanomanana ny dosie\nFanaraha-maso amin''ny sampan-draharaha', 'Dossier administratif complet\nSuivi des démarches', 'Dosie ara-pitantanana feno\nFanaraha-maso ny dingana', 'FileCheck', 3, 1),
  ('suivi-chantier', 'Suivi de chantier', 'Fanaraha-maso ny asa', 'Contrôle qualité et coordination', 'Fanaraha-maso kalitao sy fandrindrana', 'Coordination des intervenants et contrôle de la qualité des travaux.', 'Fandrindrana ny mpiasa sy fanaraha-maso ny kalitaon''ny asa.', 'Planification des visites\nContrôle de l''avancement\nRapports de suivi', 'Fandaminana fitsidihana\nFanaraha-maso ny fandrosoana\nTatitra fanaraha-maso', 'Rapports de chantier\nSuivi de l''avancement', 'Tatitra momba ny asa\nFanaraha-maso ny fandrosoana', 'HardHat', 4, 1),
  ('approvisionnement', 'Approvisionnement en matériaux', 'Famatsiana fitaovana', 'Fourniture et logistique', 'Famatsiana sy fitaterana', 'Organisation de la fourniture et de la logistique des matériaux.', 'Fikarakarana ny famatsiana sy fitaterana fitaovana.', 'Définition des besoins\nSélection des matériaux\nOrganisation de la livraison', 'Famantarana ny filana\nFifantenana fitaovana\nFandaminana ny fanaterana', 'Liste de matériaux\nOrganisation logistique', 'Lisitry ny fitaovana\nFandaminana ny fitaterana', 'Truck', 5, 1),
  ('fondations', 'Études et fouilles de fondation', 'Fandalinana sy fototra', 'Analyse du sol et fondations', 'Fandalinana ny tany sy fototra', 'Étude du terrain et préparation des travaux de fondation.', 'Fandalinana ny tany sy fanomanana ny asa fototra.', 'Visite et analyse du terrain\nÉtude technique\nPréparation des travaux', 'Fitsidihana sy fandalinana ny tany\nFandalinana teknika\nFanomanana ny asa', 'Recommandations techniques\nSuivi des travaux de fondation', 'Torohevitra teknika\nFanaraha-maso ny asa fototra', 'Shovel', 6, 1),
  ('maintenance-realisation', 'Maintenance et réalisation', 'Fanorenana sy fikojakojana', 'Construction et rénovation', 'Fanorenana sy fanavaozana', 'Réalisation de travaux de construction, rénovation et maintenance.', 'Fanatanterahana asa fanorenana, fanavaozana ary fikojakojana.', 'Évaluation du projet\nPlanification\nRéalisation et contrôle', 'Fanombanana ny tetikasa\nFandaminana\nFanatanterahana sy fanaraha-maso', 'Travaux réalisés\nContrôle qualité', 'Asa vita\nFanaraha-maso kalitao', 'Home', 7, 1),
  ('conseil-assistance', 'Conseil et assistance', 'Torohevitra sy fanampiana', 'Accompagnement personnalisé', 'Fanampiana manokana', 'Conseil et accompagnement adaptés à votre projet.', 'Torohevitra sy fanampiana mifanaraka amin''ny tetikasanao.', 'Écoute des besoins\nConseils personnalisés\nAccompagnement du projet', 'Fihainoana ny filana\nTorohevitra manokana\nFanampiana ny tetikasa', 'Conseils et recommandations\nAccompagnement', 'Torohevitra\nFanampiana', 'Users', 8, 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (slug, title_fr, title_mg, category, location, year, description_fr, description_mg, image, featured) VALUES
  ('villa-antananarivo', 'Villa moderne à Antananarivo', 'Trano maoderina any Antananarivo', 'maison', 'Antananarivo', 2026, 'Projet de villa moderne réalisé par ASTECH.', 'Tetikasa trano maoderina notanterahin''ny ASTECH.', '/images/hero.jpg', 1),
  ('fondations-lotissement', 'Fondations – Lotissement', 'Fototra – Tanàna vaovao', 'fondation', 'Fianarantsoa', 2026, 'Travaux de fondation pour un projet de lotissement.', 'Asa fototra ho an''ny tetikasa tanàna vaovao.', '/images/fondation.jpg', 1),
  ('rendu-3d-contemporaine', 'Rendu 3D – Maison contemporaine', 'Sary 3D – Trano maoderina', 'rendu-3d', 'Projet villa moderne', 2026, 'Conception et rendu 3D d''une maison contemporaine.', 'Famolavolana sy sary 3D ho an''ny trano maoderina.', '/images/rendu3d.jpg', 1),
  ('immeuble-r2', 'Immeuble R+2', 'Trano rihana R+2', 'chantier', 'Toamasina', 2026, 'Suivi d''un chantier de construction d''un immeuble R+2.', 'Fanaraha-maso ny fanorenana trano rihana R+2.', '/images/chantier.jpg', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO faqs (q_fr, q_mg, a_fr, a_mg, ord)
SELECT seed.q_fr, seed.q_mg, seed.a_fr, seed.a_mg, seed.ord
FROM (VALUES
  ('Combien de temps faut-il pour obtenir un permis de construire ?', 'Hafiriana vao azo ny fahazoan-dalana hanorina?', 'En général 1 à 3 mois selon la commune et la complétude du dossier.', 'Matetika 1 ka hatramin''ny 3 volana arakaraka ny kaominina sy ny antontan-taratasy.', 1),
  ('Quels sont les délais pour la réalisation d''une maison ?', 'Hafiriana ny fanorenana trano iray?', 'Comptez 6 à 12 mois pour une maison individuelle, selon la taille et l''approvisionnement.', '6 ka hatramin''ny 12 volana ho an''ny trano tokana, arakaraka ny habeny.', 2),
  ('Que comprend un devis ?', 'Inona avy no ao anatin''ny tombam-bidy?', 'Le détail des travaux, des matériaux, de la main-d''œuvre et un planning prévisionnel.', 'Ny antsipirian''ny asa, fitaovana, mpiasa ary fandaharam-potoana.', 3),
  ('Travaillez-vous avec des particuliers uniquement ?', 'Olon-tsotra ihany ve no iarahanareo miasa?', 'Non, nous travaillons aussi avec des promoteurs, entreprises et commerçants.', 'Tsia, miara-miasa amin''ny mpandraharaha sy orinasa koa izahay.', 4),
  ('Intervenez-vous dans toute Madagascar ?', 'Miasa manerana an''i Madagasikara ve ianareo?', 'Oui, nous intervenons sur l''ensemble du territoire.', 'Eny, manerana an''i Madagasikara izahay.', 5),
  ('Proposez-vous un suivi pour la diaspora ?', 'Manome fanaraha-maso ho an''ny Malagasy any ivelany ve ianareo?', 'Oui : rapports photo réguliers, appels vidéo et visites de chantier sur demande.', 'Eny: tatitra misy sary, antso video ary fitsidihana toerana raha ilaina.', 6)
) AS seed(q_fr, q_mg, a_fr, a_mg, ord)
WHERE NOT EXISTS (SELECT 1 FROM faqs);

INSERT INTO testimonials (name, role, text_fr, text_mg, rating, active)
SELECT seed.name, seed.role, seed.text_fr, seed.text_mg, seed.rating, 1
FROM (VALUES
  ('Hasina R.', 'Particulier, Antananarivo', 'Équipe sérieuse et à l''écoute. Notre maison a été livrée dans les délais.', 'Ekipa matotra sy mihaino. Vita ara-potoana ny tranonay.', 5),
  ('Mamy L.', 'Diaspora, France', 'Grâce aux rapports réguliers, j''ai suivi mon chantier depuis Paris en toute confiance.', 'Noho ny tatitra tsy tapaka dia nanaraka ny asako avy any Paris aho.', 5),
  ('Tiana A.', 'Commerçant, Toamasina', 'Plans clairs, devis transparent, je recommande ASTECH.', 'Drafitra mazava, tombam-bidy mangarahara, ankasitrahako ny ASTECH.', 4)
) AS seed(name, role, text_fr, text_mg, rating)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
