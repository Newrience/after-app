export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { text, target, source } = req.body;
  if (!text) return res.status(400).json({ error: "no text" });

  const sl = source || "auto";
  const tl = target || "en";

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const data = await r.json();
  
  let translated = "";
  if (data[0]) {
    data[0].forEach((item) => { translated += item[0]; });
  }

  return res.status(200).json({ translatedText: translated, source: sl, target: tl, original: text });
}
