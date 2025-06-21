"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Shield, Users, FileCheck } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function HeroSection() {
  const { t } = useLanguage()

  const scrollToAnalysis = () => {
    const element = document.getElementById("url-input-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background py-16 lg:py-24">
      {/* Canadian flag pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-red-600"></div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-red-600"></div>
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
              <Shield className="h-12 w-12 text-red-600" aria-hidden="true" />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>

          <p className="mb-4 text-xl text-muted-foreground lg:text-2xl">{t("hero.subtitle")}</p>

          <p className="mb-8 text-lg text-muted-foreground">{t("hero.description")}</p>

          <Button
            size="lg"
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            onClick={scrollToAnalysis}
          >
            {t("hero.cta")}
            <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <Users className="mb-3 h-8 w-8 text-red-600" aria-hidden="true" />
              <h3 className="font-semibold">Small Business Focused</h3>
              <p className="text-sm text-muted-foreground">Designed for Canadian SMEs</p>
            </div>
            <div className="flex flex-col items-center">
              <FileCheck className="mb-3 h-8 w-8 text-red-600" aria-hidden="true" />
              <h3 className="font-semibold">AODA Compliant</h3>
              <p className="text-sm text-muted-foreground">Meets Ontario standards</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="mb-3 h-8 w-8 text-red-600" aria-hidden="true" />
              <h3 className="font-semibold">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Plain language insights</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
