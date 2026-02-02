export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/', '/api/');
  const targetUrl = `http://42.192.58.127:5000${path}`;
  
  const newRequest = new Request(targetUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.method !== 'GET' ? context.request.body : undefined,
  });
  
  const response = await fetch(newRequest);
  
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
