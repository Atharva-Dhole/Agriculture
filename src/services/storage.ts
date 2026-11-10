/**
 * Local Offline Storage and Seed Data Manager for Krishi Mitra
 */

import { 
  FarmerProfile, 
  Crop, 
  FarmActivity, 
  SoilReport, 
  GovtScheme, 
  OutbreakAlert, 
  MandiPriceItem, 
  SmartReminder, 
  DiseaseDiagnosisResult,
  Language 
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'krishi_profile',
  CROPS: 'krishi_crops',
  ACTIVITIES: 'krishi_activities',
  SOIL_REPORTS: 'krishi_soil_reports',
  SCHEMES: 'krishi_schemes',
  OUTBREAKS: 'krishi_outbreaks',
  REMINDERS: 'krishi_reminders',
  DIAGNOSIS_HISTORY: 'krishi_diagnosis_history',
  LANGUAGE: 'krishi_lang',
  SAVED_WEATHER: 'krishi_saved_weather'
};

// Initial Seed Profile
const DEFAULT_PROFILE: FarmerProfile = {
  name: 'ज्ञानेश्वर तुकाराम पाटील (Dnyaneshwar Patil)',
  mobile: '9822012345',
  village: 'शिऊर (Shiur)',
  taluka: 'वैजापूर (Vaijapur)',
  district: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
  state: 'महाराष्ट्र (Maharashtra)',
  preferredLanguage: 'mr',
  landArea: 4.5,
  landUnit: 'acre',
  soilType: 'black_cotton',
  irrigationFacility: 'drip',
  mainCrops: ['सोयाबीन (Soybean)', 'कापूस (Cotton)', 'कांदा (Onion)'],
  photoUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=300',
  registrationDate: '2026-06-15',
  onboardingCompleted: true
};

// Initial Seed Crops
const DEFAULT_CROPS: Crop[] = [
  {
    id: 'crop-1',
    name: 'Soybean',
    nameMarathi: 'सोयाबीन (JS 335)',
    variety: 'JS 335',
    sowingDate: '2026-06-22',
    landArea: 2.5,
    landUnit: 'acre',
    soilType: 'काळी कसदार (Black Cotton)',
    irrigationType: 'ठिबक सिंचन (Drip)',
    expectedHarvestDate: '2026-10-10',
    stage: 'pod_formation',
    healthStatus: 'healthy',
    notes: 'शेंगा भरण्याची अवस्था. सध्या पानांवर कोणताही कीड प्रादुर्भाव नाही. दोन दिवसांपूर्वी ०:५२:३४ फवारले.',
    photoUrl: 'https://images.unsplash.com/photo-1599818816934-2e924b80b080?auto=format&fit=crop&q=80&w=400',
    createdAt: '2026-06-22'
  },
  {
    id: 'crop-2',
    name: 'Cotton',
    nameMarathi: 'कापूस (बीटी कॉटन)',
    variety: 'राशी ६५९ (Rasi 659)',
    sowingDate: '2026-06-18',
    landArea: 1.5,
    landUnit: 'acre',
    soilType: 'काळी मध्यम (Medium Black)',
    irrigationType: 'तुषार सिंचन (Sprinkler)',
    expectedHarvestDate: '2026-11-25',
    stage: 'flowering',
    healthStatus: 'pest_alert',
    notes: 'बोंड भरण्याची व फुलधारणा अवस्था. काही झाडांवर पांढऱ्या माशीचा किरकोळ प्रादुर्भाव दिसला. निम अर्क फवारायचे आहे.',
    photoUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=400',
    createdAt: '2026-06-18'
  },
  {
    id: 'crop-3',
    name: 'Onion',
    nameMarathi: 'लाल कांदा (फुले समर्थ)',
    variety: 'फुले समर्थ (Phule Samarth)',
    sowingDate: '2026-08-05',
    landArea: 0.5,
    landUnit: 'acre',
    soilType: 'पोयटा माती (Loamy)',
    irrigationType: 'ठिबक सिंचन (Drip)',
    expectedHarvestDate: '2026-12-01',
    stage: 'vegetative',
    healthStatus: 'healthy',
    notes: 'पुनर्लागवड उत्तम झाली. पहिली खुरपणी पूर्ण.',
    photoUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=400',
    createdAt: '2026-08-05'
  }
];

// Initial Seed Farm Activities (Ledger)
const DEFAULT_ACTIVITIES: FarmActivity[] = [
  {
    id: 'act-1',
    cropName: 'सोयाबीन (JS 335)',
    activityType: 'fertilizer',
    date: '2026-07-28',
    description: '१९:१९:१९ विद्राव्य खत फवारणी आणि सूक्ष्म अन्नद्रव्ये',
    cost: 1450,
    income: 0
  },
  {
    id: 'act-2',
    cropName: 'कापूस (बीटी कॉटन)',
    activityType: 'pesticide',
    date: '2026-08-12',
    description: '५% निंबोळी अर्क आणि चिकट सापळे बसविले (१५ नग)',
    cost: 850,
    income: 0
  },
  {
    id: 'act-3',
    cropName: 'कांदा (फुले समर्थ)',
    activityType: 'sowing',
    date: '2026-08-05',
    description: 'कांदा रोपांची पुनर्लागवड (मजुरी खर्च व रोपे)',
    cost: 4200,
    income: 0
  },
  {
    id: 'act-4',
    cropName: 'मागील हंगाम गहू',
    activityType: 'sale',
    date: '2026-05-10',
    description: 'लासलगाव बाजार समितीत २५ क्विंटल गहू विक्री',
    cost: 0,
    income: 68750
  }
];

// Initial Seed Reminders
const DEFAULT_REMINDERS: SmartReminder[] = [
  {
    id: 'rem-1',
    cropName: 'सोयाबीन (JS 335)',
    title: 'ठिबक सिंचनाद्वारे पाणी देणे',
    titleMarathi: 'ठिबक सिंचनाद्वारे ३ तास पाणी देणे व ओलावा तपासणे',
    category: 'irrigation',
    dateTime: '2026-08-18T08:00',
    completed: false,
    notes: 'शेंगांमध्ये दाणे भरत असल्याने पाण्याचा ताण पडू देऊ नका.'
  },
  {
    id: 'rem-2',
    cropName: 'कापूस (बीटी कॉटन)',
    title: 'कामगंध सापळे तपासणे (बोंडअळी)',
    titleMarathi: 'कामगंध सापळ्यांमधील पतंगांची मोजणी करणे',
    category: 'pesticide',
    dateTime: '2026-08-19T10:30',
    completed: false,
    notes: 'सलग ३ दिवस प्रति सापळा ८ पेक्षा जास्त पतंग आढळल्यास फवारणी करावी.'
  },
  {
    id: 'rem-3',
    title: 'पीएम किसान ई-केवायसी अंतिम मुदत',
    titleMarathi: 'नमो शेतकरी महासन्मान निधी ई-केवायसी तपासणी',
    category: 'scheme',
    dateTime: '2026-08-25T12:00',
    completed: true,
    notes: 'पुढील हप्ता जमा होण्यासाठी आधार लिंक असणे आवश्यक आहे.'
  }
];

// Initial Seed Outbreak Alerts across Maharashtra
const DEFAULT_OUTBREAKS: OutbreakAlert[] = [
  {
    id: 'out-1',
    district: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
    taluka: 'गंगापूर व वैजापूर',
    village: 'परिसरातील गावे',
    crop: 'Cotton',
    cropMarathi: 'कापूस',
    pestOrDisease: 'पांढरी माशी व रसशोषक कीड (Whitefly)',
    pestOrDiseaseMarathi: 'पांढरी माशी व मावा किडीचा वाढता प्रादुर्भाव',
    reportedDate: '2026-08-14',
    severity: 'medium',
    verified: true,
    precautions: 'पानाच्या खाली निंबोळी अर्क ५% किंवा व्हर्टिसिलियम लेकॅनी ५ ग्रॅम/लिटर फवारावे. युरियाचा अतिरेक टाळावा.',
    precautionsMarathi: 'पानाच्या खाली निंबोळी अर्क ५% किंवा व्हर्टिसिलियम लेकॅनी ५ ग्रॅम/लिटर फवारावे. युरियाचा अतिरेक टाळावा.',
    reportCount: 12
  },
  {
    id: 'out-2',
    district: 'नाशिक (Nashik)',
    taluka: 'निफाड, येवला व चांदवड',
    village: 'लासलगाव परिसर',
    crop: 'Onion',
    cropMarathi: 'कांदा',
    pestOrDisease: 'जांभळा करपा (Purple Blotch)',
    pestOrDiseaseMarathi: 'ढगाळ वातावरणामुळे जांभळा करपा रोगाचा इशारा',
    reportedDate: '2026-08-12',
    severity: 'high',
    verified: true,
    precautions: 'पावसाची उघडीप मिळताच मॅन्कोझेब ७५% डब्ल्यूपी @ २.५ ग्रॅम + स्टिकर १ मिली प्रति लिटर पाण्यात मिसळून फवारावे.',
    precautionsMarathi: 'पावसाची उघडीप मिळताच मॅन्कोझेब ७५% डब्ल्यूपी @ २.५ ग्रॅम + स्टिकर १ मिली प्रति लिटर पाण्यात मिसळून फवारावे.',
    reportCount: 28
  },
  {
    id: 'out-3',
    district: 'लातूर व नांदेड (Latur & Nanded)',
    taluka: 'रेणापूर, अहमदपूर',
    village: 'विविध गावे',
    crop: 'Soybean',
    cropMarathi: 'सोयाबीन',
    pestOrDisease: 'खोडकीड व चक्रीभुंगा (Girdle Beetle)',
    pestOrDiseaseMarathi: 'चक्रीभुंगा व पाने खाणाऱ्या अळ्यांची लक्षणे',
    reportedDate: '2026-08-10',
    severity: 'medium',
    verified: true,
    precautions: 'प्रादुर्भावग्रस्त पाने किंवा देठ तोडून नष्ट करावेत. गरज भासल्यास थायामेथोक्साम १२.६% + लॅम्बडा सायहेलोथ्रीन ९.५% झेडसी @ ३ मिली प्रति १० लिटर फवारावे.',
    precautionsMarathi: 'प्रादुर्भावग्रस्त पाने किंवा देठ तोडून नष्ट करावेत. गरज भासल्यास कीटकनाशकाची शिफारशीनुसार फवारणी करावी.',
    reportCount: 19
  }
];

// Initial Seed Government Schemes
const DEFAULT_SCHEMES: GovtScheme[] = [
  {
    id: 'scheme-namo-shetkari',
    name: 'Namo Shetkari Mahasanman Nidhi Yojana',
    nameMarathi: 'नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र)',
    category: 'financial',
    department: 'कृषी विभाग, महाराष्ट्र शासन',
    description: 'Maharashtra state scheme providing ₹6,000 additional financial assistance annually to eligible farmers, supplementing PM-KISAN to total ₹12,000 per year.',
    descriptionMarathi: 'महाराष्ट्र शासनाची विशेष योजना. केंद्र शासनाच्या पीएम-किसान योजनेच्या ₹६,००० शिवाय राज्य शासनाकडून अतिरिक्त ₹६,००० प्रति वर्ष (एकूण ₹१२,०००) थेट बँक खात्यात.',
    eligibility: [
      'Beneficiary of PM-KISAN in Maharashtra',
      'Valid Aadhaar-linked active bank account',
      'Cultivable land registered under 7/12 extract in Maharashtra'
    ],
    eligibilityMarathi: [
      'पीएम-किसान योजनेचे पात्र लाभार्थी शेतकरी',
      'आधार संलग्न बँक खाते (e-KYC पूर्ण)',
      'महाराष्ट्रातील ७/१२ व ८-अ वर स्वतःच्या नावे शेतजमीन'
    ],
    benefits: '₹6,000 per year in 3 installments of ₹2,000 each deposited directly via DBT.',
    benefitsMarathi: 'वार्षिक ₹६,००० तीन हप्त्यांमध्ये (प्रत्येकी ₹२,०००) थेट बँक खात्यात जमा.',
    requiredDocuments: ['Aadhaar Card', '7/12 & 8-A Extract', 'Bank Passbook', 'PM-KISAN Registration ID'],
    requiredDocumentsMarathi: ['आधार कार्ड', '७/१२ आणि ८-अ उतारा', 'बँक पासबुक झेरॉक्स', 'पीएम-किसान नोंदणी क्रमांक'],
    applicationProcess: [
      'Auto-enrolled for PM-KISAN beneficiaries in Maharashtra',
      'Verify status on MahaDBT or pmkisan.gov.in',
      'Ensure land seeding is marked Yes with Taluka Agriculture Officer'
    ],
    applicationProcessMarathi: [
      'पीएम-किसान लाभार्थ्यांची स्वयंचलित नोंदणी',
      'MahaDBT किंवा pmkisan.gov.in वर स्थिती तपासा',
      'तालुका कृषी कार्यालयात जमीन नोंदी (Land Seeding) पूर्ण असल्याची खात्री करा'
    ],
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    status: 'applied'
  },
  {
    id: 'scheme-pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (₹1 Crop Insurance)',
    nameMarathi: 'सर्वसमावेशक प्रधानमंत्री पीक विमा योजना (१ रुपयात पीक विमा)',
    category: 'insurance',
    department: 'कृषी व शेतकरी कल्याण मंत्रालय',
    description: 'In Maharashtra, farmers can insure their crops by paying just ₹1 token premium, with state and central govt paying the rest against drought, heavy rains, flood, or pest damage.',
    descriptionMarathi: 'महाराष्ट्रात केवळ ₹१ नाममात्र शुल्कात खरीप व रब्बी पिकांना विमा संरक्षण. अतिवृष्टी, दुष्काळ, पूर किंवा किडीमुळे पिकांचे नुकसान झाल्यास आर्थिक भरपाई.',
    eligibility: [
      'All landholder and tenant farmers growing notified crops in notified areas',
      'Valid sowing certificate or self-declaration'
    ],
    eligibilityMarathi: [
      'अधिसूचित क्षेत्रातील अधिसूचित पिके घेणारे सर्व खातेदार व भाडेकरू शेतकरी',
      'सध्याच्या हंगामातील पीक पेरणी नोंद (ई-पीक पाहणी)'
    ],
    benefits: 'Comprehensive financial compensation up to insured sum per acre during crop loss.',
    benefitsMarathi: 'नुकसानीच्या प्रमाणात प्रति एकर विहित विमा संरक्षित रकमेची थेट बँक खात्यात भरपाई.',
    requiredDocuments: ['7/12 Extract with e-Peek Pahani', 'Aadhaar Card', 'Bank Passbook', 'Crop Sowing Declaration'],
    requiredDocumentsMarathi: ['ई-पीक पाहणीसह ७/१२ उतारा', 'आधार कार्ड', 'बँक पासबुक', 'पेरणी स्वयंघोषणापत्र'],
    applicationProcess: [
      'Visit nearest CSC (Aaple Sarkar Seva Kendra) or pmfby.gov.in',
      'Submit crop details and pay token ₹1',
      'Collect official policy receipt'
    ],
    applicationProcessMarathi: [
      'जवळच्या "आपले सरकार" सेवा केंद्र किंवा pmfby.gov.in वर भेट द्या',
      'पिकाचा तपशील देऊन ₹१ भरा आणि अधिकृत पावती घ्या'
    ],
    officialUrl: 'https://pmfby.gov.in',
    status: 'applied'
  },
  {
    id: 'scheme-magel-tyala-shettale',
    name: 'Magel Tyala Shettale (Farm Pond on Demand)',
    nameMarathi: 'मागेल त्याला शेततळे योजना (महाराष्ट्र शासन)',
    category: 'irrigation',
    department: 'मृद व जलसंधारण विभाग, महाराष्ट्र',
    description: 'Permanent water harvesting solution providing up to ₹75,000 direct subsidy to construct an on-farm plastic lined water pond.',
    descriptionMarathi: 'शेतकऱ्यांना दुष्काळावर मात करण्यासाठी शेतात संरक्षित पाण्याचा साठा निर्माण करण्याकरिता ₹७५,००० पर्यंत थेट शासकीय अनुदान.',
    eligibility: [
      'Farmer with minimum 0.60 hectare cultivable land in Maharashtra',
      'Must have suitable site for water catchment'
    ],
    eligibilityMarathi: [
      'किमान ०.६० हेक्टर (१.५ एकर) जमीन असणारे शेतकरी',
      'शेततळ्यासाठी शेतात योग्य जागा उपलब्ध असणे आवश्यक'
    ],
    benefits: 'Subsidy up to ₹50,000 for earthwork + ₹25,000 for plastic film lining.',
    benefitsMarathi: 'खोदकामासाठी ₹५०,००० व प्लास्टिक अस्तरीकरणासाठी ₹२५,००० पर्यंत थेट बँक खात्यात अनुदान.',
    requiredDocuments: ['7/12 and 8-A', 'Caste Certificate (if applicable)', 'Site sketch map', 'Bank details'],
    requiredDocumentsMarathi: ['७/१२ आणि ८-अ उतारा', 'जातीचे प्रमाणपत्र (लागू असल्यास)', 'जागेचा नकाशा', 'बँक तपशील'],
    applicationProcess: [
      'Apply online on MahaDBT Farmer Portal under Soil & Water Conservation tab',
      'Get administrative approval from Taluka Agriculture Officer',
      'Complete digging and upload geo-tagged photo for DBT release'
    ],
    applicationProcessMarathi: [
      'MahaDBT पोर्टलवर "मृद व जलसंधारण" अंतर्गत ऑनलाइन अर्ज करा',
      'तालुका कृषी अधिकाऱ्यांकडून पूर्वसंमती मिळवा',
      'काम पूर्ण झाल्यावर जिओ-टॅग फोटो अपलोड करून अनुदान मिळवा'
    ],
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    status: 'interested'
  },
  {
    id: 'scheme-drip-sprinkler',
    name: 'PM Krishi Sinchayee Yojana (Micro Irrigation Subsidy)',
    nameMarathi: 'सूक्ष्म सिंचन योजना (ठिबक व तुषार सिंचन ८०% अनुदान)',
    category: 'irrigation',
    department: 'कृषी विभाग, महाराष्ट्र शासन',
    description: 'Subsidies up to 80% for small & marginal farmers and up to 75% for other farmers to install certified drip and sprinkler irrigation systems.',
    descriptionMarathi: 'अल्प व अत्यल्प भूधारक शेतकऱ्यांना ८०% आणि इतर शेतकऱ्यांना ७५% पर्यंत ठिबक व तुषार संच बसविण्यासाठी अनुदान.',
    eligibility: ['Own agricultural land with an assured water source (Well, Borewell, Canal)'],
    eligibilityMarathi: ['स्वतःची शेतजमीन व शाश्वत पाण्याचा स्त्रोत (विहीर, बोअरवेल, नदी किंवा शेततळे) उपलब्ध असणे'],
    benefits: 'Direct financial subsidy credited to farmer/authorized dealer post GPS inspection.',
    benefitsMarathi: 'ठिबक/तुषार खरेदीवर ८० टक्क्यांपर्यंत थेट अनुदान.',
    requiredDocuments: ['7/12 Extract', 'Water source certificate', 'Aadhaar Card', 'Quotation from authorized dealer'],
    requiredDocumentsMarathi: ['७/१२ व ८-अ', 'पाणी उपलब्धतेचा दाखला', 'आधार कार्ड', 'नोंदणीकृत वितरकाचे कोटेशन'],
    applicationProcess: ['Apply on MahaDBT farmer portal under Micro Irrigation category.'],
    applicationProcessMarathi: ['महाडीबीटी पोर्टलवर सूक्ष्म सिंचन घटकांतर्गत ऑनलाइन अर्ज करा.'],
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    status: 'none'
  },
  {
    id: 'scheme-kcc',
    name: 'Kisan Credit Card (KCC) Low Interest Crop Loan',
    nameMarathi: 'किसान क्रेडिट कार्ड (KCC) - अल्प व्याजदर पीक कर्ज',
    category: 'finance',
    department: 'नाबार्ड व सर्व राष्ट्रीयीकृत / जिल्हा मध्यवर्ती सहकारी बँका',
    description: 'Subsidized crop loans up to ₹3,00,000 at effective 0% to 4% interest rate when repaid on time.',
    descriptionMarathi: 'शेतकऱ्यांना खते, बियाणे व मशागतीसाठी ₹३ लाखांपर्यंत अत्यल्प व्याजदरात (वेळेवर परतफेड केल्यास ०% ते ४% व्याज) खेळते पीक कर्ज.',
    eligibility: ['All individual landholder farmers, joint borrowers, tenant farmers, SHGs'],
    eligibilityMarathi: ['सर्व खातेदार शेतकरी, कुळ शेतकरी, शेतकरी गट'],
    benefits: 'Flexible revolving cash credit limit for 5 years with interest subvention.',
    benefitsMarathi: '५ वर्षांसाठी पत मर्यादा, वेळेवर परतफेड केल्यास व्याजात ३% सवलत.',
    requiredDocuments: ['Land 7/12 and 8A', 'Aadhaar Card', 'PAN Card', 'No Dues Certificate'],
    requiredDocumentsMarathi: ['७/१२ व ८-अ उतारा', 'आधार कार्ड', 'पॅन कार्ड', 'थकबाकी नसलेला दाखला'],
    applicationProcess: ['Submit standard KCC application form at your local bank branch.'],
    applicationProcessMarathi: ['आपल्या गावच्या राष्ट्रीयीकृत किंवा जिल्हा सहकारी बँकेत अर्ज दाखल करा.'],
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    status: 'applied'
  },
  {
    id: 'scheme-soil-health',
    name: 'Soil Health Card Scheme',
    nameMarathi: 'मृदा आरोग्य पत्रिका योजना (Soil Health Card)',
    category: 'soil',
    department: 'कृषी व शेतकरी कल्याण मंत्रालय',
    description: 'Free soil sample testing across 12 crucial parameters with tailored fertilizer advisories every 2 years.',
    descriptionMarathi: 'दर दोन वर्षांनी शेतकऱ्यांच्या शेतातील मातीचे १२ घटकांवर मोफत परीक्षण व योग्य खत मात्रांची पत्रिका.',
    eligibility: ['All farmers having agricultural land in India'],
    eligibilityMarathi: ['भारतातील सर्व शेतजमीन मालक शेतकरी'],
    benefits: 'Reduces unnecessary fertilizer costs by up to 25% and improves soil health.',
    benefitsMarathi: 'खतांचा अतिरिक्त खर्च २५% पर्यंत वाचतो आणि जमिनीची सुपीकता टिकून राहते.',
    requiredDocuments: ['Aadhaar Card', 'Land 7/12 details'],
    requiredDocumentsMarathi: ['आधार कार्ड', 'शेताचा गट क्रमांक'],
    applicationProcess: ['Hand over soil sample to village Krishi Sahayak or Taluka Soil Testing Lab.'],
    applicationProcessMarathi: ['गावच्या कृषी सहाय्यकांकडे मातीचा नमुना द्या किंवा तालुका माती चाचणी प्रयोगशाळेत जमा करा.'],
    officialUrl: 'https://soilhealth.dac.gov.in',
    status: 'none'
  }
];

// Initial Seed Soil Report
const DEFAULT_SOIL_REPORT: SoilReport = {
  id: 'soil-rep-1',
  farmerName: 'ज्ञानेश्वर तुकाराम पाटील',
  date: '2026-05-20',
  sampleLocation: 'गट क्र. १४२ (Gat No. 142) - वैजापूर',
  soilType: 'काळी कसदार (Black Cotton)',
  ph: 7.6,
  nitrogen: 185, // Low (Normal 280-560)
  phosphorus: 16.4, // Medium (Normal 10-25)
  potassium: 390, // High (Normal > 280)
  organicCarbon: 0.52, // Medium (0.50 - 0.75)
  electricalConductivity: 0.45, // Normal (< 1.0)
  fertilityRating: 'medium',
  fertilitySummary: 'Soil is slightly alkaline with high potassium reserves, medium phosphorus, and low nitrogen. Organic carbon needs improvement.',
  fertilitySummaryMarathi: 'जमीन किंचित चोपण (सामू ७.६), पालाश भरपूर आहे, स्फुरद मध्यम आणि नत्राची तीव्र कमतरता आहे. सेंद्रिय कर्ब वाढविणे गरजेचे आहे.',
  suitableCrops: ['सोयाबीन (Soybean)', 'कापूस (Cotton)', 'तूर (Pigeon Pea)', 'कांदा (Onion)', 'हरभरा (Gram)'],
  fertilizerPlan: {
    ureaKgPerAcre: 45,
    dapKgPerAcre: 50,
    mopKgPerAcre: 15,
    organicCompostTons: 3,
    guidance: 'Split nitrogen application: 50% at sowing, 50% at 30 days. High potassium in soil allows reducing MOP dosage by 30%. Add 3 tons of well-decomposed FYM.',
    guidanceMarathi: 'नत्राची विभागून मात्रा द्या: ५०% पेरणीवेळी आणि ५०% ३० दिवसांनी. जमिनीत पालाश भरपूर असल्याने एमओपी (पोटॅश) ३०% कमी द्यावा. एकरी ३ टन चांगले कुजलेले शेणखत वापरावे.'
  }
};

export const storageService = {
  // Profile
  getProfile(): FarmerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: FarmerProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // Language
  getLanguage(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (lang === 'en' || lang === 'mr') ? lang : 'mr';
    } catch {
      return 'mr';
    }
  },

  setLanguage(lang: Language): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // Crops
  getCrops(): Crop[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CROPS);
      return data ? JSON.parse(data) : DEFAULT_CROPS;
    } catch {
      return DEFAULT_CROPS;
    }
  },

  saveCrops(crops: Crop[]): void {
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
  },

  addCrop(crop: Omit<Crop, 'id' | 'createdAt'>): Crop {
    const crops = this.getCrops();
    const newCrop: Crop = {
      ...crop,
      id: `crop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    crops.unshift(newCrop);
    this.saveCrops(crops);
    return newCrop;
  },

  updateCrop(id: string, updates: Partial<Crop>): Crop | null {
    const crops = this.getCrops();
    const index = crops.findIndex(c => c.id === id);
    if (index === -1) return null;
    crops[index] = { ...crops[index], ...updates };
    this.saveCrops(crops);
    return crops[index];
  },

  deleteCrop(id: string): boolean {
    const crops = this.getCrops();
    const filtered = crops.filter(c => c.id !== id);
    this.saveCrops(filtered);
    return true;
  },

  // Farm Journey (Ledger)
  getActivities(): FarmActivity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : DEFAULT_ACTIVITIES;
    } catch {
      return DEFAULT_ACTIVITIES;
    }
  },

  addActivity(activity: Omit<FarmActivity, 'id'>): FarmActivity {
    const activities = this.getActivities();
    const newActivity: FarmActivity = {
      ...activity,
      id: `act-${Date.now()}`
    };
    activities.unshift(newActivity);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    return newActivity;
  },

  deleteActivity(id: string): boolean {
    const activities = this.getActivities();
    const filtered = activities.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filtered));
    return true;
  },

  // Reminders
  getReminders(): SmartReminder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  },

  saveReminders(reminders: SmartReminder[]): void {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  addReminder(reminder: Omit<SmartReminder, 'id'>): SmartReminder {
    const reminders = this.getReminders();
    const newReminder: SmartReminder = {
      ...reminder,
      id: `rem-${Date.now()}`
    };
    reminders.unshift(newReminder);
    this.saveReminders(reminders);
    return newReminder;
  },

  toggleReminder(id: string): void {
    const reminders = this.getReminders();
    const index = reminders.findIndex(r => r.id === id);
    if (index !== -1) {
      reminders[index].completed = !reminders[index].completed;
      this.saveReminders(reminders);
    }
  },

  deleteReminder(id: string): void {
    const reminders = this.getReminders();
    const filtered = reminders.filter(r => r.id !== id);
    this.saveReminders(filtered);
  },

  // Government Schemes
  getSchemes(): GovtScheme[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEMES);
      return data ? JSON.parse(data) : DEFAULT_SCHEMES;
    } catch {
      return DEFAULT_SCHEMES;
    }
  },

  updateSchemeStatus(id: string, status: 'interested' | 'applied' | 'none'): void {
    const schemes = this.getSchemes();
    const index = schemes.findIndex(s => s.id === id);
    if (index !== -1) {
      schemes[index].status = status;
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
    }
  },

  // Outbreak Alerts
  getOutbreaks(): OutbreakAlert[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OUTBREAKS);
      return data ? JSON.parse(data) : DEFAULT_OUTBREAKS;
    } catch {
      return DEFAULT_OUTBREAKS;
    }
  },

  addOutbreakReport(outbreak: Omit<OutbreakAlert, 'id' | 'reportedDate' | 'reportCount' | 'verified'>): OutbreakAlert {
    const outbreaks = this.getOutbreaks();
    const newOutbreak: OutbreakAlert = {
      ...outbreak,
      id: `out-${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0],
      reportCount: 1,
      verified: false
    };
    outbreaks.unshift(newOutbreak);
    localStorage.setItem(STORAGE_KEYS.OUTBREAKS, JSON.stringify(outbreaks));
    return newOutbreak;
  },

  // Soil Reports
  getSoilReports(): SoilReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOIL_REPORTS);
      return data ? JSON.parse(data) : [DEFAULT_SOIL_REPORT];
    } catch {
      return [DEFAULT_SOIL_REPORT];
    }
  },

  saveSoilReport(report: Omit<SoilReport, 'id'>): SoilReport {
    const reports = this.getSoilReports();
    const newReport: SoilReport = {
      ...report,
      id: `soil-${Date.now()}`
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(reports));
    return newReport;
  },

  // Diagnosis History
  getDiagnosisHistory(): DiseaseDiagnosisResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSIS_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDiagnosisResult(result: DiseaseDiagnosisResult): void {
    const history = this.getDiagnosisHistory();
    history.unshift(result);
    localStorage.setItem(STORAGE_KEYS.DIAGNOSIS_HISTORY, JSON.stringify(history.slice(0, 20)));
  },

  // Backup & Restore
  exportAllData(): string {
    const payload = {
      profile: this.getProfile(),
      crops: this.getCrops(),
      activities: this.getActivities(),
      reminders: this.getReminders(),
      soilReports: this.getSoilReports(),
      schemes: this.getSchemes(),
      outbreaks: this.getOutbreaks(),
      diagnosisHistory: this.getDiagnosisHistory(),
      exportedAt: new Date().toISOString(),
      app: 'Gramin Krishi Seva - Krishi Mitra'
    };
    return JSON.stringify(payload, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.crops) localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(data.crops));
      if (data.activities) localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data.activities));
      if (data.reminders) localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(data.reminders));
      if (data.soilReports) localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(data.soilReports));
      if (data.schemes) localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(data.schemes));
      if (data.outbreaks) localStorage.setItem(STORAGE_KEYS.OUTBREAKS, JSON.stringify(data.outbreaks));
      if (data.diagnosisHistory) localStorage.setItem(STORAGE_KEYS.DIAGNOSIS_HISTORY, JSON.stringify(data.diagnosisHistory));
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  },

  resetAllData(): void {
    localStorage.clear();
  }
};
