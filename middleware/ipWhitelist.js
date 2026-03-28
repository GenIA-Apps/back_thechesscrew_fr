/**
 * IP Whitelist Middleware
 * Restricts API access to authorized IPs only
 * 
 * Environment Variable: AUTHORIZED_IP (comma-separated list or single IP)
 * Example: AUTHORIZED_IP="192.168.1.1,10.0.0.1" or AUTHORIZED_IP="127.0.0.1"
 */

export function ipWhitelistMiddleware(req, res, next) {
  const authorizedIp = process.env.AUTHORIZED_IP;

  // If AUTHORIZED_IP is not set, allow all requests (development mode)
  if (!authorizedIp) {
    console.warn('⚠️  AUTHORIZED_IP not set - allowing all IPs (development mode)');
    return next();
  }

  // Get client IP from request
  const clientIp = getClientIp(req);

  // Parse authorized IPs (handle both single IP and comma-separated list)
  const authorizedIps = authorizedIp
    .split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0);

  // Check if client IP is in whitelist
  const isAuthorized = authorizedIps.includes(clientIp);

  if (!isAuthorized) {
    console.warn(`🚫 Unauthorized IP access attempt: ${clientIp} (allowed: ${authorizedIps.join(', ')})`);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Your IP address is not authorized to access this API',
    });
  }

  console.log(`✓ Authorized IP access: ${clientIp}`);
  next();
}

/**
 * Extract client IP from request
 * Handles X-Forwarded-For header (for proxies) and direct connections
 */
function getClientIp(req) {
  // Check for X-Forwarded-For header (from proxies, load balancers)
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // Take the first IP in the chain
    return xForwardedFor.split(',')[0].trim();
  }

  // Fallback to direct connection IP
  return req.socket.remoteAddress || req.connection.remoteAddress || 'unknown';
}
