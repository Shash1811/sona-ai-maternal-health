export enum UserRole {
  MOM = 'mom',
  MEDICAL_PROFESSIONAL = 'medical_professional',
}

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  requires_onboarding?: boolean;
  questionnaire_data?: Record<string, any>;
}

export interface MomProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  due_date?: string;
  baby_birth_date?: string;
  number_of_children: number;
  preferred_language: string;
  timezone: string;
  has_completed_onboarding: boolean;
  onboarding_completed_at?: string;
}

export interface MedicalProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  professional_title: string;
  license_number?: string;
  specialization?: string;
  years_of_experience?: number;
  hospital_or_clinic?: string;
  practice_address?: string;
  phone_number?: string;
  is_license_verified: boolean;
  verification_document_url?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    token_type: string;
    user: User;
  };
  requires_onboarding: boolean;
}
