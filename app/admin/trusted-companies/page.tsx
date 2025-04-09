"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PlusCircle, Pencil, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

type TrustedCompany = {
  id: string
  name: string
  logoUrl: string
  createdAt: string
  updatedAt: string
}

export default function TrustedCompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<TrustedCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingCompany, setIsAddingCompany] = useState(false)
  const [editingCompany, setEditingCompany] = useState<string | null>(null)
  
  const [newCompany, setNewCompany] = useState({
    name: "",
    logoUrl: ""
  })
  
  const [editForm, setEditForm] = useState({
    name: "",
    logoUrl: ""
  })

  // Fetch companies
  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/trusted-companies')
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setCompanies(data)
      } else {
        console.error('API did not return an array:', data)
        setCompanies([])
        if (data.error) {
          toast.error(`Error: ${data.error}`)
        } else {
          toast.error('Failed to load trusted companies')
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Failed to load trusted companies')
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCompany.name || !newCompany.logoUrl) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      const response = await fetch('/api/trusted-companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompany),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add company')
      }
      
      const addedCompany = await response.json()
      setCompanies([...companies, addedCompany])
      setNewCompany({ name: "", logoUrl: "" })
      setIsAddingCompany(false)
      toast.success('Company added successfully')
    } catch (error) {
      console.error('Error adding company:', error)
      toast.error('Failed to add company')
    }
  }

  const startEditing = (company: TrustedCompany) => {
    setEditingCompany(company.id)
    setEditForm({
      name: company.name,
      logoUrl: company.logoUrl
    })
  }

  const cancelEditing = () => {
    setEditingCompany(null)
  }

  const handleUpdateCompany = async (id: string) => {
    if (!editForm.name || !editForm.logoUrl) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      const response = await fetch(`/api/trusted-companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update company')
      }
      
      const updatedCompany = await response.json()
      setCompanies(companies.map(company => 
        company.id === id ? updatedCompany : company
      ))
      setEditingCompany(null)
      toast.success('Company updated successfully')
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error('Failed to update company')
    }
  }

  const handleDeleteCompany = async (id: string) => {
    try {
      const response = await fetch(`/api/trusted-companies/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete company')
      }
      
      setCompanies(companies.filter(company => company.id !== id))
      toast.success('Company deleted successfully')
    } catch (error) {
      console.error('Error deleting company:', error)
      toast.error('Failed to delete company')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trusted Companies</h1>
        <Button onClick={() => setIsAddingCompany(true)} disabled={isAddingCompany}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {isAddingCompany && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Company</CardTitle>
            <CardDescription>Add a new trusted company to display on the website</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddCompany}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Company Name</label>
                <Input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Apple"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="logoUrl" className="text-sm font-medium">Logo URL</label>
                <Input
                  id="logoUrl"
                  value={newCompany.logoUrl}
                  onChange={(e) => setNewCompany({ ...newCompany, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              {newCompany.logoUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Logo Preview:</p>
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                    <Image 
                      src={newCompany.logoUrl} 
                      alt="Logo preview" 
                      fill 
                      className="object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.png'
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddingCompany(false)}>Cancel</Button>
              <Button type="submit">Add Company</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Trusted Companies</CardTitle>
          <CardDescription>
            These companies will be displayed in the trusted companies section on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading companies...</div>
          ) : companies.length === 0 ? (
            <div className="text-center py-4">No trusted companies added yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image 
                          src={company.logoUrl} 
                          alt={company.name} 
                          fill 
                          className="object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png'
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingCompany === company.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        company.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCompany === company.id ? (
                        <div className="flex space-x-2">
                          <Input
                            value={editForm.logoUrl}
                            onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                            placeholder="Logo URL"
                            className="max-w-xs"
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleUpdateCompany(company.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => startEditing(company)}>
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
                                  This will permanently delete {company.name} from your trusted companies.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCompany(company.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
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
