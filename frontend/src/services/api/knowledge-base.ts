import { ApiList, KnowledgeBaseArticle } from '../../types/api'
import { api } from './'

export function getTrainSeriesList () {
    return mockSeriesList
}

export function getKnowledgeBase(trainSeries: string, page?: number, limit?: number): Promise<ApiList<KnowledgeBaseArticle>> {
    return api.get('/knowledge-base', { params: { 'train_series': trainSeries, page, limit } })
}

export function getKnowledgeArticle (id: string): Promise<KnowledgeBaseArticle> {
    return api.get(`/knowledge-base/${id}`)
}

const mockSeriesList = [
    "ВЛ65",
    "ЧМЭ3",
    "ВЛ11М",
    "ТЭМ18Д",
    "ВЛ10У",
    "2ТЭ116",
    "2ЭС10",
    "2ТЭ10У",
    "ВЛ11К",
    "ВЛ85",
    "ЧС2",
    "2ЭС7",
    "ВЛ10К",
    "ЧС2К",
    "ЧС6",
    "ЭП2К",
    "ЭП10",
    "ВЛ11",
    "3ЭС5К",
    "ЭП20",
    "ЧС7",
    "ТЭП70",
    "2ЭС6",
    "ЧС-8",
    "ЭП1",
    "ЭП1М",
    "ДМ",
    "ТЭМ14",
    "ЧС2Т",
    "2М62",
    "2ТЭ70",
    "ВЛ15",
    "ВЛ80Т",
    "ЧС200",
    "ВЛ80С",
    "ЧС4Т",
    "2ТЭ10УК",
    "ВЛ80Р",
    "2М62У",
    "ТЭМ7А",
    "2ЭС4К",
    "ВЛ10",
    "2ТЭ10МК",
    "2ТЭ25А",
    "2ТЭ10М",
    "2ТЭ116УД",
    "2ЭС5К",
    "ТЭП70-БС",
    "2ТЭ25КМ",
    "ТЭМ2"
  ]