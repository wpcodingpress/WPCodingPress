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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Messages</h1>
          <p className="text-slate-500">Manage inquiries from potential clients</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-violet-500 text-white" : "border-slate-200"}
          >
            All ({contacts.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-violet-500 text-white" : "border-slate-200"}
          >
            Unread ({contacts.filter(c => !c.isRead).length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-8 text-center text-slate-500">
              No messages found
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card 
              key={contact.id} 
              className={`bg-white border-slate-200 hover:shadow-lg transition-all cursor-pointer ${!contact.isRead ? "border-l-4 border-l-violet-500" : ""}`}
              onClick={() => {
                setSelectedContact(contact);
                if (!contact.isRead) markAsRead(contact.id);
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{contact.name}</h3>
                      {!contact.isRead && (
                        <Badge className="bg-violet-100 text-violet-700 border border-violet-200 text-xs">New</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
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
                    <p className="text-slate-600 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedContact(contact);
                      }}
                      className="text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteContact(contact.id);
                      }}
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-400">
                  {new Date(contact.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Message Details</DialogTitle>
            <DialogDescription className="text-slate-500">
              From {selectedContact?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Email</label>
                  <p className="text-slate-900">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Phone</label>
                  <p className="text-slate-900">{selectedContact.phone || "Not provided"}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-slate-500">Message</label>
                <p className="text-slate-900 mt-1 p-4 rounded-lg bg-slate-50 whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between">
                <span className="text-sm text-slate-500">
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
