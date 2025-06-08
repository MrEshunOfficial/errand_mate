"use client";
import { useEffect } from "react";

export default function FaviconUpdater() {
  useEffect(() => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach((link) => link.remove());

    // Add new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/jpeg";
    link.href = `/errand_logo.jpg?v=${Date.now()}`; // Cache busting with timestamp
    document.head.appendChild(link);

    // Add shortcut icon
    const shortcutLink = document.createElement("link");
    shortcutLink.rel = "shortcut icon";
    shortcutLink.type = "image/jpeg";
    shortcutLink.href = `/errand_logo.jpg?v=${Date.now()}`;
    document.head.appendChild(shortcutLink);
  }, []);

  return null;
}
