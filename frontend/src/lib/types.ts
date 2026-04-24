export interface User {
  id: string;
  name: string;
  email: string;
  lockedin_id: string;
  headline: string;
  company: string;
  location: string;
  about: string;
  profile_image_url: string;
  trust_score: number;
  verification_level: string;
  profile_views: number;
  is_reviewer: boolean;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  freelance_url?: string;
  created_at?: string;
}

export interface Experience {
  id: string;
  user_id: string;
  title: string;
  company: string;
  employment_type: string;
  location: string;
  start_date?: string;
  end_date?: string;
  description: string;
  is_verified: boolean;
}

export interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date?: string;
  end_date?: string;
  is_verified: boolean;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  is_verified: boolean;
}

export interface Claim {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  credential_id?: string;
  external_url?: string;
  status: string;
  created_at?: string;
}

export interface PublicProfile extends Omit<User, "email" | "password_hash"> {
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  claims: Claim[];
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export interface TrustScore {
  user_id: string;
  trust_score: number;
  verification_level: string;
  breakdown: Record<string, number>;
}

export interface SearchResult {
  id: string;
  name: string;
  lockedin_id: string;
  headline: string;
  company: string;
  location: string;
  profile_image_url: string;
  trust_score: number;
  verification_level: string;
  skills: { name: string; is_verified: boolean }[];
}
