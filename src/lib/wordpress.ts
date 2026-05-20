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
  hero_eyebrow:        "Asuntos Públicos · Comunicación Estratégica\nDesarrollo Territorial · Innovación Institucional",
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
export interface SiteOptions {
  email_contacto: string;
  telefono:       string;
  ubicacion:      string;
  linkedin:       string;
}

const DEFAULT_OPTIONS: SiteOptions = {
  email_contacto: 'contacto@istmoconsultores.cl',
  telefono:       '',
  ubicacion:      'Santiago, Chile',
  linkedin:       'https://www.linkedin.com/company/istmoconsultores',
};

export async function getSiteOptions(): Promise<SiteOptions> {
  try {
    const res = await fetch(`${WP_BASE}/istmo/v1/opciones`);
    if (!res.ok) return DEFAULT_OPTIONS;
    const data = await res.json();
    // Mezclar con defaults para campos vacíos
    return {
      email_contacto: data.email_contacto || DEFAULT_OPTIONS.email_contacto,
      telefono:       data.telefono       || DEFAULT_OPTIONS.telefono,
      ubicacion:      data.ubicacion      || DEFAULT_OPTIONS.ubicacion,
      linkedin:       data.linkedin       || DEFAULT_OPTIONS.linkedin,
    };
  } catch {
    return DEFAULT_OPTIONS;
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
      const initials = name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
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
