import type { Language, Region } from "./localization"

export interface EmergencyContact {
  id: string
  name: string
  number: string
  type: string
  available: string
  region: Region
  priority: "high" | "medium" | "low"
}

export const nationalEmergencyContacts: EmergencyContact[] = [
  {
    id: "ndma",
    name: "National Disaster Management Authority",
    number: "1078",
    type: "National Emergency",
    available: "24/7",
    region: "national",
    priority: "high",
  },
  {
    id: "police",
    name: "Police Helpline",
    number: "100",
    type: "Police Emergency",
    available: "24/7",
    region: "national",
    priority: "high",
  },
  {
    id: "fire",
    name: "Fire Brigade",
    number: "101",
    type: "Fire Emergency",
    available: "24/7",
    region: "national",
    priority: "high",
  },
  {
    id: "ambulance",
    name: "Ambulance Service",
    number: "108",
    type: "Medical Emergency",
    available: "24/7",
    region: "national",
    priority: "high",
  },
]

export const punjabEmergencyContacts: EmergencyContact[] = [
  {
    id: "punjab-disaster",
    name: "Punjab State Disaster Management Authority",
    number: "0172-2704090",
    type: "State Disaster Management",
    available: "24/7",
    region: "punjab",
    priority: "high",
  },
  {
    id: "punjab-police",
    name: "Punjab Police Control Room",
    number: "0172-2700000",
    type: "State Police",
    available: "24/7",
    region: "punjab",
    priority: "high",
  },
  {
    id: "punjab-flood",
    name: "Punjab Flood Control Room",
    number: "0172-2701234",
    type: "Flood Emergency",
    available: "Monsoon Season 24/7",
    region: "punjab",
    priority: "high",
  },
  {
    id: "chandigarh-admin",
    name: "Chandigarh Administration Emergency",
    number: "0172-2740000",
    type: "Regional Administration",
    available: "24/7",
    region: "punjab",
    priority: "medium",
  },
  {
    id: "punjab-health",
    name: "Punjab Health Emergency",
    number: "104",
    type: "Health Emergency",
    available: "24/7",
    region: "punjab",
    priority: "medium",
  },
]

export const getEmergencyContacts = (region: Region): EmergencyContact[] => {
  const contacts = [...nationalEmergencyContacts]

  if (region === "punjab") {
    contacts.push(...punjabEmergencyContacts)
  }

  return contacts.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

export const getLocalizedContactName = (contact: EmergencyContact, language: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    "National Disaster Management Authority": {
      en: "National Disaster Management Authority",
      hi: "राष्ट्रीय आपदा प्रबंधन प्राधिकरण",
      pa: "ਰਾਸ਼ਟਰੀ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਅਥਾਰਟੀ",
    },
    "Police Helpline": {
      en: "Police Helpline",
      hi: "पुलिस हेल्पलाइन",
      pa: "ਪੁਲਿਸ ਹੈਲਪਲਾਈਨ",
    },
    "Fire Brigade": {
      en: "Fire Brigade",
      hi: "फायर ब्रिगेड",
      pa: "ਫਾਇਰ ਬ੍ਰਿਗੇਡ",
    },
    "Ambulance Service": {
      en: "Ambulance Service",
      hi: "एम्बुलेंस सेवा",
      pa: "ਐਂਬੂਲੈਂਸ ਸੇਵਾ",
    },
    "Punjab State Disaster Management Authority": {
      en: "Punjab State Disaster Management Authority",
      hi: "पंजाब राज्य आपदा प्रबंधन प्राधिकरण",
      pa: "ਪੰਜਾਬ ਰਾਜ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਅਥਾਰਟੀ",
    },
    "Punjab Police Control Room": {
      en: "Punjab Police Control Room",
      hi: "पंजाब पुलिस कंट्रोल रूम",
      pa: "ਪੰਜਾਬ ਪੁਲਿਸ ਕੰਟਰੋਲ ਰੂਮ",
    },
    "Punjab Flood Control Room": {
      en: "Punjab Flood Control Room",
      hi: "पंजाब बाढ़ नियंत्रण कक्ष",
      pa: "ਪੰਜਾਬ ਹੜ੍ਹ ਕੰਟਰੋਲ ਰੂਮ",
    },
  }

  return translations[contact.name]?.[language] || contact.name
}
