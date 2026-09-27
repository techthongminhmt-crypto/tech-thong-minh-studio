export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return Response.json({
      status: "error",
      error,
    });
  }

  return Response.json({
    status: "ok",
    message: "Google OAuth callback received",
    hasCode: Boolean(code),
  });
}
