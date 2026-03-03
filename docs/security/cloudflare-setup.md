# Panduan Setup Cloudflare untuk Perlindungan DDoS

## Apa itu Cloudflare?
Cloudflare adalah layanan CDN & keamanan yang melindungi website dari serangan DDoS, bot, dan ancaman lainnya. 
Cloudflare bertindak sebagai "perisai" antara pengunjung dan server Anda.

```
Pengunjung → [Cloudflare 🛡️] → Server Anda
                ↓ Jika serangan DDoS
              [DIBLOKIR] ❌
```

---

## Prasyarat
- Domain yang sudah Anda miliki (misal: `lab-informatika.ac.id`)
- Akses ke panel DNS domain Anda (registrar tempat Anda membeli domain)
- Akun Cloudflare (gratis di https://dash.cloudflare.com/sign-up)

---

## Langkah 1: Buat Akun Cloudflare
1. Buka https://dash.cloudflare.com/sign-up
2. Daftar dengan email dan password
3. Verifikasi email Anda

## Langkah 2: Tambahkan Domain
1. Klik **"Add a Site"** di dashboard Cloudflare
2. Masukkan nama domain Anda (contoh: `lab-informatika.ac.id`)
3. Pilih plan **Free** (sudah termasuk proteksi DDoS dasar)
4. Cloudflare akan memindai DNS records yang ada — pastikan semua benar
5. Klik **Continue**

## Langkah 3: Ubah Nameserver
Cloudflare akan memberikan 2 nameserver baru, contoh:
```
anna.ns.cloudflare.com
bob.ns.cloudflare.com
```

1. Login ke panel DNS registrar domain Anda
2. Ubah nameserver dari default ke nameserver Cloudflare
3. Tunggu propagasi DNS (biasanya 5 menit – 24 jam)
4. Kembali ke Cloudflare dan klik **"Check nameservers"**

## Langkah 4: Konfigurasi SSL
1. Di dashboard Cloudflare, buka **SSL/TLS**
2. Set encryption mode ke **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

## Langkah 5: Konfigurasi Keamanan
### DDoS Protection (Otomatis)
Cloudflare Free plan sudah otomatis memproteksi dari serangan DDoS L3/L4/L7.

### Firewall Rules (Rekomendasi)
Buka **Security > WAF** dan buat rules berikut:

#### Rule 1: Block Bad Bots
```
Field: Known Bots
Operator: equals
Value: Off (hanya blokir bad bots)
Action: Block
```

#### Rule 2: Rate Limiting (Cloudflare Level)
Buka **Security > Rate Limiting**:
- URL Pattern: `*lab-informatika.ac.id/api/*`
- Threshold: 100 requests per 10 seconds per IP
- Action: Block for 1 minute

#### Rule 3: Challenge Suspicious Traffic
```
Field: Threat Score
Operator: greater than
Value: 14
Action: Managed Challenge
```

### Bot Fight Mode
1. Buka **Security > Bots**
2. Enable **Bot Fight Mode** (gratis)
3. Ini akan otomatis menantang traffic yang mencurigakan

### Under Attack Mode (Darurat)
Jika sedang diserang DDoS:
1. Buka dashboard Cloudflare
2. Klik **Under Attack Mode** = ON
3. Semua pengunjung akan mendapat challenge 5 detik sebelum bisa akses
4. Matikan setelah serangan selesai

---

## Langkah 6: Page Rules (Opsional)
Buka **Rules > Page Rules**:

### Cache Static Assets
- URL: `*domain.com/uploads/*`
- Setting: Cache Level = Cache Everything, Edge TTL = 1 month

### Bypass Cache for API
- URL: `*domain.com/api/*`  
- Setting: Cache Level = Bypass

---

## Langkah 7: DNS Records
Pastikan DNS records Anda terlihat seperti ini:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | `[IP_SERVER_ANDA]` | ☁️ Proxied |
| CNAME | www | `domain.com` | ☁️ Proxied |

> **PENTING**: Pastikan icon awan berwarna **oranye** (Proxied). Jika abu-abu (DNS Only), traffic tidak melewati Cloudflare dan TIDAK terlindungi.

---

## Verifikasi
Setelah setup selesai, verifikasi dengan:

1. **Cek DNS**: Buka https://dnschecker.org dan masukkan domain Anda
2. **Cek Header**: Jalankan di terminal:
   ```bash
   curl -I https://domain-anda.com
   ```
   Harus ada header `server: cloudflare` dan `cf-ray: ...`

3. **Test DDoS Protection**: Cloudflare dashboard > **Analytics > Security** akan menampilkan traffic yang diblokir

---

## Integrasi dengan Rate Limiter Aplikasi

Sistem Anda sudah memiliki rate limiting di level aplikasi (`middleware.ts`). 
Dengan Cloudflare, Anda mendapat **double protection**:

```
Request masuk
    ↓
[Cloudflare] ← Layer 1: DDoS protection, bot filtering, rate limiting
    ↓ (lolos)
[middleware.ts] ← Layer 2: Per-IP rate limiting per route category
    ↓ (lolos)
[Aplikasi Next.js] ← Request diproses
```

### Header IP yang Benar
Cloudflare mengirim IP asli pengunjung melalui header `CF-Connecting-IP`.
Middleware sudah membaca `x-forwarded-for` yang di-set oleh Cloudflare secara otomatis.

---

## Biaya
| Plan | Harga | Fitur |
|------|-------|-------|
| **Free** | Gratis | DDoS protection, SSL, CDN, 5 Page Rules |
| **Pro** | $20/bln | WAF managed rules, image optimization |
| **Business** | $200/bln | Advanced DDoS, custom WAF rules |

> **Rekomendasi**: Plan **Free** sudah sangat cukup untuk aplikasi lab universitas.
