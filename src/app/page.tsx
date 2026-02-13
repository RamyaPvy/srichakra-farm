"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useLanguage } from "@/context/LanguageContext";

type Lang = "te" | "hi" | "en";

const TEXT: Record<
  Lang,
  {
    subtitle: string;
    categoriesTitle: string;
    fish: string;
    sheep: string;
    veg: string;

    whyTitle: string;
    why1: string;
    why2: string;
    why3: string;

    galleryTitle: string;

    quickOrderTitle: string;
    call: string;
    wa: string;

    addressTitle: string;
    addressLine1: string;
    addressLine2: string;
    map: string;

    footer: string;
  }
> = {
  en: {
    subtitle: "Fresh Fish • Sheep • Vegetables — Direct from Farm",
    categoriesTitle: "Shop by Category",
    fish: "Fish",
    sheep: "Sheep",
    veg: "Vegetables",

    whyTitle: "Why SriChakra Farm?",
    why1: "Fresh stock updated by admin",
    why2: "Quality checked before delivery",
    why3: "Simple ordering via WhatsApp / Call",

    galleryTitle: "Farm Gallery",

    quickOrderTitle: "Quick Order",
    call: "Call Now",
    wa: "WhatsApp Order",

    addressTitle: "Farm Address",
    addressLine1: "SriChakra Farm, (Add your village/area)",
    addressLine2: "District, State, India — PIN",
    map: "Open Map",

    footer: "© SriChakra Farm",
  },
  te: {
    subtitle: "తాజా చేపలు • గొర్రెలు • కూరగాయలు — ఫారం నుంచి నేరుగా",
    categoriesTitle: "కేటగిరీ ద్వారా కొనండి",
    fish: "చేపలు",
    sheep: "గొర్రెలు",
    veg: "కూరగాయలు",

    whyTitle: "శ్రీచక్ర ఫారం ఎందుకు?",
    why1: "అడ్మిన్ అప్డేట్ చేసే తాజా స్టాక్",
    why2: "డెలివరీ ముందు క్వాలిటీ చెక్",
    why3: "వాట్సాప్ / కాల్ ద్వారా సులభ ఆర్డర్",

    galleryTitle: "ఫారం గ్యాలరీ",

    quickOrderTitle: "త్వరిత ఆర్డర్",
    call: "కాల్ చేయండి",
    wa: "వాట్సాప్ ఆర్డర్",

    addressTitle: "ఫారం చిరునామా",
    addressLine1: "శ్రీచక్ర ఫారం, (మీ గ్రామం/ఏరియా)",
    addressLine2: "జిల్లా, రాష్ట్రం, ఇండియా — పిన్",
    map: "మాప్ ఓపెన్ చేయండి",

    footer: "© శ్రీచక్ర ఫారం",
  },
  hi: {
    subtitle: "ताज़ी मछली • भेड़ • सब्ज़ियाँ — सीधे फार्म से",
    categoriesTitle: "कैटेगरी के अनुसार खरीदें",
    fish: "मछली",
    sheep: "भेड़",
    veg: "सब्ज़ियाँ",

    whyTitle: "SriChakra Farm क्यों?",
    why1: "एडमिन द्वारा अपडेट किया गया ताज़ा स्टॉक",
    why2: "डिलीवरी से पहले गुणवत्ता जांच",
    why3: "WhatsApp / कॉल से आसान ऑर्डर",

    galleryTitle: "फार्म गैलरी",

    quickOrderTitle: "त्वरित ऑर्डर",
    call: "कॉल करें",
    wa: "WhatsApp ऑर्डर",

    addressTitle: "फार्म पता",
    addressLine1: "SriChakra Farm, (आपका गाँव/एरिया)",
    addressLine2: "जिला, राज्य, भारत — PIN",
    map: "मैप खोलें",

    footer: "© SriChakra Farm",
  },
};

export default function HomePage() {
  const { lang } = useLanguage();
  const t = TEXT[lang] ?? TEXT.en;

  // ✅ Put your real WhatsApp/Call number here (digits only with country code)
  // Example India: 91XXXXXXXXXX -> "9198XXXXXXXX"
  const phoneDigits = "919403443524"; // <-- change this
  const telLink = `tel:+${phoneDigits}`;
  const waLink = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    "Hi, I want to place an order from SriChakra Farm."
  )}`;

  // Put your real Google Maps link here later
  const mapLink = "https://www.google.com/maps";

  // ✅ Hero background must be /public/home_page2.jpeg
  const HERO_BG = "/home_page2.jpeg";

  // ✅ Gallery images (skip home_page2 because used in hero)
  const GALLERY = [
    "/home_page1.jpeg",
    "/home_page3.jpeg",
    "/home_page4.jpeg",
    "/home_page5.jpeg",
    "/home_page6.jpeg",
    "/home_page7.jpeg",
    "/home_page8.jpeg",
    "/home_page9.jpeg",
    "/home_page10.jpeg",
    "/home_page11.jpeg",
  ];

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader />

      <div className="mx-auto max-w-md px-4 py-4 space-y-4">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div
            className="h-52 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_BG}')` }}
          />
          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="text-white">
              <div className="text-2xl font-extrabold tracking-tight">
                SriChakra Farm
              </div>
              <div className="mt-1 text-sm text-white/90">{t.subtitle}</div>
            </div>
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-4">
          <div className="text-base font-extrabold text-gray-900">
            {t.categoriesTitle}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <CategoryCard href="/fish" title={t.fish} img="/fish.jpg" />
            <CategoryCard href="/sheep" title={t.sheep} img="/sheep.jpg" />
            <CategoryCard href="/vegetables" title={t.veg} img="/vegetables.jpg" />
          </div>
        </section>

        

        {/* FARM IMAGE GALLERY */}
        <section className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-4">
          <div className="text-base font-extrabold text-gray-900">
            {t.galleryTitle}
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {GALLERY.map((img) => (
              <div
                key={img}
                className="min-w-[170px] h-28 rounded-xl border border-gray-200 bg-gray-100 bg-cover bg-center shadow-sm"
                style={{ backgroundImage: `url('${img}')` }}
              />
            ))}
          </div>
        </section>

        {/* QUICK ORDER */}
        <section className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-4">
          <div className="text-base font-extrabold text-gray-900">
            {t.quickOrderTitle}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={telLink}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-white font-extrabold shadow-sm hover:brightness-95 transition"
            >
              📞 {t.call}
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white font-extrabold shadow-sm hover:brightness-95 transition"
            >
              💬 {t.wa}
            </a>
          </div>
        </section>

        {/* ADDRESS + MAP */}
        <section className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-4">
          <div className="text-base font-extrabold text-gray-900">
            {t.addressTitle}
          </div>

          <div className="mt-2 text-sm text-gray-700 leading-relaxed">
    <div>Kottala Village, Haliya Town</div>
    <div>Anumula Mandal, Nalgonda District</div>
    <div>Mobile: +91 9603437551, 9912921809</div>
    <div className="text-gray-600">Telangana – 508278</div>
  </div>

          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-extrabold text-gray-800 hover:bg-gray-100 transition"
          >
            📍 {t.map}
          </a>
        </section>

        {/* FOOTER */}
        <div className="py-2 text-center text-xs text-gray-500">{t.footer}</div>
      </div>
    </main>
  );
}

function CategoryCard({
  href,
  title,
  img,
}: {
  href: string;
  title: string;
  img: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow transition"
    >
      <div className="h-16 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }} />
      <div className="p-2 text-center text-xs font-extrabold text-gray-900 group-hover:text-emerald-700">
        {title}
      </div>
    </Link>
  );
}
