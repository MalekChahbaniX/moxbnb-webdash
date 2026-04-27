import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashScreenWrapper from "@/components/SplashScreenWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moxbnb - Locations et Expériences en Tunisie",
  description: "Plateforme nationale de locations de logements, expériences et services en Tunisie. Trouvez votre prochain séjour unique.",
  keywords: ["Moxbnb", "Tunisie", "locations", "logements", "expériences", "services", "voyage", "vacances"],
  authors: [{ name: "Moxbnb Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Moxbnb - Locations et Expériences en Tunisie",
    description: "Plateforme nationale de locations de logements, expériences et services en Tunisie",
    url: "https://moxbnb.tn",
    siteName: "Moxbnb",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moxbnb - Locations et Expériences en Tunisie",
    description: "Plateforme nationale de locations de logements, expériences et services en Tunisie",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <SplashScreenWrapper>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </SplashScreenWrapper>
      </body>
    </html>
  );
}
