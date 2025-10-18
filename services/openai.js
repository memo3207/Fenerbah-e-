const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateStoryboardText(prompt, model = process.env.OPENAI_MODEL || "gpt-4o-mini") {
  const system = `You are a helpful assistant that converts a user prompt into a JSON array of scenes.\nReturn ONLY valid JSON. Each scene: { "id": number, "text": "short description", "duration": seconds, "type": "shot|bg|closeup" }`;
  const user = `Create a storyboard for the following prompt:\n\n${prompt}\n\nReturn as JSON array of scenes.`;

  // Chat completions v.s. chat API wrapper may differ by OpenAI client version;\n  // adjust if your installed openai client uses a different method name.
  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 800,
  });

  const content = res.choices?.[0]?.message?.content || "";
  try {
    const jsonStart = content.indexOf("[");
    const jsonStr = jsonStart >= 0 ? content.slice(jsonStart) : content;
    const scenes = JSON.parse(jsonStr);
    return scenes;
  } catch (err) {
    throw new Error("Storyboard JSON parse error: " + err.message + " RAW: " + content);
  }
}

async function generateImageForScene(scene, imageModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1", size = process.env.OPENAI_IMAGE_SIZE || "1024x1024") {
  const prompt = scene.text;
  const res = await client.images.generate({
    model: imageModel,
    prompt,
    size,
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image generation returned no data");
  const buf = Buffer.from(b64, "base64");
  const filename = path.join("output", `scene-${scene.id}.png`);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, buf);
  return filename;
}

async function textToSpeech(text, outFile = "output/speech.mp3") {
  // Placeholder: OpenAI TTS endpoint availability and usage may vary.
  // If OpenAI audio.speech.create (or similar) is available, integrate here.
  // Otherwise integrate ElevenLabs / GoogleTTS.
  throw new Error("TTS not implemented. Configure OpenAI TTS or another provider.");
}

module.exports = {
  generateStoryboardText,
  generateImageForScene,
  textToSpeech,
};
