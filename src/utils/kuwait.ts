// Kuwait-specific utilities and configurations

// Kuwait governorates and areas
export const KUWAIT_GOVERNORATES = {
  'kuwait-city': {
    name: 'Kuwait City',
    nameAr: 'مدينة الكويت',
    areas: ['Sharq', 'Mirqab', 'Dasman', 'Salhiya', 'Bneid Al-Qar'],
    deliveryFee: 2.000,
    deliveryTime: '2-4 hours'
  },
  'hawalli': {
    name: 'Hawalli',
    nameAr: 'حولي',
    areas: ['Hawalli', 'Salmiya', 'Rumaithiya', 'Shaab', 'Jabriya'],
    deliveryFee: 2.500,
    deliveryTime: '3-5 hours'
  },
  'ahmadi': {
    name: 'Ahmadi',
    nameAr: 'الأحمدي',
    areas: ['Ahmadi', 'Fahaheel', 'Mangaf', 'Abu Halifa', 'Fintas'],
    deliveryFee: 3.000,
    deliveryTime: '4-6 hours'
  },
  'jahra': {
    name: 'Jahra',
    nameAr: 'الجهراء',
    areas: ['Jahra', 'Sulaibiya', 'Qasr', 'Naeem', 'Oyoun'],
    deliveryFee: 3.500,
    deliveryTime: '5-7 hours'
  },
  'mubarak-al-kabeer': {
    name: 'Mubarak Al-Kabeer',
    nameAr: 'مبارك الكبير',
    areas: ['Qurain', 'Adan', 'Qusour', 'Sabah Al-Salem', 'Mubarak Al-Kabeer'],
    deliveryFee: 3.000,
    deliveryTime: '4-6 hours'
  },
  'farwaniya': {
    name: 'Farwaniya',
    nameAr: 'الفروانية',
    areas: ['Farwaniya', 'Jleeb Al-Shuyoukh', 'Rabiya', 'Andalous', 'Ishbiliya'],
    deliveryFee: 2.500,
    deliveryTime: '3-5 hours'
  }
};

// Kuwait phone number validation
export const validateKuwaitPhone = (phone: string): boolean => {
  // Kuwait mobile numbers: +965 XXXX XXXX or +965 9XXX XXXX
  const kuwaitPhoneRegex = /^(\+965|965)?[569]\d{7}$/;
  const cleanPhone = phone.replace(/\s|-/g, '');
  return kuwaitPhoneRegex.test(cleanPhone);
};

// Format Kuwait phone number
export const formatKuwaitPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('965')) {
    return `+${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7)}`;
  }
  if (cleanPhone.length === 8) {
    return `+965 ${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4)}`;
  }
  return phone;
};

// Kuwait business hours
export const KUWAIT_BUSINESS_HOURS = {
  sunday: { open: '09:00', close: '22:00', isOpen: true },
  monday: { open: '09:00', close: '22:00', isOpen: true },
  tuesday: { open: '09:00', close: '22:00', isOpen: true },
  wednesday: { open: '09:00', close: '22:00', isOpen: true },
  thursday: { open: '09:00', close: '22:00', isOpen: true },
  friday: { open: '14:00', close: '22:00', isOpen: true }, // After Friday prayers
  saturday: { open: '09:00', close: '22:00', isOpen: true }
};

// Kuwait holidays (Islamic calendar - dates vary each year)
export const KUWAIT_HOLIDAYS = [
  'New Year\'s Day',
  'Liberation Day', // February 26
  'National Day', // February 25
  'Isra and Mi\'raj',
  'Ramadan begins',
  'Eid al-Fitr',
  'Arafat Day',
  'Eid al-Adha',
  'Islamic New Year',
  'Prophet Muhammad\'s Birthday'
];

// Check if current time is within business hours
export const isBusinessHours = (): boolean => {
  const now = new Date();
  const kuwaitTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kuwait"}));
  const day = kuwaitTime.toLocaleDateString('en-US', { weekday: 'lowercase' }) as keyof typeof KUWAIT_BUSINESS_HOURS;
  const currentTime = kuwaitTime.toTimeString().slice(0, 5);
  
  const businessDay = KUWAIT_BUSINESS_HOURS[day];
  if (!businessDay.isOpen) return false;
  
  return currentTime >= businessDay.open && currentTime <= businessDay.close;
};

// Get delivery fee for governorate
export const getDeliveryFee = (governorate: string): number => {
  const gov = KUWAIT_GOVERNORATES[governorate as keyof typeof KUWAIT_GOVERNORATES];
  return gov ? gov.deliveryFee : 5.000; // Default fee for unknown areas
};

// Get estimated delivery time
export const getDeliveryTime = (governorate: string): string => {
  const gov = KUWAIT_GOVERNORATES[governorate as keyof typeof KUWAIT_GOVERNORATES];
  return gov ? gov.deliveryTime : '6-8 hours'; // Default time for unknown areas
};

// Kuwait civil ID validation (placeholder - actual validation would be more complex)
export const validateCivilId = (civilId: string): boolean => {
  // Kuwait Civil ID is 12 digits
  const cleanId = civilId.replace(/\D/g, '');
  return cleanId.length === 12;
};

// Format Kuwait address
export interface KuwaitAddress {
  governorate: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  apartment?: string;
  additionalInfo?: string;
}

export const formatKuwaitAddress = (address: KuwaitAddress): string => {
  const parts = [
    address.building,
    address.street,
    `Block ${address.block}`,
    address.area,
    address.governorate
  ];
  
  if (address.floor) parts.splice(1, 0, `Floor ${address.floor}`);
  if (address.apartment) parts.splice(-1, 0, `Apt ${address.apartment}`);
  
  return parts.filter(Boolean).join(', ');
};