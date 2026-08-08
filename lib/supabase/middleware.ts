import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  GATE_COOKIE,
  UNLOCK_PATH,
  computeGateToken,
  isGateEnabled,
  safeEqual,
} from "@/lib/site-gate";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Shopify-style password gate ─────────────────────────────────────────
  // Runs before anything else so a locked site reveals nothing (not even the
  // login page). Disabled automatically when SITE_PASSWORD is unset.
  if (isGateEnabled()) {
    const expected = await computeGateToken(process.env.SITE_PASSWORD as string);
    const provided = request.cookies.get(GATE_COOKIE)?.value ?? "";
    const unlocked = safeEqual(provided, expected);
    const isUnlockPath = pathname === UNLOCK_PATH;

    if (!unlocked && !isUnlockPath) {
      const url = request.nextUrl.clone();
      url.pathname = UNLOCK_PATH;
      url.search = "";
      url.searchParams.set("next", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }

    if (unlocked && isUnlockPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session if expired. Must be called BEFORE any auth-dependent
  // logic below — Supabase recommends this happen on every request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  if (isDashboard && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLogin && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
