"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, Clock, Tag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type BlogPost = {
  id: string
  title: string
  slug: string
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/public/blog')
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])
  
  // Get all unique tags from posts
  const allTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags)
    )
  )
  
  // Filter posts by active tag
  const filteredPosts = activeTag 
    ? posts.filter(post => post.tags.includes(activeTag))
    : posts
  
  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Notre Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez nos derniers articles, conseils et actualités
        </p>
      </motion.div>
      
      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant={activeTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTag(null)}
            className="rounded-full"
          >
            Tous
          </Button>
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTag(tag)}
              className="rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {activeTag 
              ? `Aucun article trouvé avec le tag "${activeTag}"`
              : "Aucun article disponible pour le moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 bg-muted">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png'
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <CardHeader>
                  <div className="flex gap-2 mb-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setActiveTag(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="block">
                    <CardTitle className="hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </Link>
                  <CardDescription className="flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt || 'Cliquez pour lire l\'article complet'}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button asChild variant="ghost" className="p-0 h-auto font-medium">
                    <Link href={`/blog/${post.slug}`}>
                      Lire la suite
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
