export type ProjectStatus = "DRAFT" | "PUBLISHED";
export type TechnologyCategory =
  | "FRONTEND"
  | "BACKEND"
  | "DATABASE"
  | "TOOL"
  | "LANGUAGE"
  | "OTHER";
export type MediaType = "COVER" | "GALLERY" | "ARCHITECTURE";

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface SiteSettings {
  id: string;
  full_name: string;
  professional_title: string;
  hero_title: string;
  hero_subtitle: string;
  introduction: string;
  about: string;
  email: string | null;
  location: string | null;
  github_username: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  availability: string | null;
  resume_url: string | null;
  default_seo_title: string | null;
  default_seo_description: string | null;
  default_social_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: TechnologyCategory;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  experience_type: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
  technologies: Technology[];
  created_at: string;
  updated_at: string;
}

export interface ProjectMedia {
  id: string;
  media_type: MediaType;
  file_url: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  project_type: string | null;
  short_description: string | null;
  responsibilities: string | null;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  technologies: Technology[];
  media: ProjectMedia[];
}

export interface AdjacentProject {
  name: string;
  slug: string;
}

export interface ProjectDetail extends ProjectSummary {
  context: string | null;
  problem: string | null;
  architecture: string | null;
  features: string | null;
  challenges: string | null;
  decisions: string | null;
  results: string | null;
  learnings: string | null;
  future_improvements: string | null;
  project_url: string | null;
  repository_url: string | null;
  start_date: string | null;
  end_date: string | null;
  seo_title: string | null;
  seo_description: string | null;
  previous_project: AdjacentProject | null;
  next_project: AdjacentProject | null;
}

export interface GitHubProfile {
  available: boolean;
  username?: string | null;
  profile_url?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  followers?: number | null;
  public_repos?: number | null;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface GitHubRepositoryList {
  available: boolean;
  source: string;
  items: GitHubRepository[];
}

export interface ResumePayload {
  resume_url: string | null;
  has_resume: boolean;
  summary_html: string | null;
  experiences: Array<Record<string, unknown>>;
  technologies: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
}

export interface AdminUser {
  id: string;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: AdminUser;
  message: string;
}

export interface FeaturedRepository {
  id: string;
  owner: string;
  repository_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string | null; message: string }>;
  };
}

