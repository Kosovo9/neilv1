export default {
  async fetch(request: Request, env: { R2_BUCKET: R2Bucket }, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const object = await env.R2_BUCKET.get(key);

      if (object === null) {
        return new Response('Not Found', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('etag', object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    } catch (error) {
      return new Response('Error fetching object', { status: 500 });
    }
  },
};

