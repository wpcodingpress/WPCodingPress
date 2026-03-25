"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2, Mail, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts/admin")
      if (res.ok) {
        const data = await res.json()
        setContacts(data)
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/contacts/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: true })
      })
      
      if (res.ok) {
        fetchContacts()
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, isRead: true })
        }
      }
    } catch (error) {
      console.error("Error marking contact as read:", error)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    try {
      const res = await fetch(`/api/contacts/admin?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchContacts()
        if (selectedContact?.id === id) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  const filteredContacts = filter === "unread"
    ? contacts.filter(c => !c.isRead)
    : contacts

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
          <p className="text-muted-foreground">Manage inquiries from potential clients</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({contacts.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread ({contacts.filter(c => !c.isRead).length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No messages found
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card 
              key={contact.id} 
              className={`hover:border-primary/50 transition-colors cursor-pointer ${!contact.isRead ? "border-l-4 border-l-primary" : ""}`}
              onClick={() => {
                setSelectedContact(contact)
                if (!contact.isRead) markAsRead(contact.id)
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{contact.name}</h3>
                      {!contact.isRead && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedContact(contact)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteContact(contact.id)
                      }}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {new Date(contact.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              From {selectedContact?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-white">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p className="text-white">{selectedContact.phone || "Not provided"}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Message</label>
                <p className="text-white mt-1 p-4 rounded-lg bg-white/5 whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Received: {new Date(selectedContact.createdAt).toLocaleString()}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteContact(selectedContact.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
