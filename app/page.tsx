import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Packages } from "@/components/packages"
import { Gallery } from "@/components/gallery"
import { Themes } from "@/components/themes"
import { Booking } from "@/components/booking"
import { Addons } from "@/components/addons"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Packages />
      <Gallery />
      <Themes />
      <Addons />
      <Booking />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
