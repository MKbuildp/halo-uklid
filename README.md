# Halo Úklid - Webová stránka

Moderní, responzivní webová stránka pro úklidovou firmu s důrazem na mobilní optimalizaci a uživatelskou přívětivost.

## 🚀 Funkce

- **Responzivní design** - Optimalizováno pro všechna zařízení
- **Mobilní menu** - Hamburger menu s animacemi
- **Rezervační systém** - Online rezervace úklidových služeb
- **Upload obrázků** - Možnost nahrát fotky předmětů k vyčištění
- **Kontaktní formuláře** - Snadný kontakt s firmou
- **Galerie služeb** - Prezentace před/po úklidu
- **SEO optimalizace** - Meta tagy, Open Graph, strukturovaná data
- **Přístupnost** - ARIA labels, klávesové zkratky, focus management
- **GDPR compliance** - Zásady zpracování osobních údajů

## 🛠️ Technologie

- **HTML5** - Sémantická struktura
- **CSS3** - Moderní styly s CSS proměnnými
- **JavaScript (ES6+)** - Interaktivní funkcionalita
- **Font Awesome** - Ikony
- **CSS Grid & Flexbox** - Responzivní layout
- **CSS Animations** - Plynulé přechody a animace

## 📱 Mobilní optimalizace

- **Touch-friendly** - Minimální velikost dotykových prvků 44px
- **Responzivní breakpointy** - 375px, 768px, 1024px
- **Mobilní menu** - Fullscreen overlay s animacemi
- **Optimalizované formuláře** - Font-size 16px pro iOS
- **Safe area support** - iPhone X a novější
- **Viewport height fix** - Pro mobilní prohlížeče
- **Reduced motion support** - Respektuje uživatelské preference

## 🏗️ Struktura projektu

```
halouklid/
├── index.html          # Hlavní HTML soubor
├── gdpr.html           # GDPR zásady
├── css/
│   ├── style.css       # Hlavní styly
│   └── responsive.css  # Responzivní styly
├── js/
│   └── main.js        # JavaScript funkcionalita
├── images/             # Obrázky (vytvořit)
├── favicon.ico         # Favicon (vytvořit)
└── README.md           # Dokumentace
```

## 🚀 Spuštění

1. **Lokální spuštění**
   ```bash
   # Otevřete index.html v prohlížeči
   # Nebo použijte lokální server
   python -m http.server 8000
   # Nebo
   npx serve .
   ```

2. **GitHub Pages nasazení**
   - Nahrajte soubory do GitHub repozitáře
   - Povolte GitHub Pages v nastavení
   - Nastavte custom domain `halouklid.cz`

3. **Formspree konfigurace**
   - Rezervační formulář je propojen s Formspree
   - Objednávky chodí na: kabelac.mi@gmail.com
   - Endpoint: https://formspree.io/f/xwpnkedp
   - ✅ **KONFIGURACE DOKONČENA** - formulář je funkční

4. **ImgBB konfigurace (upload obrázků)**
   - Obrázky se automaticky nahrávají na ImgBB
   - **DŮLEŽITÉ**: Nahraďte placeholder API klíč v `js/main.js`
   - Hledejte: `IMGBB_API_KEY = '2c0d0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c'`
   - Nahraďte: `IMGBB_API_KEY = 'VAŠE_SKUTEČNÉ_API_KLÍČ'`

## 📋 Seznam služeb

- **Tepování sedaček a čalounění** - od 500 Kč
- **Čištění koberců** - od 300 Kč
- **Úklid kanceláří** - od 800 Kč
- **Úklid domácností** - od 600 Kč

## 🔧 Konfigurace

### Změna kontaktních údajů
Upravte telefon a email v `index.html`:
```html
<p><i class="fas fa-phone"></i> +420 123 456 789</p>
<p><i class="fas fa-envelope"></i> info@halouklid.cz</p>
```

### Změna barev
Upravte CSS proměnné v `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --accent-color: #f59e0b;
    /* ... */
}
```

### Přidání nových služeb
Přidejte novou službu do sekce služeb v `index.html`:
```html
<div class="service-card">
    <div class="service-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Název služby</h3>
    <p>Popis služby</p>
    <span class="price">od XXX Kč</span>
</div>
```

## 📱 Testování

### Mobilní zařízení
- iPhone SE (375px)
- iPhone 12 (390px)
- Samsung Galaxy (360px)
- iPad (768px)

### Desktop
- 1024px (tablet)
- 1200px (desktop)
- 1920px (full HD)

## 🎨 Design systém

### Barvy
- **Primární**: #2563eb (modrá)
- **Sekundární**: #64748b (šedá)
- **Akcent**: #f59e0b (oranžová)
- **Úspěch**: #10b981 (zelená)
- **Chyba**: #ef4444 (červená)

### Typografie
- **Nadpisy**: Segoe UI, 600 weight
- **Text**: Segoe UI, 400 weight
- **Tlačítka**: Segoe UI, 500 weight

### Spacing
- **Malé**: 0.5rem (8px)
- **Střední**: 1rem (16px)
- **Velké**: 2rem (32px)

## 🔒 Bezpečnost

- **Formulářová validace** - Client-side i server-side
- **XSS ochrana** - Sanitizace vstupů
- **CSRF ochrana** - Token-based
- **HTTPS** - Povinné pro produkci

## 📊 SEO optimalizace

- **Meta tagy** - Title, description, keywords
- **Open Graph** - Facebook a sociální sítě
- **Twitter Cards** - Twitter optimalizace
- **Strukturovaná data** - Schema.org markup
- **Sitemap** - XML sitemap
- **Robots.txt** - Vyhledávače

## ♿ Přístupnost

- **ARIA labels** - Screen reader support
- **Klávesové zkratky** - ESC, Ctrl+Enter
- **Focus management** - Viditelné focus stavy
- **Kontrast** - WCAG AA compliance
- **Semantická HTML** - Správné použití tagů

## 🚀 Performance

- **Lazy loading** - Obrázky a komponenty
- **CSS optimalizace** - Minifikace a komprese
- **JavaScript optimalizace** - Debouncing, throttling
- **Image optimization** - WebP format, správné velikosti
- **Caching** - Service Worker pro offline

## 🔄 Aktualizace

### Verze 1.0.0
- Základní funkcionalita
- Responzivní design
- Rezervační systém
- Mobilní optimalizace

### Plánované funkce
- [ ] Online platby
- [ ] Kalendář dostupnosti
- [ ] Hodnocení a recenze
- [ ] Blog sekce
- [ ] Newsletter
- [ ] PWA funkcionalita

## 📞 Podpora

Pro technickou podporu kontaktujte:
- **Email**: tech@halouklid.cz
- **Telefon**: +420 123 456 789

## 📄 Licence

Tento projekt je vytvořen pro firmu Halo Úklid. Všechna práva vyhrazena.

---

**Vytvořeno s ❤️ pro Halo Úklid**
*Poslední aktualizace: 16.08.2025*
