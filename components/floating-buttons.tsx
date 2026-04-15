"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isChatOpen) {
      document.body.classList.add('chat-blur-active')
    } else {
      document.body.classList.remove('chat-blur-active')
    }
  }, [isChatOpen])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center cursor-pointer group hover:shadow-xl hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300"
            aria-label="Back to top"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.3 }}
            />
            <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-1 transition-transform" />
            
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Back to top
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <AIChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  )
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatWidget({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }: { isOpen?: boolean, setIsOpen?: (open: boolean) => void }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalSetIsOpen || setInternalIsOpen
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm MIKU, your AI assistant at WPCodingPress. How can I help you today? Ask me anything about our services, pricing, or how to get started!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        buttonRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const quickReplies = [
    "What services do you offer?",
    "How much does it cost?",
    "How do I get started?",
    "Show me your portfolio",
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm here to help! Feel free to ask any questions about our services.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again or contact us directly at support@wpcodingpress.com",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (text: string) => {
    setInput(text)
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[93px] left-4 sm:left-[74px] md:left-[74px] lg:left-[74px] -ml-[30px] sm:ml-0 md:ml-0 lg:ml-0 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center cursor-pointer group hover:shadow-xl hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300"
        aria-label="Open AI Chat"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-white/20"
          animate={isOpen ? { scale: 1.2, opacity: 0 } : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: isOpen ? 0 : Infinity }}
        />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <MessageCircle className="w-5 h-5" />
              <motion.span
                className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-[117px] left-4 sm:left-[56px] md:left-[56px] lg:left-[56px] -ml-2 sm:ml-0 md:ml-0 lg:ml-0 z-50 w-[350px] sm:w-[380px] max-w-[calc(100vw-32px)] h-[500px] sm:h-[550px] max-h-[calc(100vh-200px)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">MIKU</h3>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online now
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-violet-600 text-white rounded-br-md"
                        : "bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-100">
                    <div className="flex gap-1">
                      <motion.span
                        className="w-2 h-2 bg-purple-600 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-violet-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {!isTyping && messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-slate-500 mb-2">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 placeholder-slate-400"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 hover:shadow-lg hover:shadow-purple-500/30 px-4 text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
