import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json({
      status: "error",
      error,
    });
  }

  if (!code) {
    return NextResponse.json(
      {
        status: "error",
        message: "Không nhận được authorization code",
      },
      { status: 400 }
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        status: "error",
        message: "Thiếu biến môi trường Google OAuth",
      },
      { status: 500 }
    );
  }

  const redirectUri =
    "https://nextjs-boilerplate-alpha-nine-56.vercel.app/api/auth/google/callback";

  const tokenResponse = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return NextResponse.json(
      {
        status: "error",
        message: "Không đổi được authorization code thành token",
        googleError: tokenData.error || null,
        googleErrorDescription: tokenData.error_description || null,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "ok",
    message: "Google OAuth token exchange thành công",
    hasAccessToken: Boolean(tokenData.access_token),
    hasRefreshToken: Boolean(tokenData.refresh_token),
    tokenType: tokenData.token_type || null,
    expiresIn: tokenData.expires_in || null,
  });
}
