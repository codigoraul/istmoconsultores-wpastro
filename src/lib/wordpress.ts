// ── WordPress helpers para Istmo Consultores ──────────────────────
const WP_BASE = 'https://istmoconsultores.cl/admin/wp-json';

// Contenido del Hero (página de inicio)
export interface HeroContent {
  imagenes:            string[];
  hero_eyebrow:        string;
  hero_titulo:         string;
  hero_titulo_enfasis: string;
  hero_subtitulo:      string;
  hero_cta1_texto:     string;
  hero_cta1_url:       string;
  hero_cta2_texto:     string;
  hero_cta2_url:       string;
}

const DEFAULT_HERO: HeroContent = {
  imagenes:            ['/images/slider-1.webp', '/images/slider-2.webp'],
  hero_eyebrow:        "ASUNTOS PÚBLICOS - INNOVACIÓN INSTITUCIONAL - DESARROLLO TERRITORIAL",
  hero_titulo:         'Conectamos visiones,',
  hero_titulo_enfasis: 'construimos valor',
  hero_subtitulo:      'Transformamos la complejidad institucional, política y territorial en ventajas estratégicas para nuestros clientes en América Latina y el Caribe.',
  hero_cta1_texto:     'Nuestros servicios',
  hero_cta1_url:       '/servicios/',
  hero_cta2_texto:     'Quiénes somos',
  hero_cta2_url:       '/nosotros/',
};

export async function getHeroContent(): Promise<HeroContent> {
  try {
    const res = await fetch(`${WP_BASE}/istmo/v1/inicio`);
    if (!res.ok) return DEFAULT_HERO;
    const data = await res.json();
    const imagenes = [data.hero_imagen_1, data.hero_imagen_2, data.hero_imagen_3]
      .filter(Boolean) as string[];
    return {
      imagenes:            imagenes.length ? imagenes : DEFAULT_HERO.imagenes,
      hero_eyebrow:        data.hero_eyebrow        || DEFAULT_HERO.hero_eyebrow,
      hero_titulo:         data.hero_titulo         || DEFAULT_HERO.hero_titulo,
      hero_titulo_enfasis: data.hero_titulo_enfasis || DEFAULT_HERO.hero_titulo_enfasis,
      hero_subtitulo:      data.hero_subtitulo      || DEFAULT_HERO.hero_subtitulo,
      hero_cta1_texto:     data.hero_cta1_texto     || DEFAULT_HERO.hero_cta1_texto,
      hero_cta1_url:       data.hero_cta1_url       || DEFAULT_HERO.hero_cta1_url,
      hero_cta2_texto:     data.hero_cta2_texto     || DEFAULT_HERO.hero_cta2_texto,
      hero_cta2_url:       data.hero_cta2_url       || DEFAULT_HERO.hero_cta2_url,
    };
  } catch {
    return DEFAULT_HERO;
  }
}

// Datos del sitio (email, teléfono, ubicación, LinkedIn)
export interface StatItem {
  valor: string;
  label: string;
}

export interface SiteOptions {
  email_contacto: string;
  telefono:       string;
  ubicacion:      string;
  linkedin:       string;
  stats:          StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  { valor: '3',   label: 'Pilares estratégicos' },
  { valor: '5+',  label: 'Directores especializados' },
  { valor: 'LAC', label: 'América Latina y el Caribe' },
  { valor: '10+', label: 'Años de experiencia' },
];

const DEFAULT_OPTIONS: SiteOptions = {
  email_contacto: 'contacto@istmoconsultores.cl',
  telefono:       '',
  ubicacion:      'Santiago, Chile',
  linkedin:       'https://www.linkedin.com/company/istmoconsultores',
  stats:          DEFAULT_STATS,
};

export async function getSiteOptions(): Promise<SiteOptions> {
  try {
    const res = await fetch(`${WP_BASE}/istmo/v1/opciones2`);
    if (!res.ok) return DEFAULT_OPTIONS;
    const data = await res.json();
    // Reconstruir stats desde los 4 pares de campos
    const stats: StatItem[] = [1, 2, 3, 4]
      .map(i => ({
        valor: data[`stat_${i}_valor`] || '',
        label: data[`stat_${i}_label`] || '',
      }))
      .filter(s => s.valor && s.label);
    return {
      email_contacto: data.email_contacto || DEFAULT_OPTIONS.email_contacto,
      telefono:       data.telefono       || DEFAULT_OPTIONS.telefono,
      ubicacion:      data.ubicacion      || DEFAULT_OPTIONS.ubicacion,
      linkedin:       data.linkedin       || DEFAULT_OPTIONS.linkedin,
      stats:          stats.length ? stats : DEFAULT_STATS,
    };
  } catch {
    return DEFAULT_OPTIONS;
  }
}

// Servicios
export interface Subarea {
  titulo:      string;
  descripcion: string;
  puntos:      string[];
}
export interface Servicio {
  id:       number;
  slug:     string;
  titulo:   string;
  numero:   string;
  subareas: Subarea[];
}

const DEFAULT_SERVICIOS: Servicio[] = [
  {
    id: 0, slug: 'estrategia',
    numero: '01', titulo: 'Estrategia Pública y Reputacional',
    subareas: [
      { titulo: 'Asuntos Públicos',
        descripcion: 'Diseñamos e implementamos estrategias de relacionamiento institucional que permiten a nuestros clientes desenvolverse de manera legítima, transparente y efectiva en su entorno político y regulatorio.',
        puntos: ['Diseño de estrategias de relacionamiento público-privado.','Monitoreo y análisis legislativo y regulatorio.','Análisis prospectivo del entorno político, social y económico.','Mapeo, segmentación y perfilamiento de stakeholders.','Posicionamiento institucional ante autoridades y organismos multilaterales.'] },
      { titulo: 'Comunicación Estratégica',
        descripcion: 'Acompañamos a las organizaciones en la construcción, protección y recuperación de su reputación institucional, integrando análisis avanzado de datos y monitoreo inteligente del entorno digital.',
        puntos: ['Diagnósticos reputacionales.','Monitoreo y mapeo de marca en entornos digitales.','Diseño de estrategias comunicacionales integrales.','Gestión y preparación ante escenarios de crisis.','Desarrollo de vocerías y mensajes estratégicos.','Alineamiento comunicacional interno y externo.'] },
    ],
  },
  {
    id: 0, slug: 'innovacion',
    numero: '02', titulo: 'Innovación Institucional y Corporativa',
    subareas: [
      { titulo: 'Compliance y Gobernanza',
        descripcion: 'Fortalecemos los marcos de cumplimiento, integridad y gobernanza institucional de cada organización, alineados con estándares nacionales e internacionales.',
        puntos: ['Diagnóstico de riesgos de compliance y gobernanza.','Diseño de modelos de prevención y cumplimiento.','Elaboración y actualización de códigos de ética y conducta.','Protocolos de relacionamiento con autoridades y stakeholders.','Capacitación en integridad y estándares ESG.'] },
      { titulo: 'Cambio Organizacional y Formación Corporativa',
        descripcion: 'Acompañamos procesos de transformación institucional, asegurando coherencia entre estrategia, cultura organizacional y comunicación.',
        puntos: ['Diagnósticos organizacionales.','Gestión y acompañamiento en procesos de cambio organizacional.','Diseño de planes de comunicación interna.','Talleres de alineamiento estratégico y cultural.','Elaboración de protocolos institucionales.','Diseño e implementación de modelos de evaluación de desempeño y formación por competencias.'] },
    ],
  },
  {
    id: 0, slug: 'proyectos',
    numero: '03', titulo: 'Desarrollo y Viabilidad de Proyectos',
    subareas: [
      { titulo: 'Formulación y Evaluación de Proyectos',
        descripcion: 'Apoyamos la estructuración de proyectos de inversión públicos y privados mediante análisis técnico, económico, financiero, regulatorio y estratégico.',
        puntos: ['Estructuración integral de proyectos de inversión social y privada.','Modelamiento de negocios y análisis de viabilidad económica.','Evaluación de riesgos regulatorios, territoriales y comerciales.','Análisis de sensibilidad y mitigación de riesgos.','Gestión de financiamiento.'] },
      { titulo: 'Desarrollo Territorial y Relaciones Comunitarias',
        descripcion: 'Implementamos estrategias en el territorio, facilitando la viabilidad social e institucional de los proyectos e incluyendo el fortalecimiento de economías locales con modelos asociativos.',
        puntos: ['Estrategias de relacionamiento comunitario para proyectos mineros, energéticos, agrícolas, inmobiliarios y de infraestructura.','Impulso del desarrollo económico local mediante la articulación entre Estado, empresas y comunidades.','Diseño y fortalecimiento de modelos asociativos (incluyendo cooperativas productivas y territoriales).','Programas de capacitación por competencias para comunidades.','Diseño de programas de impacto socioeconómico territorial.'] },
      { titulo: 'Estrategia y Viabilidad de Inversiones',
        descripcion: 'Acompañamos a las organizaciones en la estructuración, protección y optimización de su capital, integrando análisis de riesgo tradicional con herramientas de la economía digital.',
        puntos: ['Asesoría en inversiones tradicionales y estructuración de portafolios.','Estrategias en Finanzas Descentralizadas (DeFi) y gestión de activos digitales, incluyendo operación en exchanges descentralizados (DEX), provisión de liquidez y optimización de rendimientos (yield farming).','Desarrollo de contenidos para relacionamiento con inversionistas.'] },
    ],
  },
];

export async function getServicios(): Promise<Servicio[]> {
  try {
    const res = await fetch(`${WP_BASE}/istmo/v1/servicios`);
    if (!res.ok) return DEFAULT_SERVICIOS;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return DEFAULT_SERVICIOS;
    return data;
  } catch {
    return DEFAULT_SERVICIOS;
  }
}

// Equipo directivo ordenado por menu_order
export async function getEquipo() {
  try {
    const res = await fetch(
      `${WP_BASE}/wp/v2/equipo?orderby=menu_order&order=asc&per_page=20&_fields=id,title,meta`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((post: any) => {
      const name: string = post.title?.rendered ?? '';
      const words = name.split(' ').filter(Boolean);
      const second = words.length >= 3 ? words[2] : words[1];
      const initials = words.length >= 2
        ? (words[0][0] + (second?.[0] ?? '')).toUpperCase()
        : (words[0]?.[0] ?? '').toUpperCase();
      return {
        id:          post.id,
        initials,
        photo:       post.meta?.foto              || '',
        name,
        role:        post.meta?.cargo             || '',
        bio:         post.meta?.bio_corta         || '',
        bioCompleta: post.meta?.bio_completa      || '',
        linkedin:    post.meta?.linkedin_director || '',
      };
    });
  } catch {
    return [];
  }
}
