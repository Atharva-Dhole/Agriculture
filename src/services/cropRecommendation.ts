/**
 * Agricultural Crop Recommendation Engine
 * Based on ICAR and Maharashtra State Agricultural Universities (MPKV Rahuri & VNMKV Parbhani)
 */

import { CropRecommendationInput, RecommendedCropResult } from '../types';

interface CropAgronomicProfile {
  id: string;
  name: string;
  nameMarathi: string;
  category: 'Cash Crop' | 'Pulse' | 'Cereal' | 'Horticulture' | 'Oilseed';
  optimalN: [number, number]; // [min, max] kg/ha
  optimalP: [number, number];
  optimalK: [number, number];
  optimalPH: [number, number];
  preferredSeasons: Array<'kharif' | 'rabi' | 'zaid'>;
  waterNeed: 'Low' | 'Medium' | 'High';
  waterNeedMarathi: 'कमी' | 'मध्यम' | 'जास्त';
  durationDays: string;
  durationDaysMarathi: string;
  soilTypes: string[];
  soilGuideEn: string;
  soilGuideMr: string;
  climateGuideEn: string;
  climateGuideMr: string;
  cultivationGuideEn: string;
  cultivationGuideMr: string;
  fertilizerGuideEn: string;
  fertilizerGuideMr: string;
}

const AGRONOMIC_CROPS_DATABASE: CropAgronomicProfile[] = [
  {
    id: 'soybean',
    name: 'Soybean (सोयाबीन)',
    nameMarathi: 'सोयाबीन (Soybean - JS 335 / Phule Kimaya)',
    category: 'Oilseed',
    optimalN: [150, 300],
    optimalP: [12, 30],
    optimalK: [150, 350],
    optimalPH: [6.0, 7.8],
    preferredSeasons: ['kharif'],
    waterNeed: 'Medium',
    waterNeedMarathi: 'मध्यम',
    durationDays: '95 - 105 days',
    durationDaysMarathi: '९५ ते १०५ दिवस',
    soilTypes: ['black_cotton', 'loamy', 'alluvial'],
    soilGuideEn: 'Well-drained deep black cotton or medium fertile loam soils. Sensitive to waterlogging.',
    soilGuideMr: 'पाण्याचा चांगला निचरा होणारी मध्यम ते भारी काळी जमीन. जमिनीत पाणी साचून राहू नये.',
    climateGuideEn: 'Warm and moist climate. Requires 600-800 mm rainfall during crop season. Optimal temp 25-32°C.',
    climateGuideMr: 'उबदार व दमट हवामान. ६०० ते ८०० मिमी पाऊस व २५ ते ३२ अंश सेल्सिअस तापमान पोषक.',
    cultivationGuideEn: 'Row-to-row spacing 45 cm, plant-to-plant 5 cm. Seed treatment with Rhizobium and Trichoderma is essential.',
    cultivationGuideMr: 'दोन ओळींत ४५ सेमी व दोन रोपांत ५ सेमी अंतर. पेरणीपूर्वी रायझोबियम व ट्रायकोडर्माची बीजप्रक्रिया आवर्जून करावी.',
    fertilizerGuideEn: 'Apply 30:60:30 kg NPK per hectare at the time of sowing. Spray 19:19:19 at 35 days.',
    fertilizerGuideMr: 'पेरणीवेळी हेक्टरी ३०:६०:३० किलो नत्र, स्फुरद व पालाश द्यावे. ३५ दिवसांनी १९:१९:१९ ची फवारणी करावी.'
  },
  {
    id: 'cotton',
    name: 'Cotton (कापूस)',
    nameMarathi: 'कापूस / कपाशी (Bt Cotton)',
    category: 'Cash Crop',
    optimalN: [180, 350],
    optimalP: [15, 35],
    optimalK: [200, 450],
    optimalPH: [6.5, 8.2],
    preferredSeasons: ['kharif'],
    waterNeed: 'Medium',
    waterNeedMarathi: 'मध्यम',
    durationDays: '150 - 170 days',
    durationDaysMarathi: '१५० ते १७० दिवस',
    soilTypes: ['black_cotton', 'alluvial'],
    soilGuideEn: 'Deep black soils with high clay content and moisture retention capacity.',
    soilGuideMr: 'ओलावा टिकवून ठेवणारी खोल काळी भारी जमीन अत्यंत उपयुक्त.',
    climateGuideEn: 'Tropical and subtropical climate. Requires minimum 180 frost-free days with sunny weather during boll opening.',
    climateGuideMr: 'उष्ण व कोरडे हवामान. बोंडे फुटण्याच्या वेळी कडक ऊन व स्वच्छ आकाश हवे.',
    cultivationGuideEn: 'Spacing 4x1.5 or 5x1.5 feet for hybrid Bt cotton. Install pheromone traps by 45 days.',
    cultivationGuideMr: '४x१.५ किंवा ५x१.५ फूट अंतरावर लागवड. ४५ दिवसांनंतर एकरी ५ कामगंध सापळे लावावेत.',
    fertilizerGuideEn: '100:50:50 kg NPK per hectare in 3 split doses: at sowing, 30 days, and 60 days.',
    fertilizerGuideMr: '१००:५०:५० किलो नत्र, स्फुरद, पालाश हेक्टरी ३ हप्त्यांत: पेरणीवेळी, ३० दिवसांनी व ६० दिवसांनी.'
  },
  {
    id: 'onion',
    name: 'Onion (कांदा)',
    nameMarathi: 'कांदा (Onion - Phule Samarth / AgriFound)',
    category: 'Horticulture',
    optimalN: [150, 320],
    optimalP: [18, 40],
    optimalK: [180, 400],
    optimalPH: [6.0, 7.5],
    preferredSeasons: ['kharif', 'rabi', 'zaid'],
    waterNeed: 'Medium',
    waterNeedMarathi: 'मध्यम',
    durationDays: '110 - 130 days',
    durationDaysMarathi: '११० ते १३० दिवस',
    soilTypes: ['loamy', 'alluvial', 'red'],
    soilGuideEn: 'Rich loamy soil with high organic matter, good aeration, and free drainage.',
    soilGuideMr: 'सेंद्रिय कर्ब भरपूर असलेली हलकी ते मध्यम पोयटा माती. पाणी निचरा उत्तम हवा.',
    climateGuideEn: 'Cool season during early growth, dry and warm conditions during bulb maturity.',
    climateGuideMr: 'वाढीच्या काळात थंड हवामान व कांदे पोसण्याच्या काळात उबदार कोरडे हवामान.',
    cultivationGuideEn: 'Transplant 6-8 week old nursery seedlings at 15x10 cm spacing on raised beds.',
    cultivationGuideMr: 'गादी वाफ्यावर १५x१० सेमी अंतरावर पुनर्लागवड. ठिबक सिंचनाचा वापर फायदेशीर.',
    fertilizerGuideEn: '100:50:50 kg NPK per hectare + 20 kg Sulfur per hectare for pungency and storage life.',
    fertilizerGuideMr: '१००:५०:५० किलो एनपीके + २० किलो सल्फर (गंधक) प्रति हेक्टरी. गंधकामुळे टिकवणक्षमता वाढते.'
  },
  {
    id: 'tur_pigeonpea',
    name: 'Pigeon Pea / Tur (तूर)',
    nameMarathi: 'तूर (Pigeon Pea - BDN 711 / BSMR 736)',
    category: 'Pulse',
    optimalN: [120, 260],
    optimalP: [10, 28],
    optimalK: [140, 320],
    optimalPH: [6.5, 8.0],
    preferredSeasons: ['kharif'],
    waterNeed: 'Low',
    waterNeedMarathi: 'कमी',
    durationDays: '140 - 160 days',
    durationDaysMarathi: '१४० ते १६० दिवस',
    soilTypes: ['black_cotton', 'loamy', 'red'],
    soilGuideEn: 'Deep well-drained loams and black cotton soils with deep root penetration.',
    soilGuideMr: 'मुळांच्या खोल वाढीसाठी मध्यम ते भारी उत्तम निचऱ्याची जमीन.',
    climateGuideEn: 'Drought-tolerant leguminous crop, thrives in warm temperatures (20-35°C).',
    climateGuideMr: 'दुष्काळ सहन करणारे कडधान्य पीक. २० ते ३५ अंश सेल्सिअस तापमानात उत्तम येते.',
    cultivationGuideEn: 'Ideal for intercropping with Soybean (4:2 or 3:1 ratio) or Cotton. Nipping tips at 45 days increases branching.',
    cultivationGuideMr: 'सोयाबीनमध्ये आंतरपीक (४:२ किंवा ३:१) घेणे फायदेशीर. ४५ व्या दिवशी शेंडा खुडल्यास फांद्या वाढतात.',
    fertilizerGuideEn: 'Apply 25:50:0 kg NPK per hectare at sowing with Rhizobium seed inoculation.',
    fertilizerGuideMr: 'पेरणीवेळी २५:५०:० किलो नत्र व स्फुरद हेक्टरी द्यावे. रायझोबियम जीवाणू संवर्धन लावावे.'
  },
  {
    id: 'gram_chana',
    name: 'Chickpea / Gram (हरभरा)',
    nameMarathi: 'हरभरा (Chickpea - Digvijay / Vijay)',
    category: 'Pulse',
    optimalN: [120, 240],
    optimalP: [10, 25],
    optimalK: [140, 300],
    optimalPH: [6.2, 7.8],
    preferredSeasons: ['rabi'],
    waterNeed: 'Low',
    waterNeedMarathi: 'कमी',
    durationDays: '90 - 110 days',
    durationDaysMarathi: '९० ते ११० दिवस',
    soilTypes: ['black_cotton', 'loamy'],
    soilGuideEn: 'Medium to heavy soils with good moisture retention after monsoon.',
    soilGuideMr: 'पावसाळ्यानंतर ओलावा टिकवून ठेवणारी मध्यम ते भारी जमीन.',
    climateGuideEn: 'Cool and dry climate during vegetative phase; bright sunny days during grain filling.',
    climateGuideMr: 'थंड व कोरडे हवामान. दाणे भरताना स्वच्छ सूर्यप्रकाश आवश्यक.',
    cultivationGuideEn: 'Sowing from 15th October to 10th November. Seed treatment with Trichoderma prevents wilt.',
    cultivationGuideMr: '१५ ऑक्टोबर ते १० नोव्हेंबर दरम्यान पेरणी. मर रोगाच्या नियंत्रणासाठी ट्रायकोडर्माची बीजप्रक्रिया करा.',
    fertilizerGuideEn: '25:50:30 kg NPK per hectare. Foliar spray of 2% Urea at pod development.',
    fertilizerGuideMr: '२५:५०:३० किलो नत्र, स्फुरद व पालाश प्रति हेक्टरी. घाटे भरताना २% युरियाची फवारणी फायदेशीर.'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane (ऊस)',
    nameMarathi: 'ऊस (Sugarcane - Co 86032)',
    category: 'Cash Crop',
    optimalN: [220, 400],
    optimalP: [20, 45],
    optimalK: [250, 500],
    optimalPH: [6.5, 8.0],
    preferredSeasons: ['kharif', 'rabi', 'zaid'],
    waterNeed: 'High',
    waterNeedMarathi: 'जास्त',
    durationDays: '360 - 400 days',
    durationDaysMarathi: '३६० ते ४०० दिवस (वार्षिक)',
    soilTypes: ['black_cotton', 'alluvial', 'loamy'],
    soilGuideEn: 'Deep fertile soils with high organic matter, minimum 1 meter depth, assured irrigation.',
    soilGuideMr: 'किमान १ मीटर खोल, गाळाची किंवा काळी कसदार जमीन. बारमाही सिंचनाची शाश्वत सोय.',
    climateGuideEn: 'Tropical sunny climate with temperatures between 28-38°C.',
    climateGuideMr: 'उष्ण व दमट हवामान, मुबलक सूर्यप्रकाश.',
    cultivationGuideEn: 'Furrow planting at 4 to 5 feet spacing. Use single eye-bud seedlings for maximum tillers.',
    cultivationGuideMr: '४ ते ५ फूट पट्टा पद्धतीने लागवड. फुटव्यांच्या जास्त संख्येसाठी एक डोळा रोपांचा वापर करावा.',
    fertilizerGuideEn: '250:115:115 kg NPK per hectare in 4 splits. Regular zinc and iron supplementation.',
    fertilizerGuideMr: '२५०:११५:११५ किलो नत्र, स्फुरद, पालाश हेक्टरी ४ हप्त्यांत. चिलेटेड सूक्ष्म अन्नद्रव्यांचा वापर.'
  },
  {
    id: 'wheat',
    name: 'Wheat (गहू)',
    nameMarathi: 'गहू (Wheat - Lokwan / Phule Samadhan)',
    category: 'Cereal',
    optimalN: [180, 320],
    optimalP: [15, 35],
    optimalK: [180, 360],
    optimalPH: [6.0, 7.8],
    preferredSeasons: ['rabi'],
    waterNeed: 'Medium',
    waterNeedMarathi: 'मध्यम',
    durationDays: '105 - 120 days',
    durationDaysMarathi: '१०५ ते १२० दिवस',
    soilTypes: ['black_cotton', 'alluvial', 'loamy'],
    soilGuideEn: 'Fertile clay loams or black soils with good water storage capacity.',
    soilGuideMr: 'काळी भारी जमीन किंवा पाण्याचा चांगला निचरा होणारी पोयटा माती.',
    climateGuideEn: 'Cold winter conditions with optimum temperature of 15-22°C during vegetative stage.',
    climateGuideMr: 'हिवाळ्यातील कडाक्याची थंडी वाढीसाठी अनुकूल (१५ ते २२° से. तापमान).',
    cultivationGuideEn: 'Sowing from 1st to 15th November. Critical irrigation at CRI stage (21 days after sowing).',
    cultivationGuideMr: '१ ते १५ नोव्हेंबर दरम्यान वेळेवर पेरणी. पेरणीनंतर २१ व्या दिवशी मुकुट मुळे फुटतानाचे पाणी अत्यंत महत्त्वाचे.',
    fertilizerGuideEn: '120:60:40 kg NPK per hectare. Apply half N and all P & K at sowing, remaining half N at 21 days.',
    fertilizerGuideMr: '१२०:६०:४० किलो नत्र, स्फुरद, पालाश हेक्टरी. निम्मे नत्र व पूर्ण स्फुरद-पालाश पेरणीवेळी द्यावे.'
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate (डाळिंब)',
    nameMarathi: 'डाळिंब (Pomegranate - Bhagwa)',
    category: 'Horticulture',
    optimalN: [150, 280],
    optimalP: [12, 30],
    optimalK: [200, 420],
    optimalPH: [6.5, 8.2],
    preferredSeasons: ['kharif', 'zaid'],
    waterNeed: 'Medium',
    waterNeedMarathi: 'मध्यम',
    durationDays: 'Perennial (6 months per Bahar)',
    durationDaysMarathi: 'हंगामी बहार (१५० ते १८० दिवस)',
    soilTypes: ['loamy', 'red', 'sandy'],
    soilGuideEn: 'Light to medium well-drained loamy soils. Can tolerate slightly alkaline and gravelly soils.',
    soilGuideMr: 'हलकी ते मध्यम मुरमाड, पाण्याचा त्वरित निचरा होणारी जमीन. जमिनीत पाणी तुंबता कामा नये.',
    climateGuideEn: 'Semi-arid climate with hot and dry summers and mild winters.',
    climateGuideMr: 'उष्ण व कोरडा उन्हाळा आणि सौम्य हिवाळा डाळिंबाच्या गुणवत्तेसाठी उत्तम.',
    cultivationGuideEn: 'Planting at 14x10 feet. Select Mrig or Hasta Bahar depending on water availability.',
    cultivationGuideMr: '१४x१० फूट अंतरावर लागवड. पाण्याच्या उपलब्धतेनुसार मृग किंवा हस्त बहार धरावा.',
    fertilizerGuideEn: 'Balanced organic manure (20 kg FYM/plant) + drip fertigation based on leaf analysis.',
    fertilizerGuideMr: '२० किलो कुजलेले शेणखत प्रति झाड + ठिबकद्वारे विद्राव्य खतांचे नियमित नियोजन.'
  }
];

export const cropRecommendationService = {
  /**
   * Recommend crops based on soil nutrients, pH, season, and district
   */
  recommendCrops(input: CropRecommendationInput): RecommendedCropResult[] {
    const results: Array<{ crop: CropAgronomicProfile; score: number }> = [];

    const { nitrogen, phosphorus, potassium, ph, season, soilType } = input;

    for (const crop of AGRONOMIC_CROPS_DATABASE) {
      let score = 50; // Base score

      // 1. Season match (Major factor: 25 points)
      if (crop.preferredSeasons.includes(season)) {
        score += 25;
      } else {
        score -= 25; // Penalty for wrong season
      }

      // 2. Soil Type match (15 points)
      if (crop.soilTypes.includes(soilType)) {
        score += 15;
      }

      // 3. pH suitability (15 points)
      if (ph >= crop.optimalPH[0] && ph <= crop.optimalPH[1]) {
        score += 15;
      } else {
        const diff = Math.min(Math.abs(ph - crop.optimalPH[0]), Math.abs(ph - crop.optimalPH[1]));
        score -= Math.min(15, diff * 10);
      }

      // 4. Nitrogen match (10 points)
      if (nitrogen >= crop.optimalN[0] && nitrogen <= crop.optimalN[1]) {
        score += 10;
      } else if (nitrogen < crop.optimalN[0]) {
        score += 5; // Can be supplemented with fertilizer
      }

      // 5. Phosphorus match (10 points)
      if (phosphorus >= crop.optimalP[0] && phosphorus <= crop.optimalP[1]) {
        score += 10;
      } else {
        score += 4;
      }

      // 6. Potassium match (10 points)
      if (potassium >= crop.optimalK[0] && potassium <= crop.optimalK[1]) {
        score += 10;
      } else {
        score += 4;
      }

      // Clamp between 20 and 98
      const finalScore = Math.max(20, Math.min(98, Math.round(score)));
      results.push({ crop, score: finalScore });
    }

    // Sort by highest suitability score
    results.sort((a, b) => b.score - a.score);

    return results.map(item => ({
      cropId: item.crop.id,
      cropName: item.crop.name,
      cropNameMarathi: item.crop.nameMarathi,
      suitabilityScore: item.score,
      category: item.crop.category,
      soilRequirements: item.crop.soilGuideEn,
      soilRequirementsMarathi: item.crop.soilGuideMr,
      climateRequirements: item.crop.climateGuideEn,
      climateRequirementsMarathi: item.crop.climateGuideMr,
      expectedDuration: item.crop.durationDays,
      expectedDurationMarathi: item.crop.durationDaysMarathi,
      waterNeed: item.crop.waterNeed,
      waterNeedMarathi: item.crop.waterNeedMarathi,
      cultivationGuide: item.crop.cultivationGuideEn,
      cultivationGuideMarathi: item.crop.cultivationGuideMr,
      fertilizerGuide: item.crop.fertilizerGuideEn,
      fertilizerGuideMarathi: item.crop.fertilizerGuideMr
    }));
  }
};
