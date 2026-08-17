import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Behind a reverse proxy, `request.url` carries the internal origin
  // (e.g. some-ip:port), so redirecting against it lands the user on the wrong
  // host. Prefer the public host from the forwarding headers, falling back to
  // the request origin only when they're absent.
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") ??
    new URL(request.url).protocol.replace(":", "");

  const location = forwardedHost
    ? `${forwardedProto}://${forwardedHost}/`
    : new URL("/", request.url).toString();

  return NextResponse.redirect(location, { status: 303 });
}
