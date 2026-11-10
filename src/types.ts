/**
 * Core Type Definitions for Gramin Krishi Seva – Krishi Mitra (कृषी मित्र)
 */

export type Language = 'mr' | 'en';

export interface FarmerProfile {
  name: string;
  mobile: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  preferredLanguage: Language;
  landArea: number;
  landUnit: 'acre' | 'guntha' | 'hectare';
  soilType: 'black_cotton' | 'red' | 'alluvial' | 'loamy' | 'sandy' | 'laterite';
  irrigationFacility: 'drip' | 'sprinkler' | 'well' | 'canal' | 'rainfed';
  mainCrops: string[];
  photoUrl?: string;
  registrationDate: string;
  onboardingCompleted: boolean;
}

export type CropGrowthStage = 'germination' | 'vegetative' | 'flowering' | 'pod_formation' | 'maturity' | 'harvested';

export interface Crop {
  id: string;
  name: string;
  nameMarathi: string;
  variety?: string;
  sowingDate: string;
  landArea: number;
  landUnit: 'acre' | 'guntha' | 'hectare';
  soilType: string;
  irrigationType: string;
  expectedHarvestDate: string;
  stage: CropGrowthStage;
  healthStatus: 'healthy' | 'attention_needed' | 'pest_alert' | 'critical';
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface WeatherData {
  locationName: string;
  district: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  precipitationProbability: number;
  weatherCode: number;
  conditionText: string;
  conditionTextMarathi: string;
  daily: Array<{
    date: string;
    dayName: string;
    dayNameMarathi: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    rainSum: number;
    weatherCode: number;
    condition: string;
    conditionMarathi: string;
  }>;
  alerts: Array<{
    type: 'rain' | 'heat' | 'wind' | 'advisory';
    title: string;
    titleMarathi: string;
    message: string;
    messageMarathi: string;
  }>;
  agriculturalAdvice: {
    spraying: { ok: boolean; advice: string; adviceMarathi: string };
    irrigation: { ok: boolean; advice: string; adviceMarathi: string };
    sowing: { ok: boolean; advice: string; adviceMarathi: string };
  };
  lastUpdated: string;
}

export type FarmActivityType = 
  | 'preparation' 
  | 'seed_purchase' 
  | 'sowing' 
  | 'irrigation' 
  | 'fertilizer' 
  | 'pesticide' 
  | 'inspection' 
  | 'harvesting' 
  | 'sale' 
  | 'other';

export interface FarmActivity {
  id: string;
  cropId?: string;
  cropName: string;
  activityType: FarmActivityType;
  date: string;
  description: string;
  cost: number;
  income: number;
  photoUrl?: string;
}

export interface SoilReport {
  id: string;
  farmerName: string;
  date: string;
  sampleLocation: string;
  soilType: string;
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  organicCarbon: number; // %
  electricalConductivity: number; // dS/m
  fertilityRating: 'low' | 'medium' | 'high' | 'optimal';
  fertilitySummary: string;
  fertilitySummaryMarathi: string;
  suitableCrops: string[];
  fertilizerPlan: {
    ureaKgPerAcre: number;
    dapKgPerAcre: number;
    mopKgPerAcre: number;
    organicCompostTons: number;
    guidance: string;
    guidanceMarathi: string;
  };
}

export interface CropRecommendationInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  district: string;
  season: 'kharif' | 'rabi' | 'zaid';
  soilType: string;
}

export interface RecommendedCropResult {
  cropId: string;
  cropName: string;
  cropNameMarathi: string;
  suitabilityScore: number;
  category: 'Cash Crop' | 'Pulse' | 'Cereal' | 'Horticulture' | 'Oilseed';
  soilRequirements: string;
  soilRequirementsMarathi: string;
  climateRequirements: string;
  climateRequirementsMarathi: string;
  expectedDuration: string;
  expectedDurationMarathi: string;
  waterNeed: 'Low' | 'Medium' | 'High';
  waterNeedMarathi: 'कमी' | 'मध्यम' | 'जास्त';
  cultivationGuide: string;
  cultivationGuideMarathi: string;
  fertilizerGuide: string;
  fertilizerGuideMarathi: string;
}

export interface DiseaseDiagnosisResult {
  disease: string;
  diseaseMarathi: string;
  pest: string;
  confidence: number;
  symptoms: string;
  symptomsMarathi: string;
  causes: string;
  causesMarathi: string;
  organicRemedy: string;
  organicRemedyMarathi: string;
  chemicalRemedy: string;
  chemicalRemedyMarathi: string;
  preventive: string;
  preventiveMarathi: string;
  kvkAdvice: string;
  kvkAdviceMarathi: string;
  imageUrl?: string;
  analyzedAt: string;
  cropName: string;
}

export interface GovtScheme {
  id: string;
  name: string;
  nameMarathi: string;
  category: 'subsidy' | 'insurance' | 'finance' | 'financial' | 'irrigation' | 'machinery' | 'soil';
  department: string;
  description: string;
  descriptionMarathi: string;
  eligibility: string[];
  eligibilityMarathi: string[];
  benefits: string;
  benefitsMarathi: string;
  requiredDocuments: string[];
  requiredDocumentsMarathi: string[];
  applicationProcess: string[];
  applicationProcessMarathi: string[];
  officialUrl: string;
  deadline?: string;
  status?: 'interested' | 'applied' | 'none';
}

export interface OutbreakAlert {
  id: string;
  district: string;
  taluka: string;
  village: string;
  crop: string;
  cropMarathi: string;
  pestOrDisease: string;
  pestOrDiseaseMarathi: string;
  reportedDate: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  verified: boolean;
  precautions: string;
  precautionsMarathi: string;
  photoUrl?: string;
  reportCount: number;
}

export interface MandiPriceItem {
  id: string;
  crop: string;
  cropMarathi: string;
  market: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceChange: number; // positive or negative
  arrivalQuantity: number;
  unit: string;
  updatedDate: string;
}

export interface SmartReminder {
  id: string;
  cropId?: string;
  cropName?: string;
  title: string;
  titleMarathi: string;
  category: 'irrigation' | 'fertilizer' | 'pesticide' | 'sowing' | 'harvesting' | 'inspection' | 'scheme';
  dateTime: string;
  completed: boolean;
  notes?: string;
}
