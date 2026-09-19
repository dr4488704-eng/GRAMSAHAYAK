export type Language = 'en' | 'te' | 'ta' | 'hi';

export type Gender = 'male' | 'female' | 'other' | 'all';

export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'All';

export type EmploymentStatus = 
  | 'employed' 
  | 'unemployed' 
  | 'self_employed' 
  | 'farmer' 
  | 'student' 
  | 'homemaker' 
  | 'retired';

export type Occupation =
  | 'Farmer'
  | 'Agricultural Labourer'
  | 'Student'
  | 'Artisan / Craftsperson'
  | 'Small Business Owner / Vendor'
  | 'Daily Wage Worker'
  | 'Homemaker'
  | 'Unemployed Youth'
  | 'Senior Citizen'
  | 'Other';

export type LandType = 'irrigated' | 'unirrigated' | 'none';

export type SchemeCategory =
  | 'Agriculture'
  | 'Housing'
  | 'Education'
  | 'Employment'
  | 'Healthcare'
  | 'Women Welfare'
  | 'Pension'
  | 'Financial Assistance'
  | 'Entrepreneurship'
  | 'Skill Development';

export type SchemeStatus = 'published' | 'draft' | 'archived';

export type EligibilityStatus = 
  | 'POTENTIALLY_ELIGIBLE' 
  | 'NOT_MATCHING' 
  | 'MORE_INFO_REQUIRED';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  state: string;
  district: string;
  village_or_town: string;
  annual_family_income: number;
  employment_status: EmploymentStatus;
  occupation: Occupation;
  land_owned: boolean;
  land_area: number; // in acres
  land_type: LandType;
  category: SocialCategory;
  disability: boolean;
  widow: boolean;
  senior_citizen: boolean;
  family_size: number;
  children_count: number;
  senior_citizen_count: number;
  female_headed_household: boolean;
  interests: SchemeCategory[];
  email: string;
  preferred_language: Language;
  email_notifications_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Scheme {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  category: SchemeCategory;
  subcategory?: string;
  states: string[]; // empty array or ['All'] means all India
  districts?: string[];
  min_age: number | null;
  max_age: number | null;
  max_income: number | null;
  occupations: Occupation[]; // empty means all
  categories: SocialCategory[]; // empty means all
  gender_requirement: Gender;
  requires_land: boolean;
  minimum_land_area: number | null;
  maximum_land_area: number | null;
  disability_required: boolean;
  senior_citizen_required: boolean;
  widow_required: boolean;
  female_headed_required?: boolean;
  benefits: string[];
  benefit_amount?: string;
  required_documents: string[];
  application_steps: string[];
  application_url: string;
  official_source: string;
  last_verified_date: string;
  status: SchemeStatus;
  created_at: string;
  updated_at: string;
}

export interface EligibilityResult {
  status: EligibilityStatus;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  missingCriteria: string[];
  summaryMessage: string;
}

export interface SavedScheme {
  id: string;
  user_id: string;
  scheme_id: string;
  scheme?: Scheme;
  saved_at: string;
}

export type ApplicationStatus = 
  | 'Saved' 
  | 'Ready to Apply' 
  | 'Applied' 
  | 'Under Review' 
  | 'Approved' 
  | 'Rejected';

export interface Application {
  id: string;
  user_id: string;
  scheme_id: string;
  scheme_name?: string;
  application_date: string;
  reference_number?: string;
  status: ApplicationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 
  | 'new_matching_scheme' 
  | 'saved_scheme_update' 
  | 'application_reminder' 
  | 'profile_reminder';

export interface AppNotification {
  id: string;
  user_id: string;
  scheme_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  scheme_id: string;
  notification_type: NotificationType;
  recipient_email: string;
  subject: string;
  body_text: string;
  html_preview: string;
  delivery_channel: 'smtp' | 'demo_mode';
  sent_at: string;
  status: 'sent' | 'demo_preview' | 'failed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
  schemeRefId?: string;
}
