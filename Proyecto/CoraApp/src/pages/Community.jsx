import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { mockPosts } from '../services/mockData'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Textarea } from '../components/common/Input'
import { Modal } from '../components/common/Modal'

const categories = [
  { value: 'all', label: 'Todo', icon: '📋' },
  { value: 'experiences', label: 'Experiencias', icon: '💬' },
  { value: 'resources', label: 'Recursos', icon: '📚' },
  { value: 'questions', label: 'Preguntas', icon: '❓' },
  { value: 'support', label: 'Apoyo', icon: '🤝' },
]

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [posts, setPosts] = useState(mockPosts)
  const [newPostModal, setNewPostModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'experiences', anonymous: true })
  const [likedPosts, setLikedPosts] = useState(new Set(['post_002']))

  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory)

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
        setPosts(ps => ps.map(p => p.id === postId ? { ...p, likeCount: p.likeCount - 1 } : p))
      } else {
        next.add(postId)
        setPosts(ps => ps.map(p => p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p))
      }
      return next
    })
  }

  const categoryColors = {
    experiences: 'teal',
    resources: 'sage',
    questions: 'warm',
    support: 'blue',
    general: 'gray',
    news: 'blue',
  }

  const categoryLabels = {
    experiences: 'Experiencias',
    resources: 'Recursos',
    questions: 'Preguntas',
    support: 'Apoyo',
    general: 'General',
    news: 'Noticias',
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-padding py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          🌱 Comunidad Cora
        </div>
        <h1 className="text-4xl font-black text-surface-900 dark:text-white mb-3">
          Un espacio seguro para compartir
        </h1>
        <p className="text-surface-500 max-w-xl mx-auto mb-8">
          Lee experiencias reales, encontrá recursos y conectá con personas que entienden lo que vivís. Todo es anónimo si querés.
        </p>
        <Button size="lg" onClick={() => setNewPostModal(true)}>
          ✏️ Compartir algo
        </Button>
      </div>

      <div className="section-padding pb-16">
        {/* Category filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-teal-500 text-white shadow-cora'
                  : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 hover:border-teal-300'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="space-y-6">
          {filtered.map(post => (
            <Card key={post.id} hover className="p-6">
              <div className="flex items-start gap-4">
                {/* Author */}
                <Avatar
                  firstName={post.author.role === 'psychologist' ? post.author.firstName : '?'}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-surface-900 dark:text-white">
                      {post.isAnonymous ? 'Anónimo' : post.author.firstName}
                    </span>
                    {post.author.role === 'psychologist' && (
                      <Badge color="teal">Psicólogo ✓</Badge>
                    )}
                    <Badge color={categoryColors[post.category] || 'gray'}>
                      {categoryLabels[post.category] || post.category}
                    </Badge>
                    <span className="text-xs text-surface-400">
                      · {formatDistanceFromNow(post.createdAt)}
                    </span>
                    <span className="text-xs text-surface-400">· {post.readTime} min de lectura</span>
                  </div>

                  <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 text-surface-500 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-surface-400 hover:text-red-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likeCount}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-teal-500 transition-colors font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.commentCount}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-sage-500 transition-colors font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Compartir
                    </button>
                    <button className="ml-auto text-xs text-surface-300 hover:text-surface-500 transition-colors">
                      Reportar
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* New post modal */}
      <Modal isOpen={newPostModal} onClose={() => setNewPostModal(false)} title="Compartir con la comunidad" size="lg">
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              className="input-base"
              placeholder="Un título claro y descriptivo para tu post"
              value={newPost.title}
              onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
            />
          </div>
          <Textarea
            label="Contenido"
            required
            rows={6}
            placeholder="Compartí tu experiencia, recurso o pregunta. Podés usar formato Markdown."
            value={newPost.content}
            onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
          />
          <div>
            <p className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Categoría</p>
            <div className="flex gap-2 flex-wrap">
              {categories.filter(c => c.value !== 'all').map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setNewPost(p => ({ ...p, category: cat.value }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                    newPost.category === cat.value
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                      : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:border-teal-300'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newPost.anonymous}
              onChange={e => setNewPost(p => ({ ...p, anonymous: e.target.checked }))}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <div>
              <span className="text-sm font-medium text-surface-800 dark:text-surface-200">Publicar de forma anónima</span>
              <p className="text-xs text-surface-400">Tu nombre no será visible para otros usuarios</p>
            </div>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setNewPostModal(false)}>
              Cancelar
            </Button>
            <Button fullWidth onClick={() => setNewPostModal(false)}>
              Publicar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function formatDistanceFromNow(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'ayer'
  if (diffDays < 7) return `hace ${diffDays} días`
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`
  return format(date, 'd MMM', { locale: es })
}
