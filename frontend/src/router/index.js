import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import KnowledgeBaseView from '../views/KnowledgeBaseView.vue'
import KnowledgeArticleView from '../views/KnowledgeArticleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/',
      name: 'search',
      component: SearchView
    },
    {
      path: '/knowledge-base',
      name: 'knowledgeBase',
      component: KnowledgeBaseView
    },
    {
      path: '/knowledge-base/:id',
      name: 'knowledgeBaseArticle',
      component: KnowledgeArticleView,
      props: true
    }
  ]
})

export default router
