import type { Region, Language } from "./localization"

export interface RegionalDisaster {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  region: Region
  title: Record<Language, string>
  description: Record<Language, string>
  preparationTips: Record<Language, string[]>
  seasonality?: string
  frequency: string
}

export const regionalDisasters: RegionalDisaster[] = [
  {
    id: "punjab-flood",
    type: "flood",
    severity: "high",
    region: "punjab",
    title: {
      en: "Monsoon Flooding",
      hi: "मानसूनी बाढ़",
      pa: "ਮਾਨਸੂਨ ਹੜ੍ਹ",
    },
    description: {
      en: "Heavy monsoon rains can cause severe flooding in Punjab's river systems",
      hi: "भारी मानसूनी बारिश पंजाब की नदी प्रणालियों में गंभीर बाढ़ का कारण बन सकती है",
      pa: "ਭਾਰੀ ਮਾਨਸੂਨ ਬਾਰਿਸ਼ ਪੰਜਾਬ ਦੇ ਦਰਿਆਈ ਸਿਸਟਮ ਵਿੱਚ ਗੰਭੀਰ ਹੜ੍ਹ ਦਾ ਕਾਰਨ ਬਣ ਸਕਦੀ ਹੈ",
    },
    preparationTips: {
      en: [
        "Keep emergency supplies on higher floors",
        "Know evacuation routes to higher ground",
        "Monitor weather alerts regularly",
        "Prepare waterproof document storage",
      ],
      hi: [
        "आपातकालीन आपूर्ति को ऊंची मंजिलों पर रखें",
        "ऊंचे स्थान पर निकासी मार्गों को जानें",
        "मौसम चेतावनियों की नियमित निगरानी करें",
        "वाटरप्रूफ दस्तावेज़ भंडारण तैयार करें",
      ],
      pa: [
        "ਐਮਰਜੈਂਸੀ ਸਪਲਾਈ ਨੂੰ ਉੱਚੀਆਂ ਮੰਜ਼ਿਲਾਂ 'ਤੇ ਰੱਖੋ",
        "ਉੱਚੇ ਸਥਾਨ ਲਈ ਨਿਕਾਸ ਰਸਤੇ ਜਾਣੋ",
        "ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ ਦੀ ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ ਕਰੋ",
        "ਵਾਟਰਪ੍ਰੂਫ ਦਸਤਾਵੇਜ਼ ਸਟੋਰੇਜ ਤਿਆਰ ਕਰੋ",
      ],
    },
    seasonality: "June-September",
    frequency: "Annual",
  },
  {
    id: "punjab-earthquake",
    type: "earthquake",
    severity: "medium",
    region: "punjab",
    title: {
      en: "Seismic Activity",
      hi: "भूकंपीय गतिविधि",
      pa: "ਭੂਚਾਲ ਗਤੀਵਿਧੀ",
    },
    description: {
      en: "Punjab lies in seismic zones II-III with moderate earthquake risk",
      hi: "पंजाब भूकंपीय क्षेत्र II-III में स्थित है जहाँ मध्यम भूकंप जोखिम है",
      pa: "ਪੰਜਾਬ ਭੂਚਾਲ ਖੇਤਰ II-III ਵਿੱਚ ਸਥਿਤ ਹੈ ਜਿੱਥੇ ਮੱਧਮ ਭੂਚਾਲ ਜੋਖਮ ਹੈ",
    },
    preparationTips: {
      en: [
        "Secure heavy furniture and appliances",
        "Practice drop, cover, and hold drills",
        "Keep emergency kits accessible",
        "Know safe spots in each room",
      ],
      hi: [
        "भारी फर्नीचर और उपकरणों को सुरक्षित करें",
        "ड्रॉप, कवर और होल्ड अभ्यास करें",
        "आपातकालीन किट को सुलभ रखें",
        "हर कमरे में सुरक्षित स्थान जानें",
      ],
      pa: [
        "ਭਾਰੀ ਫਰਨੀਚਰ ਅਤੇ ਉਪਕਰਣਾਂ ਨੂੰ ਸੁਰੱਖਿਤ ਕਰੋ",
        "ਡ੍ਰਾਪ, ਕਵਰ ਅਤੇ ਹੋਲਡ ਅਭਿਆਸ ਕਰੋ",
        "ਐਮਰਜੈਂਸੀ ਕਿੱਟ ਨੂੰ ਪਹੁੰਚਯੋਗ ਰੱਖੋ",
        "ਹਰ ਕਮਰੇ ਵਿੱਚ ਸੁਰੱਖਿਤ ਸਥਾਨ ਜਾਣੋ",
      ],
    },
    frequency: "Occasional",
  },
  {
    id: "punjab-heatwave",
    type: "heatwave",
    severity: "high",
    region: "punjab",
    title: {
      en: "Extreme Heat Waves",
      hi: "अत्यधिक गर्मी की लहरें",
      pa: "ਅਤਿਅੰਤ ਗਰਮੀ ਦੀਆਂ ਲਹਿਰਾਂ",
    },
    description: {
      en: "Punjab experiences severe heat waves with temperatures exceeding 45°C",
      hi: "पंजाब में 45°C से अधिक तापमान के साथ गंभीर गर्मी की लहरें आती हैं",
      pa: "ਪੰਜਾਬ ਵਿੱਚ 45°C ਤੋਂ ਵੱਧ ਤਾਪਮਾਨ ਦੇ ਨਾਲ ਗੰਭੀਰ ਗਰਮੀ ਦੀਆਂ ਲਹਿਰਾਂ ਆਉਂਦੀਆਂ ਹਨ",
    },
    preparationTips: {
      en: [
        "Stay indoors during peak hours (11 AM - 4 PM)",
        "Drink plenty of water regularly",
        "Wear light-colored, loose clothing",
        "Use cooling measures like wet cloths",
      ],
      hi: [
        "चरम घंटों (11 AM - 4 PM) के दौरान घर के अंदर रहें",
        "नियमित रूप से पर्याप्त पानी पिएं",
        "हल्के रंग के, ढीले कपड़े पहनें",
        "गीले कपड़े जैसे शीतलन उपायों का उपयोग करें",
      ],
      pa: [
        "ਸਿਖਰ ਘੰਟਿਆਂ (11 AM - 4 PM) ਦੌਰਾਨ ਘਰ ਦੇ ਅੰਦਰ ਰਹੋ",
        "ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਕਾਫੀ ਪਾਣੀ ਪੀਓ",
        "ਹਲਕੇ ਰੰਗ ਦੇ, ਢਿੱਲੇ ਕੱਪੜੇ ਪਹਿਨੋ",
        "ਗਿੱਲੇ ਕੱਪੜੇ ਵਰਗੇ ਠੰਢਕ ਦੇ ਉਪਾਅ ਵਰਤੋ",
      ],
    },
    seasonality: "April-June",
    frequency: "Annual",
  },
]

export const getRegionalDisasters = (region: Region): RegionalDisaster[] => {
  return regionalDisasters.filter((disaster) => disaster.region === region || disaster.region === "national")
}

export const getDisasterByType = (type: string, region: Region): RegionalDisaster | undefined => {
  return regionalDisasters.find((disaster) => disaster.type === type && disaster.region === region)
}
