import type {
  AuthSession,
  Experience,
  FeaturedRepository,
  GitHubProfile,
  GitHubRepositoryList,
  PaginatedResponse,
  ProjectDetail,
  ProjectSummary,
  ResumePayload,
  SiteSettings,
  Technology,
} from "@/types/api";

import { apiFetch } from "@/services/api";

export async function getSiteSettings() {
  return apiFetch<SiteSettings>("/api/v1/site");
}

export async function getProjects(params?: Record<string, string | number | boolean | null | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const suffix = searchParams.size ? `?${searchParams.toString()}` : "";
  return apiFetch<PaginatedResponse<ProjectSummary>>(`/api/v1/projects${suffix}`);
}

export async function getProject(slug: string) {
  return apiFetch<ProjectDetail>(`/api/v1/projects/${slug}`, { revalidate: false });
}

export async function getTechnologies() {
  return apiFetch<Technology[]>("/api/v1/technologies");
}

export async function getExperiences() {
  return apiFetch<Experience[]>("/api/v1/experiences");
}

export async function getGithubProfile() {
  return apiFetch<GitHubProfile>("/api/v1/github/profile", { revalidate: 900 });
}

export async function getGithubRepositories() {
  return apiFetch<GitHubRepositoryList>("/api/v1/github/repositories", { revalidate: 900 });
}

export async function getResume() {
  return apiFetch<ResumePayload>("/api/v1/resume", { revalidate: false });
}

export async function getAdminSession(cookieHeader: string) {
  return apiFetch<AuthSession>("/api/v1/auth/me", { cookieHeader, revalidate: false });
}

export async function getAdminProjects(cookieHeader: string, params?: Record<string, string | number | null | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const suffix = searchParams.size ? `?${searchParams.toString()}` : "";
  return apiFetch<PaginatedResponse<ProjectSummary>>(`/api/v1/admin/projects${suffix}`, {
    cookieHeader,
    revalidate: false,
  });
}

export async function getAdminProject(cookieHeader: string, projectId: string) {
  return apiFetch<ProjectDetail>(`/api/v1/admin/projects/${projectId}`, {
    cookieHeader,
    revalidate: false,
  });
}

export async function getAdminTechnologies(cookieHeader: string) {
  return apiFetch<PaginatedResponse<Technology>>("/api/v1/admin/technologies?page=1&page_size=50", {
    cookieHeader,
    revalidate: false,
  });
}

export async function getAdminExperiences(cookieHeader: string) {
  return apiFetch<PaginatedResponse<Experience>>("/api/v1/admin/experiences?page=1&page_size=50", {
    cookieHeader,
    revalidate: false,
  });
}

export async function getAdminSiteSettings(cookieHeader: string) {
  return apiFetch<SiteSettings>("/api/v1/admin/site-settings", {
    cookieHeader,
    revalidate: false,
  });
}

export async function getAdminFeaturedRepositories(cookieHeader: string) {
  return apiFetch<PaginatedResponse<FeaturedRepository>>(
    "/api/v1/admin/featured-repositories?page=1&page_size=50",
    {
      cookieHeader,
      revalidate: false,
    },
  );
}
