"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "header.title": "AODA Compliance Checker",
    "header.subtitle": "For Canadian Businesses",
    "header.darkMode": "Toggle dark mode",
    "header.language": "Français",

    // Hero
    "hero.title": "Ensure Your Website Meets AODA Standards",
    "hero.subtitle": "Help your Canadian business meet accessibility requirements with our AODA compliance checker",
    "hero.description": "Automated testing + AI-powered insights in plain language",
    "hero.cta": "Check Your Website's Accessibility",

    // URL Input
    "url.title": "Website Analysis",
    "url.placeholder": "Enter your website URL (e.g., https://yourwebsite.com)",
    "url.button": "Analyze Website",
    "url.analyzing": "Analyzing...",
    "url.examples": "Examples:",
    "url.tips.title": "Quick AODA Tips:",
    "url.tips.1": "AODA applies to all Ontario businesses with 50+ employees",
    "url.tips.2": "Level AA compliance is required by 2025",
    "url.tips.3": "Non-compliance can result in fines up to $100,000",

    // Results
    "results.title": "Accessibility Analysis Results",
    "results.compliance": "AODA Compliance Status",
    "results.score": "Overall Score",
    "results.wcag": "WCAG Level",
    "results.issues": "Issues Found",
    "results.critical": "Critical",
    "results.serious": "Serious",
    "results.moderate": "Moderate",
    "results.minor": "Minor",
    "results.screenshots": "Visual Accessibility Review",
    "results.original": "Original View",
    "results.colorblind": "Color-blind View",
    "results.lowvision": "Low Vision View",

    // Violations
    "violations.title": "Accessibility Issues",
    "violations.priority": "Priority Actions",
    "violations.explanation": "Plain Language Explanation",
    "violations.code": "Code Example",
    "violations.screenreader": "Screen Reader Impact",
    "violations.business": "Business Impact",
    "violations.timetofix": "Est. Time to Fix",
    "violations.wcagref": "WCAG Reference",

    // Footer
    "footer.resources": "AODA Resources",
    "footer.about": "About AODA",
    "footer.contact": "Contact Support",
    "footer.privacy": "Privacy Policy",
  },
  fr: {
    // Header
    "header.title": "Vérificateur de Conformité LAPHO",
    "header.subtitle": "Pour les Entreprises Canadiennes",
    "header.darkMode": "Basculer le mode sombre",
    "header.language": "English",

    // Hero
    "hero.title": "Assurez-vous que Votre Site Web Respecte les Normes LAPHO",
    "hero.subtitle":
      "Aidez votre entreprise canadienne à respecter les exigences d'accessibilité avec notre vérificateur de conformité LAPHO",
    "hero.description": "Tests automatisés + informations alimentées par l'IA en langage simple",
    "hero.cta": "Vérifiez l'Accessibilité de Votre Site Web",

    // URL Input
    "url.title": "Analyse du Site Web",
    "url.placeholder": "Entrez l'URL de votre site web (ex: https://votresite.com)",
    "url.button": "Analyser le Site Web",
    "url.analyzing": "Analyse en cours...",
    "url.examples": "Exemples:",
    "url.tips.title": "Conseils LAPHO Rapides:",
    "url.tips.1": "LAPHO s'applique à toutes les entreprises ontariennes avec 50+ employés",
    "url.tips.2": "La conformité de niveau AA est requise d'ici 2025",
    "url.tips.3": "La non-conformité peut entraîner des amendes jusqu'à 100 000 $",

    // Results
    "results.title": "Résultats de l'Analyse d'Accessibilité",
    "results.compliance": "Statut de Conformité LAPHO",
    "results.score": "Score Global",
    "results.wcag": "Niveau WCAG",
    "results.issues": "Problèmes Trouvés",
    "results.critical": "Critique",
    "results.serious": "Sérieux",
    "results.moderate": "Modéré",
    "results.minor": "Mineur",
    "results.screenshots": "Révision Visuelle d'Accessibilité",
    "results.original": "Vue Originale",
    "results.colorblind": "Vue Daltonien",
    "results.lowvision": "Vue Basse Vision",

    // Violations
    "violations.title": "Problèmes d'Accessibilité",
    "violations.priority": "Actions Prioritaires",
    "violations.explanation": "Explication en Langage Simple",
    "violations.code": "Exemple de Code",
    "violations.screenreader": "Impact du Lecteur d'Écran",
    "violations.business": "Impact Commercial",
    "violations.timetofix": "Temps Est. pour Corriger",
    "violations.wcagref": "Référence WCAG",

    // Footer
    "footer.resources": "Ressources LAPHO",
    "footer.about": "À Propos de LAPHO",
    "footer.contact": "Support Contact",
    "footer.privacy": "Politique de Confidentialité",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
