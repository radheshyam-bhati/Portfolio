export function getHealthStatus(_request, response) {
  response.status(200).json({
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
