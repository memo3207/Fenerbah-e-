const express = require("express");
const router = express.Router();
const { generateStoryboardText, generateImageForScene } = require("../services/openai");

router.post("/", async (req, res) => {
  try {
    const { prompt, generateImages = true } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const scenes = await generateStoryboardText(prompt);

    const images = [];
    if (generateImages) {
      for (const scene of scenes) {
        try {
          const file = await generateImageForScene(scene);
          images.push({ sceneId: scene.id, file });
        } catch (err) {
          console.warn("Image generation failed for scene", scene.id, err.message);
          images.push({ sceneId: scene.id, file: null, error: err.message });
        }
      }
    }

    return res.json({ scenes, images });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;