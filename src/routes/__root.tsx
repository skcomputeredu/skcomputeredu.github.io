import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/shell";
import { LanguageProvider, useCopy } from "@/lib/i18n";
import appCss from "../styles.css?url";

const APP_NAME = "SK Computer & Education Centre";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "SK Computer & Education Centre, Defence Colony, Air Force Gate, Izzat Nagar, Bareilly, UP-243122. Computer courses and school tuition, class 1 to 12. Call 8410932860.",
      },
      { name: "theme-color", content: "#0c2340" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/sk-logo.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,560;0,9..144,680;1,9..144,560&family=Libre+Bodoni:ital,wght@1,700&family=Mukta:wght@400;500;600;700&family=Open+Sans:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Tiro+Devanagari+Hindi&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-ivory font-sans text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <LanguageProvider>
            <Shell>
              <Outlet />
            </Shell>
          </LanguageProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  const t = useCopy();
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <p className="text-xs font-semibold tracking-widest text-gold-deep uppercase">404</p>
      <h1 className="mt-3 font-display text-5xl text-navy">{t.notFoundTitle}</h1>
      <p className="mt-4 text-muted">{t.notFoundBody}</p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-navy px-5 py-3 font-semibold text-ivory"
      >
        {t.notFoundHome}
      </Link>
    </div>
  );
}
