"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Globe, Info, Clock, DollarSign, AlertTriangle, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

interface UrlInputSectionProps {
  onAnalysisStart: () => void
  onAnalysisComplete: (results: any) => void
  isAnalyzing: boolean
}

export function UrlInputSection({ onAnalysisStart, onAnalysisComplete, isAnalyzing }: UrlInputSectionProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()
  const { t } = useLanguage()

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleAnalyze = async () => {
    setError("")

    if (!url.trim()) {
      setError("Please enter a website URL")
      return
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    onAnalysisStart()

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock results
      const mockResults = {
        url,
        compliance: {
          status: "partial",
          score: 72,
          wcagLevel: "AA (Partial)",
          issues: {
            critical: 3,
            serious: 7,
            moderate: 12,
            minor: 8,
          },
        },
        screenshots: {
          original: "/placeholder.svg?height=400&width=600",
          colorblind: "/placeholder.svg?height=400&width=600",
          lowvision: "/placeholder.svg?height=400&width=600",
        },
        violations: [
          {
            id: 1,
            title: "Missing Alt Text on Images",
            severity: "critical",
            description: "Images without alternative text cannot be understood by screen readers",
            explanation:
              "When images don't have alt text, people using screen readers can't understand what the image shows. This is like having a picture in a book with no caption.",
            explanationFr:
              "Lorsque les images n'ont pas de texte alternatif, les personnes utilisant des lecteurs d'écran ne peuvent pas comprendre ce que montre l'image.",
            wcagCriteria: "1.1.1 Non-text Content",
            businessImpact:
              "Customers using screen readers cannot access important visual information, potentially losing sales or engagement.",
            timeToFix: "2-4 hours",
            codeExample: {
              before: '<img src="product.jpg">',
              after: '<img src="product.jpg" alt="Red winter jacket with hood">',
            },
            screenReaderImpact: "Screen reader announces: 'Image' instead of describing the content",
          },
          {
            id: 2,
            title: "Low Color Contrast",
            severity: "serious",
            description: "Text doesn't have enough contrast against background colors",
            explanation:
              "Some text is too light against the background, making it hard to read for people with vision difficulties.",
            explanationFr:
              "Certains textes sont trop clairs sur l'arrière-plan, ce qui les rend difficiles à lire pour les personnes ayant des difficultés visuelles.",
            wcagCriteria: "1.4.3 Contrast (Minimum)",
            businessImpact:
              "Users may struggle to read important information like prices, contact details, or calls-to-action.",
            timeToFix: "1-2 hours",
            codeExample: {
              before: "color: #999999; background: #ffffff;",
              after: "color: #666666; background: #ffffff;",
            },
            screenReaderImpact: "No direct impact, but affects users with low vision who don't use screen readers",
          },
        ],
      }

      onAnalysisComplete(mockResults)

      toast({
        title: "Analysis Complete",
        description: "Your website accessibility analysis is ready.",
      })
    } catch (error) {
      setError("Analysis failed. Please try again.")
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your website. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exampleUrls = ["https://canada.ca", "https://ontario.ca", "https://yourstore.com"]

  return (
    <section id="url-input-section" className="py-16 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{t("url.title")}</h2>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder={t("url.placeholder")}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-lg h-12"
                    disabled={isAnalyzing}
                    aria-label="Website URL to analyze"
                  />
                  {error && (
                    <Alert className="mt-2" variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white h-12 px-8"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("url.analyzing")}
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      {t("url.button")}
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium">{t("url.examples")}</span>
                {exampleUrls.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setUrl(example)}
                    className="ml-2 text-red-600 hover:underline"
                    disabled={isAnalyzing}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Info className="mr-2 h-5 w-5 text-red-600" />
                  {t("url.tips.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-start">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  {t("url.tips.1")}
                </p>
                <p className="flex items-start">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  {t("url.tips.2")}
                </p>
                <p className="flex items-start">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  {t("url.tips.3")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">What We Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Image alt text and descriptions</p>
                <p>• Color contrast ratios</p>
                <p>• Keyboard navigation</p>
                <p>• Screen reader compatibility</p>
                <p>• Form accessibility</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Analysis Includes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Visual accessibility simulations</p>
                <p>• Plain language explanations</p>
                <p>• Code examples and fixes</p>
                <p>• Business impact assessment</p>
                <p>• Priority action items</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
