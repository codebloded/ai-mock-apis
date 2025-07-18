import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Boundary } from "@/components/ui/boundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useNavStore } from "@/stores";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

//MAIN CHIJJJJ

export default function Page() {
  const { breadcrumbs, title } = useNavStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    <BreadcrumbItem className="hidden md:block">
                      {crumb.path ? (
                        <Link to={crumb.path}>{crumb.label}</Link>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Boundary>
            <Outlet />
            <Toaster />
          </Boundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
