export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "no code" });
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: "4489aeb8c65d3da5480af3dc1e3f0c5e",
    redirect_uri: "https://after-app-seven.vercel.app/",
    code: code,
  });
  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: params.toString(),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return res.status(400).json(tokenData);
  const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();
  return res.status(200).json({
    nickname: user.properties?.nickname || "카카오 사용자",
    email: user.kakao_account?.email || "",
  });
}
