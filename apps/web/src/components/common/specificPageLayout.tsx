import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";

// Common field interface for all sections
interface Field {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

interface Tab {
  value: string;
  label: string;
  icon: LucideIcon;
  sections: Array<{
    title: string;
    icon?: LucideIcon;
    columnSpan?: number;
    type: "fields" | "list" | "custom";
    height?: number;
    fields?: Field[];
    content?: ReactNode;
  }>;
}

interface QuickStat extends Field {
  icon: LucideIcon;
}

interface HeaderAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "secondary" | "outline";
}

interface HeaderField extends Field {
  type: "badge" | "text";
  variant?: string;
}

// Base interface for both types
interface BaseDetails {
  id: string;
  name: string;
  headerFields?: HeaderField[];
  metadata?: Record<string, string | number>;
}

// User-specific details
interface UserDetails extends BaseDetails {
  type: "user";
  avatarUrl?: string;
  role?: string;
  email?: string;
}

// Entity-specific details
interface EntityDetails extends BaseDetails {
  type: "entity";
  code: string;
  category: string;
}

interface SpecificPageLayoutProps {
  details: UserDetails | EntityDetails;
  quickStats: QuickStat[];
  tabs: Tab[];
  actions?: HeaderAction[];
  defaultTab?: string;
}

export default function SpecificPageLayout({
  details,
  quickStats,
  tabs,
  actions = [],
  defaultTab = tabs[0]?.value,
}: SpecificPageLayoutProps) {
  const isUser = details.type === "user";

  const renderField = (field: Field) => (
    <div className="flex items-center gap-2">
      {field.icon && <field.icon className="w-4 h-4 text-muted-foreground" />}
      <span>{field.value}</span>
    </div>
  );

  const renderSection = (section: Tab["sections"][0]) => {
    const columnClass = section.columnSpan
      ? `md:col-span-${section.columnSpan} lg:col-span-${section.columnSpan}`
      : "";

    return (
      <Card className={columnClass}>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {section.icon && <section.icon className="w-5 h-5" />}
            {section.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {section.type === "fields" && section.fields && (
            <div className="space-y-6">
              {section.fields.map((field, i) => (
                <div key={i}>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    {field.icon && <field.icon className="w-4 h-4" />}
                    {field.label}
                  </p>
                  <p className="font-medium">{field.value}</p>
                  {i < section.fields!.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          )}
          {section.type === "list" && (
            <ScrollArea className={`h-[${section.height || 300}px] pr-4`}>
              {section.content || (
                <p className="text-muted-foreground text-center py-8">
                  No items to display
                </p>
              )}
            </ScrollArea>
          )}
          {section.type === "custom" && section.content}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="relative bg-primary/5 pb-20 pt-12">
        <div className="container mx-auto px-4">
          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            {/* Avatar for User Type */}
            {isUser && (
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={(details as UserDetails).avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {details.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  className="absolute -bottom-2 right-0 px-4"
                  variant="secondary"
                >
                  {(details as UserDetails).role || "User"}
                </Badge>
              </div>
            )}

            {/* Main Header Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {details.headerFields?.map((field, index) =>
                  field.type === "badge" ? (
                    <Badge key={index} variant={field.variant || "outline"}>
                      {field.value}
                    </Badge>
                  ) : (
                    <p key={index} className="text-muted-foreground">
                      {renderField(field)}
                    </p>
                  )
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {details.name}
              </h1>

              {isUser ? (
                <p className="text-muted-foreground">
                  {(details as UserDetails).email}
                </p>
              ) : (
                details.metadata?.description && (
                  <p className="text-muted-foreground">
                    {details.metadata.description}
                  </p>
                )
              )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tab.sections.map((section, index) => renderSection(section))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
