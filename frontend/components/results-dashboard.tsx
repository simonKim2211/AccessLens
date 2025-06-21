"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Printer,
  Download,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react"
import { ViolationsList } from "@/components/violations-list"
import { useLanguage } from "@/components/language-provider"
import Image from "next/image"

interface ResultsDashboardProps {
  results: any
  isLoading: boolean
}

export function ResultsDashboard({ results, isLoading }: ResultsDashboardProps) {
  const { t } = useLanguage()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!results) return null

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-green-600"
      case "fail":
        return "text-red-600"
      case "partial":
        return "text-yellow-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">{t("results.title")}</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  {getComplianceIcon(results.compliance.status)}
                  <span className="ml-2">{t("results.compliance")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getComplianceColor(results.compliance.status)}`}>
                  {results.compliance.status === "pass"
                    ? "COMPLIANT"
                    : results.compliance.status === "fail"
                      ? "NON-COMPLIANT"
                      : "PARTIAL"}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Based on AODA standards</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("results.score")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.compliance.score}%</div>
                <Progress value={results.compliance.score} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">Accessibility score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("results.wcag")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.compliance.wcagLevel}</div>
                <p className="text-sm text-muted-foreground mt-1">Current compliance level</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("results.issues")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{t("results.critical")}</span>
                    <Badge variant="destructive">{results.compliance.issues.critical}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{t("results.serious")}</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {results.compliance.issues.serious}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{t("results.moderate")}</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {results.compliance.issues.moderate}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{t("results.minor")}</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {results.compliance.issues.minor}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Screenshots Grid */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                {t("results.screenshots")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div>
                  <h4 className="mb-3 font-semibold">{t("results.original")}</h4>
                  <div className="aspect-video overflow-hidden rounded-lg border">
                    <Image
                      src={results.screenshots.original || "/placeholder.svg"}
                      alt="Original website view"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold flex items-center">
                    <EyeOff className="mr-2 h-4 w-4" />
                    {t("results.colorblind")}
                  </h4>
                  <div className="aspect-video overflow-hidden rounded-lg border">
                    <Image
                      src={results.screenshots.colorblind || "/placeholder.svg"}
                      alt="Color-blind simulation view"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover filter sepia"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Deuteranopia simulation (red-green color blindness)
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold">{t("results.lowvision")}</h4>
                  <div className="aspect-video overflow-hidden rounded-lg border">
                    <Image
                      src={results.screenshots.lowvision || "/placeholder.svg"}
                      alt="Low vision simulation view"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover filter blur-sm"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Low vision simulation (blurred vision)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Violations and Business Guidance */}
          <Tabs defaultValue="violations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="violations">{t("violations.title")}</TabsTrigger>
              <TabsTrigger value="priority">{t("violations.priority")}</TabsTrigger>
              <TabsTrigger value="guidance">Business Guidance</TabsTrigger>
            </TabsList>

            <TabsContent value="violations">
              <ViolationsList violations={results.violations} />
            </TabsContent>

            <TabsContent value="priority">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                    Critical Issues to Fix First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.violations
                      .filter((v: any) => v.severity === "critical")
                      .map((violation: any) => (
                        <div key={violation.id} className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-semibold">{violation.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{violation.explanation}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {violation.timeToFix}
                            </span>
                            <span>High business impact</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guidance">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>AODA Requirements for Your Business</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Level AA Compliance Required</p>
                        <p className="text-sm text-muted-foreground">
                          All new websites must meet WCAG 2.0 Level AA by January 1, 2021
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Existing Websites</p>
                        <p className="text-sm text-muted-foreground">Must be compliant by January 1, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Applies to Organizations</p>
                        <p className="text-sm text-muted-foreground">With 50 or more employees in Ontario</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps for Your Business</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <p className="font-medium">1. Fix Critical Issues First</p>
                      <p className="text-sm text-muted-foreground">
                        Address the {results.compliance.issues.critical} critical issues identified
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">2. Implement Accessibility Policy</p>
                      <p className="text-sm text-muted-foreground">Create and publish your accessibility policy</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">3. Train Your Team</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure staff understand accessibility requirements
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">4. Regular Testing</p>
                      <p className="text-sm text-muted-foreground">Schedule monthly accessibility audits</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

function LoadingSkeleton() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-64" />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-6 w-32 mb-3" />
                    <Skeleton className="aspect-video w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
