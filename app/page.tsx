"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Sparkles, Bath, Scissors, Leaf, Gem, X, Check, Calculator, Phone, MapPin, Calendar, User, PawPrint, Send, Menu } from "lucide-react"
import Image from "next/image"

// Types
interface FormData {
  ownerName: string
  phone: string
  petType: string
  service: string
  date: string
  address: string
}

interface LeadFormData {
  name: string
  phone: string
  petType: string
  message: string
}

interface Service {
  icon: React.ReactNode
  title: string
  description: string
  price: string
}

interface Package {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

// WhatsApp numbers
const WHATSAPP_NUMBERS = ["+918800971337", "+918796493504"]

// Google Sheets Web App URL
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwSPOR3wDQ4g1CpfLlnQxD9DpGjL8WHtMqPFxhvWzA/exec"

export default function RoyalPawsSpa() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    phone: "",
    petType: "Dog",
    service: "",
    date: "",
    address: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [luxuryScore, setLuxuryScore] = useState<number | null>(null)
  const [calculatorData, setCalculatorData] = useState({
    petType: "Dog",
    size: "Medium",
    condition: "Medium",
  })
  const [leadForm, setLeadForm] = useState<LeadFormData>({
    name: "",
    phone: "",
    petType: "Dog",
    message: "",
  })
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false)
  const [showLeadSuccess, setShowLeadSuccess] = useState(false)

  const services: Service[] = [
    {
      icon: <Bath className="w-8 h-8" />,
      title: "Gold Bath Spa",
      description: "Luxurious gold-infused bath treatment with premium organic shampoos",
      price: "₹799",
    },
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Royal Hair Styling",
      description: "Expert grooming and styling by certified pet stylists",
      price: "₹599",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Organic Paw Treatment",
      description: "Natural paw care with organic balms and moisturizers",
      price: "₹499",
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: "VIP Full Grooming",
      description: "Complete luxury experience with all premium services included",
      price: "₹1499",
    },
  ]

  const packages: Package[] = [
    {
      name: "Silver Care",
      price: "₹999",
      features: ["Basic Bath & Dry", "Nail Trimming", "Ear Cleaning", "Light Brushing"],
    },
    {
      name: "Gold Care",
      price: "₹1999",
      features: ["Premium Bath & Dry", "Full Grooming", "Nail & Paw Care", "Teeth Cleaning", "Aromatherapy"],
      popular: true,
    },
    {
      name: "Diamond Care",
      price: "₹2999",
      features: ["Luxury Spa Treatment", "Full Grooming & Styling", "Complete Paw Care", "Teeth & Ear Care", "Aromatherapy", "Pet Photography"],
    },
  ]

  const openBookingWithService = (service: string) => {
    setFormData((prev) => ({ ...prev, service }))
    setIsBookingOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateWhatsAppMessage = () => {
    return encodeURIComponent(`🐾 *New Royal Paws Booking*

*Name:* ${formData.ownerName}
*Phone:* ${formData.phone}
*Pet:* ${formData.petType}
*Service:* ${formData.service}
*Date:* ${formData.date}
*Address:* ${formData.address}

_Sent from TOES N TAILS Website_`)
  }

  const submitToGoogleSheets = async () => {
    try {
      const params = new URLSearchParams({
        timestamp: new Date().toISOString(),
        name: formData.ownerName,
        phone: formData.phone,
        petType: formData.petType,
        service: formData.service,
        date: formData.date,
        address: formData.address,
      })

      await fetch(`${GOOGLE_SHEETS_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      })
    } catch (error) {
      console.log("[v0] Google Sheets submission attempted:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Submit to Google Sheets
    await submitToGoogleSheets()

    // Open WhatsApp for both numbers
    const message = generateWhatsAppMessage()
    WHATSAPP_NUMBERS.forEach((number, index) => {
      setTimeout(() => {
        window.open(`https://wa.me/${number}?text=${message}`, "_blank")
      }, index * 500)
    })

    setIsSubmitting(false)
    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
      setIsBookingOpen(false)
      setFormData({
        ownerName: "",
        phone: "",
        petType: "Dog",
        service: "",
        date: "",
        address: "",
      })
    }, 3000)
  }

  const calculateLuxuryScore = () => {
    let score = 50

    if (calculatorData.petType === "Dog") score += 10
    if (calculatorData.petType === "Cat") score += 8
    if (calculatorData.petType === "Other") score += 5

    if (calculatorData.size === "Small") score += 10
    if (calculatorData.size === "Medium") score += 15
    if (calculatorData.size === "Large") score += 20

    if (calculatorData.condition === "Basic") score += 5
    if (calculatorData.condition === "Medium") score += 10
    if (calculatorData.condition === "Premium") score += 15

    setLuxuryScore(Math.min(score, 100))
  }

  const getRecommendedPackage = () => {
    if (!luxuryScore) return null
    if (luxuryScore < 60) return "Silver Care"
    if (luxuryScore < 80) return "Gold Care"
    return "Diamond Care"
  }

  const handleLeadInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLeadForm((prev) => ({ ...prev, [name]: value }))
  }

  const generateLeadWhatsAppMessage = () => {
    return encodeURIComponent(`Hi! I'm interested in TOES N TAILS services.

*Name:* ${leadForm.name}
*Phone:* ${leadForm.phone}
*Pet Type:* ${leadForm.petType}
*Message:* ${leadForm.message}

_Inquiry from TOES N TAILS Website_`)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLeadSubmitting(true)

    // Submit to Google Sheets
    try {
      const params = new URLSearchParams({
        timestamp: new Date().toISOString(),
        type: "Lead Inquiry",
        name: leadForm.name,
        phone: leadForm.phone,
        petType: leadForm.petType,
        message: leadForm.message,
      })

      await fetch(`${GOOGLE_SHEETS_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      })
    } catch (error) {
      console.log("[v0] Google Sheets lead submission attempted:", error)
    }

    // Open WhatsApp
    const message = generateLeadWhatsAppMessage()
    window.open(`https://wa.me/${WHATSAPP_NUMBERS[0]}?text=${message}`, "_blank")

    setIsLeadSubmitting(false)
    setShowLeadSuccess(true)

    setTimeout(() => {
      setShowLeadSuccess(false)
      setLeadForm({
        name: "",
        phone: "",
        petType: "Dog",
        message: "",
      })
    }, 3000)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Crown className="w-8 h-8 text-primary" />
              <span className="font-serif text-2xl font-bold gold-text">TOES N TAILS</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("services")} className="text-foreground/80 hover:text-primary transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection("packages")} className="text-foreground/80 hover:text-primary transition-colors">
                Packages
              </button>
              <button onClick={() => scrollToSection("calculator")} className="text-foreground/80 hover:text-primary transition-colors">
                Luxury Score
              </button>
              <button onClick={() => scrollToSection("inquiry")} className="text-foreground/80 hover:text-primary transition-colors">
                Inquire
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookingOpen(true)}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium"
              >
                Book Now
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-primary/20"
            >
              <div className="px-4 py-4 space-y-4">
                <button onClick={() => scrollToSection("services")} className="block w-full text-left text-foreground/80 hover:text-primary transition-colors py-2">
                  Services
                </button>
                <button onClick={() => scrollToSection("packages")} className="block w-full text-left text-foreground/80 hover:text-primary transition-colors py-2">
                  Packages
                </button>
                <button onClick={() => scrollToSection("calculator")} className="block w-full text-left text-foreground/80 hover:text-primary transition-colors py-2">
                  Luxury Score
                </button>
                <button onClick={() => scrollToSection("inquiry")} className="block w-full text-left text-foreground/80 hover:text-primary transition-colors py-2">
                  Inquire
                </button>
                <button
                  onClick={() => {
                    setIsBookingOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Premium Pet Care</span>
              </motion.div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                <span className="gold-text">Royal Care</span>
                <br />
                <span className="text-foreground">for Your Pet</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Luxury grooming experience for your beloved pets. Where every paw gets the royal treatment it deserves.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 animate-glow"
                >
                  <Crown className="w-5 h-5" />
                  Book VIP Grooming
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection("services")}
                  className="border border-primary/50 text-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  Explore Services
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <Image
                    src="/images/royal-pet.png"
                    alt="Royal Pet"
                    width={500}
                    height={500}
                    className="rounded-3xl shadow-2xl"
                    priority
                  />
                </motion.div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              <span className="gold-text">Premium</span> Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the finest grooming services tailored for royalty
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => openBookingWithService(service.title)}
                className="glass rounded-2xl p-6 cursor-pointer group hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">{service.price}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">Click to book →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 relative bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              <span className="gold-text">Luxury</span> Packages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect care package for your precious companion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative glass rounded-3xl p-8 ${pkg.popular ? "border-2 border-primary" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold gold-text">{pkg.price}</span>
                    <span className="text-muted-foreground">/session</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-foreground/80">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openBookingWithService(pkg.name)}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  Select Plan
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Score Calculator */}
      <section id="calculator" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              <span className="gold-text">Pet Luxury</span> Score
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect grooming package for your pet
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8"
          >
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Pet Type</label>
                <select
                  value={calculatorData.petType}
                  onChange={(e) => setCalculatorData({ ...calculatorData, petType: e.target.value })}
                  className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Size</label>
                <select
                  value={calculatorData.size}
                  onChange={(e) => setCalculatorData({ ...calculatorData, size: e.target.value })}
                  className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Care Needed</label>
                <select
                  value={calculatorData.condition}
                  onChange={(e) => setCalculatorData({ ...calculatorData, condition: e.target.value })}
                  className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Basic">Basic</option>
                  <option value="Medium">Medium</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={calculateLuxuryScore}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Luxury Score
            </motion.button>

            <AnimatePresence>
              {luxuryScore !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={`${luxuryScore * 3.51} 351`}
                        initial={{ strokeDasharray: "0 351" }}
                        animate={{ strokeDasharray: `${luxuryScore * 3.51} 351` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold gold-text">{luxuryScore}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">Your Luxury Score: {luxuryScore}/100</h3>
                  <p className="text-muted-foreground mb-4">
                    We recommend the <span className="text-primary font-semibold">{getRecommendedPackage()}</span> package for your pet
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openBookingWithService(getRecommendedPackage() || "Gold Care")}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold"
                  >
                    Book This Care Now
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lead Inquiry Form Section */}
      <section id="inquiry" className="py-24 relative bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              <span className="gold-text">Get in</span> Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions? Send us a message and we&apos;ll get back to you on WhatsApp
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12"
          >
            {showLeadSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">We&apos;ll respond to your inquiry on WhatsApp shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={leadForm.name}
                      onChange={handleLeadInputChange}
                      required
                      className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={leadForm.phone}
                      onChange={handleLeadInputChange}
                      required
                      className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <PawPrint className="w-4 h-4 inline mr-2" />
                    Pet Type
                  </label>
                  <select
                    name="petType"
                    value={leadForm.petType}
                    onChange={handleLeadInputChange}
                    className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Send className="w-4 h-4 inline mr-2" />
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={leadForm.message}
                    onChange={handleLeadInputChange}
                    required
                    rows={4}
                    className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your pet and what services you're interested in..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLeadSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isLeadSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Send via WhatsApp
                    </>
                  )}
                </motion.button>

                <p className="text-center text-muted-foreground text-sm">
                  Your message will be sent directly to our WhatsApp for quick response
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              <span className="gold-text">Contact</span> Us
            </h2>
            <p className="text-muted-foreground mb-8">Ready to pamper your pet? Get in touch with us today!</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBERS[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +91 88009 71337
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBERS[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +91 87964 93504
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <span className="font-serif text-lg font-bold gold-text">TOES N TAILS</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2024 TOES N TAILS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Book Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 glass md:hidden z-40"
      >
        <button
          onClick={() => setIsBookingOpen(true)}
          className="w-full bg-primary text-primary-foreground py-4 rounded-full font-semibold flex items-center justify-center gap-2"
        >
          <Crown className="w-5 h-5" />
          Book VIP Grooming
        </button>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsBookingOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {showSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Booking Submitted!</h3>
                  <p className="text-muted-foreground">WhatsApp windows have been opened. Please send the messages to complete your booking.</p>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-serif text-2xl font-bold text-foreground">Book Your Appointment</h3>
                    <p className="text-muted-foreground">Fill in the details below</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <PawPrint className="w-4 h-4 inline mr-2" />
                        Pet Type
                      </label>
                      <select
                        name="petType"
                        value={formData.petType}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Service / Package
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select a service</option>
                        <option value="Gold Bath Spa">Gold Bath Spa - ₹799</option>
                        <option value="Royal Hair Styling">Royal Hair Styling - ₹599</option>
                        <option value="Organic Paw Treatment">Organic Paw Treatment - ₹499</option>
                        <option value="VIP Full Grooming">VIP Full Grooming - ₹1499</option>
                        <option value="Silver Care">Silver Care Package - ₹999</option>
                        <option value="Gold Care">Gold Care Package - ₹1999</option>
                        <option value="Diamond Care">Diamond Care Package - ₹2999</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Your address"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Booking
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
