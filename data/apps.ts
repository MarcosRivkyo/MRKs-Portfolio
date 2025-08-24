export type AppItem = {
  id: string
  name: string
  description: string
  url: string // URL base de la app protegida (local/prod via env)
  badge?: string
  icon?: string // opcional: ruta a un icono
}

export const APPS: AppItem[] = [
  {
    id: 'actas',
    name: 'Generador de Actas de Visita a Obras',
    description: 'Crea actas de visita a obra con IA y exporta a PDF.',
    url: process.env.NEXT_PUBLIC_ACTAS_URL || 'https://mrkportfolio.vercel.app/error',
    badge: 'v1.0',
    icon: '/static/images/apps/actas.png',
  },
  {
    id: 'hcc_ai',
    name: 'IA para la Detección del HCC',
    description: 'App diseñada para especialistas médicos en la salud hepática.',
    url: process.env.NEXT_PUBLIC_HCC_AI_URL || 'https://mrkportfolio.vercel.app/error',
    badge: 'v1.0',
    icon: '/static/images/liver.png',
  },
]
