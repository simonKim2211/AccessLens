"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Moon, Sun, Globe, Loader2, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"

export default function AODAChecker() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const { theme, setTheme } = useTheme()

  const handleAnalyze = async () => {
    setError("")

    if (!url.trim()) {
      setError("Please enter a website URL")
      return
    }

    try {
      new URL(url)
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      alert("Analysis complete! (This is a demo)")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Navigation Link for Screen Readers */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-primary" aria-hidden="true" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-contrast-safe">AODA Compliance Checker</h1>
              <span className="text-sm text-muted-foreground">For Canadian Businesses</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle dark mode"
            className="touch-target"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background py-16 lg:py-24">
          <div className="container relative">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-contrast-safe sm:text-5xl lg:text-6xl">
                Ensure Your Website Meets AODA Standards
              </h1>
              <p className="mb-4 text-xl text-muted-foreground lg:text-2xl">
                Help your Canadian business meet accessibility requirements
              </p>
              <p className="mb-8 text-lg text-muted-foreground">
                Automated testing + AI-powered insights in plain language
              </p>
            </div>
          </div>
        </section>

        {/* URL Input Section */}
        <section className="py-16 bg-muted/30" aria-labelledby="analysis-heading">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-8">
                <h2 id="analysis-heading" className="text-3xl font-bold mb-4 text-contrast-safe">
                  Website Analysis
                </h2>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                      <label htmlFor="url-input" className="sr-only">
                        Website URL to analyze
                      </label>
                      <Input
                        id="url-input"
                        type="url"
                        placeholder="Enter your website URL (e.g., https://yourwebsite.com)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="text-lg h-12"
                        disabled={isAnalyzing}
                        aria-describedby={error ? "url-error" : undefined}
                        aria-invalid={!!error}
                      />
                      {error && (
                        <div id="url-error" className="mt-2 flex items-center text-sm text-destructive" role="alert">
                          <AlertTriangle className="h-4 w-4 mr-2" aria-hidden="true" />
                          {error}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !url.trim()}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 touch-target"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                          Analyze Website
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-contrast-safe">AODA Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• Level AA compliance required by 2025</li>
                      <li>• Applies to businesses with 50+ employees</li>
                      <li>• Fines up to $100,000 for non-compliance</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-contrast-safe">What We Check</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• Image alt text and descriptions</li>
                      <li>• Color contrast ratios</li>
                      <li>• Keyboard navigation</li>
                      <li>• Screen reader compatibility</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-contrast-safe">Analysis Includes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• Visual accessibility simulations</li>
                      <li>• Plain language explanations</li>
                      <li>• Code examples and fixes</li>
                      <li>• Business impact assessment</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t" role="contentinfo">
        <div className="container py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-lg font-bold text-contrast-safe">AODA Compliance Checker</span>
            </div>
            <p className="text-muted-foreground mb-4">Helping Canadian businesses meet accessibility requirements</p>
            <p className="text-sm text-muted-foreground">🇨🇦 Made in Canada • WCAG 2.1 AA Compliant</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
