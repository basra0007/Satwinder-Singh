import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tradition-logo-1-1024x576-Df4QCohI4fY4jXq5NQvOFkJmagAg73.png"
              alt="Traditional Kitchen Logo"
              width={180}
              height={100}
              priority
            />
            {/* <h1 className="text-xl font-bold">Traditional Kitchen LTD</h1> */}
          </div>
          <Link href="/login">
            <Button variant="outline">Admin Login</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Welcome to Traditional Kitchen</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Serving delicious traditional meals with the finest ingredients and authentic recipes.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button size="lg">Admin Portal</Button>
              </Link>
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                    <line x1="6" x2="18" y1="17" y2="17" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Ingredients</h3>
                <p className="text-muted-foreground">
                  We source only the freshest and highest quality ingredients for our dishes.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 2H2v10h10V2Z" />
                    <path d="M12 12H2v10h10V12Z" />
                    <path d="M22 2h-10v20h10V2Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Traditional Recipes</h3>
                <p className="text-muted-foreground">
                  Our recipes have been passed down through generations, preserving authentic flavors.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Chefs</h3>
                <p className="text-muted-foreground">
                  Our team of experienced chefs are masters of traditional cooking techniques.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Traditional Kitchen LTD</h3>
              <p className="text-slate-300">Bringing authentic traditional flavors to your table since 1995.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-slate-300">123 Culinary Street</p>
              <p className="text-slate-300">Foodville, FK 12345</p>
              <p className="text-slate-300">info@traditionalkitchen.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Hours</h3>
              <p className="text-slate-300">Monday - Friday: 9am - 5pm</p>
              <p className="text-slate-300">Saturday: 10am - 4pm</p>
              <p className="text-slate-300">Sunday: Closed</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; {new Date().getFullYear()} Traditional Kitchen LTD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
