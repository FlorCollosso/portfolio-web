import type { CaseStudyData } from '../../types/caseStudy'
import { mrObrasCaseStudy } from './mrObras'

// Proyectos con caso de estudio ampliado. Los demás siguen usando el modal simple.
const caseStudies: Record<string, CaseStudyData> = {
  [mrObrasCaseStudy.projectId]: mrObrasCaseStudy,
}

export const getCaseStudy = (projectId?: string) => (projectId ? caseStudies[projectId] : undefined)
