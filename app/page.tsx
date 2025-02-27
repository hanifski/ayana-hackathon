import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSelector from "@/components/LanguageSelector";

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-between bg-background">
      {/* Header */}
      <header className="p-12 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">Ayana Wedding</h1>
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-12">
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-2">
            Magical Moments in an enchanting atmosphere
          </p>
          <h2 className="text-4xl font-bold text-foreground">Weddings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-lg shadow-lg p-8">
          {/* Left side - Image */}
          <div className="relative h-[300px] w-full">
            <Image
              src="/assets/wedding-illustration.jpg"
              alt="Wedding scene with bride"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          {/* Right side - Login Form */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">
                Ayana Wedding Videos Collections.
              </h3>
            </div>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Enter your email
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              <Button className="w-full" size="lg" variant="default">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-4 mb-4 md:mb-0">
              <span>BALI</span>
              <span>KOMODO</span>
              <span>JAKARTA</span>
              <span>CRUISE</span>
            </div>
            <Image
              src="/ayana-logo.png"
              alt="AYANA Logo"
              width={120}
              height={40}
              className="mb-4 md:mb-0"
            />
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Careers</span>
              <span>Pressroom</span>
              <span>© AYANA</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
