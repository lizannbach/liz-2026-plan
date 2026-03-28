export const config = {
  matcher: ['/((?!assets|favicon\\.ico|.*\\..*).*)', '/'],
};

export default function middleware(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const isAuthed = cookie.split(';').some(c => c.trim() === 'liz-auth=1');
  if (isAuthed) return;

  const url = new URL(request.url);
  const pw = url.searchParams.get('pw');
  const correctPw = process.env.APP_PASSWORD;

  if (pw && correctPw && pw === correctPw) {
    return new Response('', {
      status: 302,
      headers: {
        Location: '/',
        'Set-Cookie': 'liz-auth=1; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000',
      },
    });
  }

  const wrongPw = pw && pw !== correctPw;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Liz's 2026 Plan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; background: #f5f3ee; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .box { background: white; border-radius: 14px; padding: 2.5rem 2rem; text-align: center; max-width: 340px; width: 90%; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
    h1 { font-size: 1.5rem; color: #2c2c2c; margin-bottom: 0.4rem; }
    p { color: #999; font-size: 0.88rem; margin-bottom: 1.8rem; font-style: italic; }
    input { width: 100%; padding: 0.7rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; margin-bottom: 0.8rem; outline: none; }
    input:focus { border-color: #6b7c4e; }
    button { background: #6b7c4e; color: white; border: none; padding: 0.75rem; border-radius: 8px; font-size: 1rem; cursor: pointer; width: 100%; font-family: Georgia, serif; }
    .error { color: #b94a4a; font-size: 0.82rem; margin-bottom: 0.8rem; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Liz's 2026 Plan</h1>
    <p>Private — enter your password to continue</p>
    <form method="GET">
      ${wrongPw ? '<p class="error">Wrong password — try again</p>' : ''}
      <input type="password" name="pw" placeholder="Password" autofocus autocomplete="current-password" />
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
