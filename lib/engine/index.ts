export { detectFeatures } from './feature-detector'
export { classifyIndustry } from './industry-classifier'
export { normalizeWPData } from './content-mapper'
export { generateLayout } from './layout-engine'
export type {
  FeatureMap, IndustryAnalysis, IndustrySignal,
  SectionPriority, LayoutRecommendation, NormalizationResult, WPExportRaw,
} from './types'
