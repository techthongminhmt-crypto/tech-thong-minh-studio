export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const params = Object.fromEntries(searchParams.entries());

  return Response.json({
    status: "callback_received",
    params,
  });
}
