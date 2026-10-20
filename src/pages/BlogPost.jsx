import { useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ArticleContent from '../components/ArticleContent.js'
import NotFound from './NotFound'

export default function BlogPost({ posts, loading, onOpenPrivacy }) {
  const { id } = useParams()
  const post = posts.find((item) => item.id === id)
  if (loading) return <main className="min-h-screen flex items-center justify-center"><p className="font-mono text-xs">Loading...</p></main>
  if (!post) return <NotFound />
  return <div className="min-h-screen flex flex-col"><Nav /><ArticleContent post={post} /><Footer onOpenPrivacy={onOpenPrivacy} /></div>
}
