import { ClerkProvider, Show, SignIn, SignUp, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import type { ReactNode } from "react";
import { AgendaPage, DashboardPage, HomePage, RegistrationPage, SiteHeader } from "./pages";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing the managed Clerk publishable key.");
}

const clerkAppearance = {
  theme: shadcn,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#f4c2c2",
    colorForeground: "#f5f1ed",
    colorMutedForeground: "#c7c2bd",
    colorDanger: "#ffaaaa",
    colorBackground: "#191716",
    colorInput: "#11100f",
    colorInputForeground: "#f5f1ed",
    colorNeutral: "#f5f1ed",
    fontFamily: "Inter, sans-serif",
    borderRadius: "2px",
  },
};

function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignIn = mode === "sign-in";
  const heading = isSignIn ? "Your summit begins here" : "Make room for what's next";

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="Lash Pro Summit">
        <a className="lps-brand" href="/" aria-label="Lash Pro Summit home">
          <span className="lps-brand-mark" aria-hidden="true">L<span>·</span>P</span>
          <span className="lps-brand-name">Lash Pro <span>Summit</span></span>
        </a>
        <div className="auth-story-content">
          <p className="lps-eyebrow"><span className="lps-eyebrow-line" />A virtual global masterclass</p>
          <h1>{heading.split(" ").slice(0, -1).join(" ")} <em>{heading.split(" ").at(-1)}.</em></h1>
          <p>Join a gathering for the professionals shaping what comes next in lash artistry—where precision meets practice, and craft meets care.</p>
        </div>
        <p className="auth-story-meta">December 1, 2026 · Live interactive stream</p>
      </section>
      <section className="auth-form-side" aria-label={isSignIn ? "Sign in" : "Create your account"}>
        <div className="auth-form-wrap">
          <a className="lps-brand auth-mobile-brand" href="/" aria-label="Lash Pro Summit home">
            <span className="lps-brand-mark" aria-hidden="true">L<span>·</span>P</span>
            <span className="lps-brand-name">Lash Pro <span>Summit</span></span>
          </a>
          <p className="auth-form-heading">Lash Pro Summit 2026</p>
          {isSignIn ? (
            <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
          ) : (
            <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
          )}
          <a className="auth-back-link" href="/">Return to the summit</a>
        </div>
      </section>
    </main>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/dashboard" /></Show>
      <Show when="signed-out"><HomePage /></Show>
    </>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function LogoutAction() {
  const { signOut } = useClerk();

  return (
    <button
      className="lps-auth-link lps-logout-button"
      type="button"
      onClick={() => signOut({ redirectUrl: basePath || "/" })}
    >
      Sign out
    </button>
  );
}

function RoutedApp() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to access your summit account" } },
        signUp: { start: { title: "Create your account", subtitle: "Join Lash Pro Summit 2026" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/sign-in/*?" component={() => <AuthRoute mode="sign-in" />} />
        <Route path="/sign-up/*?" component={() => <AuthRoute mode="sign-up" />} />
        <Route path="/agenda" component={AgendaPage} />
        <Route path="/dashboard">
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        </Route>
        <Route path="/registration">
          <ProtectedRoute><RegistrationPage /></ProtectedRoute>
        </Route>
        <Route>
          <main className="route-message">
            <p className="lps-eyebrow">Page not found</p>
            <h1>This page isn't on the programme.</h1>
            <p>The page may have moved or the address may be incorrect.</p>
            <a href="/">Return to Lash Pro Summit</a>
          </main>
        </Route>
      </Switch>
    </ClerkProvider>
  );
}

function AuthRoute({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <>
      <Show when="signed-in"><Redirect to="/dashboard" /></Show>
      <Show when="signed-out"><AuthPage mode={mode} /></Show>
    </>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <RoutedApp />
    </WouterRouter>
  );
}
