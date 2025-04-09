"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

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
    email: string
  }
}

export default function BlogAdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch blog posts
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setPosts(data)
      } else {
        console.error('API did not return an array:', data)
        setPosts([])
        toast.error('Failed to load blog posts')
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      toast.error('Failed to load blog posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          published: !post.published,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update post')
      }
      
      const updatedPost = await response.json()
      setPosts(posts.map(p => p.id === post.id ? updatedPost : p))
      
      toast.success(`Post ${updatedPost.published ? 'published' : 'unpublished'} successfully`)
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post status')
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete post')
      }
      
      setPosts(posts.filter(post => post.id !== id))
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Button onClick={() => router.push('/admin/blog/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage your blog content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading blog posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              {searchQuery ? 'No posts match your search' : 'No blog posts found'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {post.coverImage && (
                          <div className="relative h-10 w-10 rounded overflow-hidden mr-3">
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
                        <div>
                          <div>{post.title}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {post.excerpt || post.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "outline"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {post.author.name || post.author.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {post.published && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            title="Preview"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleTogglePublish(post)}
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the blog post &ldquo;{post.title}&rdquo;.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
