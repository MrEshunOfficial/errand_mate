// lib/client-api/FaviconUpdater.tsx
"use client";
import { useEffect } from "react";

export default function FaviconUpdater() {
  useEffect(() => {
    // Store references to elements we create
    const createdElements: HTMLLinkElement[] = [];
    
    // Only remove elements we didn't create (avoid React conflicts)
    const existingLinks = document.querySelectorAll('link[rel*="icon"]:not([data-favicon-updater])');
    existingLinks.forEach((link) => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });

    // Create new favicon elements with identifier
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/jpeg";
    link.href = `/errand_logo.jpg?v=${Date.now()}`;
    link.setAttribute('data-favicon-updater', 'true');
    document.head.appendChild(link);
    createdElements.push(link);

    const shortcutLink = document.createElement("link");
    shortcutLink.rel = "shortcut icon";
    shortcutLink.type = "image/jpeg";
    shortcutLink.href = `/errand_logo.jpg?v=${Date.now()}`;
    shortcutLink.setAttribute('data-favicon-updater', 'true');
    document.head.appendChild(shortcutLink);
    createdElements.push(shortcutLink);

    // Cleanup function
    return () => {
      createdElements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  return null;
}