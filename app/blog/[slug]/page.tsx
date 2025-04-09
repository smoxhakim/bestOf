"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, CalendarIcon, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string | null
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/public/blog/${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Article non trouvé")
          }
          throw new Error("Erreur lors du chargement de l'article")
        }
        
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setError(error instanceof Error ? error.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [params.slug])
  
  // Function to render markdown content
  const renderContent = (content: string) => {
    // For now, we'll just split by newlines and render paragraphs
    // In a real app, you'd want to use a markdown parser like remark
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>
      } else if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>
      } else if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-5 mb-2">{paragraph.substring(4)}</h3>
      } else if (paragraph.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-1">{paragraph.substring(2)}</li>
      } else if (paragraph.trim() === '') {
        return <div key={index} className="h-4"></div>
      } else {
        return <p key={index} className="mb-4">{paragraph}</p>
      }
    })
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Oops! {error}</h1>
        <p className="mb-8">Nous n'avons pas pu charger l'article demandé.</p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au blog
          </Link>
        </Button>
      </div>
    )
  }
  
  if (!post) {
    return null
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au blog
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center text-muted-foreground mb-8 text-sm gap-4">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{post.author.name || "Admin"}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{Math.ceil(post.content.length / 1000)} min de lecture</span>
            </div>
          </div>
          
          {post.coverImage && (
            <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.png'
                }}
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>
        </div>
        
        <div className="border-t pt-8 mt-12">
          <h3 className="text-xl font-bold mb-4">Continuez la lecture</h3>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voir tous les articles
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
