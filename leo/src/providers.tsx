'use client';


import {FiltersProvider} from "@/Contexts/filter-context";
import React from "react";
import {SidebarProvider} from "@/components/sidebar/sidebarContext";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <FiltersProvider>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </FiltersProvider>
    );
}