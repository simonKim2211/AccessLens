"use client"

import { Leaf, ExternalLink } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Footer() {
  const { t } = useLanguage()

  const resources = [
    {
      title: "AODA Standards",
      url: "https://www.ontario.ca/page/about-accessibility-laws",
      description: "Official Ontario accessibility legislation",
    },
    {
      title: "WCAG Guidelines",
      url: "https://www.w3.org/WAI/WCAG21/quickref/",
      description: "Web Content Accessibility Guidelines",
    },
    {
      title: "Small Business Guide",
      url: "https://www.ontario.ca/page/how-make-customer-service-accessible",
      description: "Making customer service accessible",
    },
    {
      title: "Compliance Checklist",
      url: "https://www.ontario.ca/page/accessibility-rules-businesses",
      description: "Business accessibility requirements",
    },
  ]

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-red-600" />
              <span className="text-lg font-bold">AODA Compliance Checker</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Helping Canadian small businesses meet accessibility requirements with automated testing and AI-powered
              insights in plain language.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>🇨🇦 Made in Canada</span>
              <span>•</span>
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-xs">{resource.description}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 AODA Compliance Checker. Built to help Canadian businesses meet accessibility standards.</p>
          <p className="mt-2">
            This tool is designed to assist with AODA compliance but does not replace professional accessibility audits.
          </p>
        </div>
      </div>
    </footer>
  )
}
