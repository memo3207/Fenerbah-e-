# Fenerbahçe - Yapay Zeka Destekli Video Oluşturucu (OpenAI Entegrasyonu)

Bu repo için OpenAI tabanlı temel entegrasyon iskeleti sağlanmıştır.

Özellikler:
- Metinden storyboard (GPT) üretimi
- OpenAI Image API ile sahne görselleri üretimi
- (Opsiyonel) TTS (OpenAI TTS veya üçüncü parti)

Kurulum (lokal):
1. Depoyu klonla ve bağımlılıkları yükle:
   - npm install
   - npm i openai dotenv express axios fluent-ffmpeg ffmpeg-static
2. .env dosyasını oluştur (örnek: .env.example)
3. `npm start` ile çalıştır

Nasıl kullanılır:
- POST /api/generate ile JSON gövdesi:
  {
    "prompt": "Kısa açıklama veya hikaye metni"
  }
- Endpoint, sahne listesini döner ve opsiyonel olarak görsel/TTS üretimini tetikleyebilir.

Notlar:
- Gerçek üretim için API limitleri, dosya depolama (S3), kuyruklama (Bull/Redis) ve ücret yönetimi eklenmelidir.
- TTS için OpenAI resmi TTS endpoint'inin kullanılabilirliği değişebilir; gerekirse ElevenLabs veya Google Cloud TTS önerilir.
