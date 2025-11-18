import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabaseAdmin";

async function getUserFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return { error: "Missing bearer token" };
  }
  const token = authHeader.split(" ")[1];
  if (!token) return { error: "Invalid bearer token" };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return { error: error?.message || "Invalid token" };
  }
  return { user: data.user };
}

async function parseRequestBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await request.json();
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }
  return {};
}

export async function withAuth(request, handler, { optional = false } = {}) {
  const body = await parseRequestBody(request);
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());

  let user = null;
  if (!optional) {
    const { user: authenticatedUser, error } = await getUserFromRequest(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }
    user = authenticatedUser;
  } else {
    const { user: optionalUser } = await getUserFromRequest(request);
    user = optionalUser || null;
  }

  try {
    const result = await handler({ body, params, user, request });
    const { status = 200, data } = result;
    return NextResponse.json(
      data ?? { message: "OK" },
      { status, headers: result?.headers }
    );
  } catch (error) {
    console.error("API error", error);
    return NextResponse.json(
      { error: error.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

