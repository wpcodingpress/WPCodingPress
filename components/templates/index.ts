export type TemplateType = 'news' | 'business' | 'modern' | 'advanced' | 'adaptive';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  icon: string;
  isAdaptive?: boolean;
}

export const TEMPLATES: Template[] = [
  {
    id: 'adaptive',
    name: 'Intelligent Adaptive',
    description: 'AI-powered adaptive template that automatically analyzes your WordPress content and generates the optimal layout, design, and sections for your specific industry and content type.',
    preview: '🧠',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    isAdaptive: true,
  },
  {
    id: 'news',
    name: 'News Magazine',
    description: 'Perfect for news portals, magazines, and content-heavy websites with breaking news ticker, trending articles, and category sections.',
    preview: '📰',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  },
  {
    id: 'business',
    name: 'Business Corporate',
    description: 'Ideal for business websites, corporate blogs, and professional services with clean layouts and business-focused sections.',
    preview: '🏢',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean, minimalist design for personal blogs, portfolios, and creative websites with focus on typography and imagery.',
    preview: '✨',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    id: 'advanced',
    name: 'Advanced News',
    description: 'Full-featured news platform with Bengali/English translation, video gallery, trending posts, subscription forms, ads management, and complete feature set.',
    preview: '🚀',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function canChangeTemplate(siteStatus: string, hasCompletedJob: boolean): boolean {
  return siteStatus !== 'connected' || !hasCompletedJob;
}

export function isAdaptiveTemplate(id: string): boolean {
  return id === 'adaptive';
}