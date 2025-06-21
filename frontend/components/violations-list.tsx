"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, Clock, Code, Volume2, Building } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface Violation {
  id: number
  title: string
  severity: "critical" | "serious" | "moderate" | "minor"
  description: string
  explanation: string
  explanationFr: string
  wcagCriteria: string
  businessImpact: string
  timeToFix: string
  codeExample: {
    before: string
    after: string
  }
  screenReaderImpact: string
}

interface ViolationsListProps {
  violations: Violation[]
}

export function ViolationsList({ violations }: ViolationsListProps) {
  const [openItems, setOpenItems] = useState<number[]>([])
  const { language, t } = useLanguage()

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-950/20"
      case "serious":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
      case "moderate":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
      case "minor":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-950/20"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "serious":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "moderate":
        return <Info className="h-5 w-5 text-yellow-600" />
      case "minor":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "serious":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Serious</Badge>
      case "moderate":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Moderate</Badge>
      case "minor":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Minor</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {violations.map((violation) => (
        <Collapsible
          key={violation.id}
          open={openItems.includes(violation.id)}
          onOpenChange={() => toggleItem(violation.id)}
        >
          <Card className={`border-l-4 ${getSeverityColor(violation.severity)}`}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(violation.severity)}
                    <div>
                      <CardTitle className="text-lg">{violation.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(violation.severity)}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {violation.timeToFix}
                    </div>
                    {openItems.includes(violation.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <Tabs defaultValue="explanation" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="explanation">
                      <Info className="mr-2 h-4 w-4" />
                      {t("violations.explanation")}
                    </TabsTrigger>
                    <TabsTrigger value="code">
                      <Code className="mr-2 h-4 w-4" />
                      {t("violations.code")}
                    </TabsTrigger>
                    <TabsTrigger value="screenreader">
                      <Volume2 className="mr-2 h-4 w-4" />
                      Screen Reader
                    </TabsTrigger>
                    <TabsTrigger value="business">
                      <Building className="mr-2 h-4 w-4" />
                      {t("violations.business")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="explanation" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">English Explanation</h4>
                        <p className="text-muted-foreground">{violation.explanation}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Explication en Français</h4>
                        <p className="text-muted-foreground">{violation.explanationFr}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>WCAG Criteria:</strong> {violation.wcagCriteria}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-red-600">❌ Before (Problematic)</h4>
                        <pre className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-sm overflow-x-auto">
                          <code>{violation.codeExample.before}</code>
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-green-600">✅ After (Fixed)</h4>
                        <pre className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg text-sm overflow-x-auto">
                          <code>{violation.codeExample.after}</code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="screenreader" className="mt-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Volume2 className="mr-2 h-4 w-4" />
                        How Screen Readers Announce This
                      </h4>
                      <p className="text-muted-foreground">{violation.screenReaderImpact}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="business" className="mt-4">
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Business Impact
                      </h4>
                      <p className="text-muted-foreground mb-3">{violation.businessImpact}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Estimated fix time: {violation.timeToFix}
                        </span>
                        <span className="font-medium">
                          Priority: {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
}
