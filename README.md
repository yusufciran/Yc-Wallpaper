# 🎬 Yc Wallpaper

Modern ve profesyonel bir canlı duvar kağıdı (live wallpaper) web sitesi. Tamamen statik HTML, CSS ve JavaScript ile geliştirilmiş olup, sunucu gerektirmeden çalışır.

## 🌟 Özellikler

### Temel Özellikler
- ✨ **Modern Tasarım** - Cinematic dark tema ve glassmorphism efektleri
- 🔍 **Güçlü Arama** - Anlık filtreleme ve kategori sistemi
- 📱 **Responsive** - Tüm cihazlarda mükemmel görünüm
- 🎬 **Video Önizleme** - Mouse hover ile canlı video oynatma
- 📄 **Detay Sayfaları** - Her wallpaper için özel detay sayfası
- 🎯 **Akıllı Öneriler** - Başlık benzerliğine dayalı öneri algoritması
- ⚡ **Hızlı Yükleme** - Lazy loading ve optimize edilmiş görseller
- 🚀 **Sunucusuz** - Tamamen statik, GitHub Pages uyumlu

### Gelişmiş Özellikler
- ❤️ **Favori Sistemi** - LocalStorage ile kalıcı favoriler
- 🔄 **Klavye Navigasyonu** - Keyboard shortcuts ile hızlı erişim
- 📜 **Scroll to Top** - Hızlı yukarı çıkma butonu
- 👁️ **Son Görüntülenenler** - Görüntüleme geçmişi (son 20)
- 📥 **Kolay İndirme** - 4K ve HD indirme seçenekleri
- 🎬 **Video Optimizasyonu** - Otomatik video kalitesi
- 📊 **Sayfalama** - Her sayfada 48 wallpaper
- 💫 **Smooth Animations** - Profesyonel geçiş efektleri

## 🚀 Canlı Demo

[GitHub Pages'de Görüntüle](https://yusufciran.github.io/Yc-Wallpaper/)

## 📦 Kurulum

### GitHub Pages ile Yayınlama

1. Bu repository'yi fork edin veya kendi hesabınıza clone edin:
```bash
git clone https://github.com/your-username/yc-wallpaper.git
cd yc-wallpaper
```

2. Dosyaları GitHub repository'nize yükleyin:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. GitHub repository settings'e gidin:
   - Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Save

4. Birkaç dakika içinde siteniz `https://your-username.github.io/repository-name/` adresinde yayında!

### Lokal Çalıştırma

Basit bir HTTP server kullanın:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (npx)
npx serve

# PHP
php -S localhost:8000
```

Tarayıcınızda `http://localhost:8000` adresine gidin.

## 📁 Dosya Yapısı

```
yc-wallpaper/
├── index.html          # Ana sayfa
├── detail.html         # Detay sayfası
├── favorites.html      # Beğenilenler sayfası
├── style.css           # Tüm CSS stilleri
├── app.js              # JavaScript mantığı
├── data.json           # Wallpaper veritabanı (37,000+ kayıt)
└── README.md           # Bu dosya
```

## 🎨 Özelleştirme

### Renk Temasını Değiştirme

`style.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --accent-primary: #8b5cf6;      /* Ana vurgu rengi (mor) */
    --accent-secondary: #06b6d4;    /* İkincil vurgu rengi (cyan) */
    --bg-primary: #0a0a0f;          /* Ana arka plan */
    --bg-secondary: #12121a;        /* İkincil arka plan */
    /* ... diğer renkler */
}
```

### Sayfa Başına Öğe Sayısı

`app.js` dosyasında:

```javascript
const ITEMS_PER_PAGE = 48;              // Ana sayfa
const RECOMMENDATIONS_PER_PAGE = 12;    // Detay sayfası önerileri
```

### Kategori Filtrelerini Düzenleme

`index.html` ve `app.js` dosyalarını düzenleyerek yeni kategoriler ekleyebilir veya mevcut olanları değiştirebilirsiniz.

## ⌨️ Klavye Kısayolları

| Kısayol | Açıklama |
|---------|----------|
| `Ctrl/Cmd + K` | Arama kutusuna odaklan |
| `ESC` | Aramayı temizle |
| `← (Sol Ok)` | Önceki wallpaper (detay sayfası) |
| `→ (Sağ Ok)` | Sonraki wallpaper (detay sayfası) |

## 🛠️ Teknolojiler

- **HTML5** - Semantik yapı
- **CSS3** - Modern stillemeler
  - CSS Variables
  - Flexbox & Grid
  - Animations & Transitions
  - Glassmorphism
  - Responsive Design
- **Vanilla JavaScript** - Framework yok
  - ES6+ Features
  - Local Storage API
  - Fetch API
  - Event Delegation
- **Google Fonts** - Orbitron & Inter

## 📊 Özellikler Detayı

### Ana Sayfa
- 48 wallpaper/sayfa gösterimi
- Grid layout (responsive)
- Anlık arama ve filtreleme
- 6 kategori filtresi (Tümü, Anime, Oyun, Doğa, Cyberpunk, Fantasy)
- Video hover önizleme
- Favori ekleme/çıkarma sistemi
- "Daha Fazla Yükle" butonu
- Toplam wallpaper sayacı
- Scroll to top butonu

### Detay Sayfası
- Full-screen video oynatıcı (otomatik döngü, kontroller gizli)
- Büyük favori butonu (başlık yanında)
- 4K ve HD indirme linkleri
- İleri/Geri navigasyon butonları
- Klavye navigasyonu (ok tuşları)
- Benzer wallpaper önerileri (12/sayfa)
- Akıllı öneri algoritması
- "Daha Fazla Yükle" önerilerde

### Beğenilenler Sayfası
- Tüm beğenilen wallpaper'lar
- "Tümünü Temizle" butonu
- Boş durum için özel mesaj
- LocalStorage ile kalıcı saklama

## 🎯 LocalStorage Kullanımı

Site iki veri tipi kaydeder:

1. **Favorites** (Favoriler):
```javascript
localStorage.getItem('favorites') // ["url1", "url2", ...]
```

2. **Recently Viewed** (Son Görüntülenenler):
```javascript
localStorage.getItem('recentlyViewed') // ["url1", "url2", ...] (max 20)
```

## 🌐 Tarayıcı Desteği

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📱 Responsive Breakpoints

- **Desktop**: 1400px+
- **Laptop**: 1024px - 1399px
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! İşte nasıl katkıda bulunabilirsiniz:

1. Bu repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Yapılacaklar

- [ ] "Son Görüntülenenler" sayfası
- [ ] Kategori bazlı ayrı sayfalar
- [ ] Wallpaper yükleme formu
- [ ] Kullanıcı hesap sistemi (Firebase)
- [ ] Dark/Light tema switcher
- [ ] Çoklu dil desteği
- [ ] PWA desteği
- [ ] Gelişmiş filtreleme (renk, çözünürlük, vb.)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Your Name**

- GitHub: [@your-username](https://github.com/your-username)
- Website: [your-website.com](https://your-website.com)

## 🙏 Teşekkürler

- Wallpaper kaynağı: [MotionBGs](https://motionbgs.com)
- Font: [Google Fonts](https://fonts.google.com)
- İlham: Modern web tasarım trendleri

## 📸 Ekran Görüntüleri

### Ana Sayfa
*Buraya ekran görüntüsü ekleyebilirsiniz*

### Detay Sayfası
*Buraya ekran görüntüsü ekleyebilirsiniz*

### Beğenilenler Sayfası
*Buraya ekran görüntüsü ekleyebilirsiniz*

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

**Not**: Bu site eğitim amaçlı geliştirilmiştir. Tüm wallpaper'lar ilgili kaynaklardan alınmıştır.
