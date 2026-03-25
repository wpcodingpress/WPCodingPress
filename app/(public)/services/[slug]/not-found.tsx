import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ServiceNotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Service Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The service you're looking for doesn't exist or has been removed. 
            Check out our other services below.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Button>
            </Link>
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
