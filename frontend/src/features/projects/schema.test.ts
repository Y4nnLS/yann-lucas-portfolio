import { projectFormSchema } from "@/features/projects/schema";

describe("projectFormSchema", () => {
  it("rejects invalid URLs", () => {
    const result = projectFormSchema.safeParse({
      name: "Projeto",
      slug: "",
      project_type: "",
      short_description: "",
      context: "",
      problem: "",
      responsibilities: "",
      architecture: "",
      features: "",
      challenges: "",
      decisions: "",
      results: "",
      learnings: "",
      future_improvements: "",
      project_url: "not-an-url",
      repository_url: "",
      start_date: "",
      end_date: "",
      status: "DRAFT",
      featured: false,
      sort_order: 0,
      seo_title: "",
      seo_description: "",
      technology_ids: [],
    });

    expect(result.success).toBe(false);
  });
});

