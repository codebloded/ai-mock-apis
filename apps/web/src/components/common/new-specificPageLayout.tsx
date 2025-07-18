import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface QuickStat {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

interface HeaderAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "secondary" | "outline";
}

interface Tab {
  value: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface SpecificPageLayoutProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  role?: string;
  quickStats: QuickStat[];
  tabs: Tab[];
  actions?: HeaderAction[];
  defaultTab?: string;
}

export default function NewSpecificPageLayout({
  title,
  subtitle,
  avatarUrl,
  role,
  quickStats,
  tabs,
  actions = [],
  defaultTab = tabs[0]?.value,
}: SpecificPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="relative bg-primary/5 pb-20 pt-12">
        <div className="container mx-auto px-4">
          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            {avatarUrl && (
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {role && (
                  <Badge
                    className="absolute -bottom-2 right-0 px-4"
                    variant="secondary"
                  >
                    {role}
                  </Badge>
                )}
              </div>
            )}

            {/* Main Header Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {title}
              </h1>
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  onClick={action.onClick}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => (
            <Card key={i} className="bg-background/60 backdrop-blur-sm">
              <CardContent className="flex items-center p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={defaultTab} className="space-y-8">
          <TabsList className="bg-background/60 backdrop-blur-sm w-full justify-start border-b rounded-none p-0 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
