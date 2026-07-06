export default async function handler(req, res) {
  //Permite qualquer origem
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Acees-Control-Allow-Methods", "POST");

  //Se n for POST, nega
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const responde = await fetch("https://colormind.io/api/", {
      method: "POST",
      body: JSON.stringify({ input, model: "default" }),
    });
    const data = await responde.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
