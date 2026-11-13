export function GET() {
  return Response.json({
    ok: true,
    service: "innovator",
    runtime: process.env.K_SERVICE ? "cloud-run" : "container",
  });
}
