import type { Technology } from "@/types/api";

import { Badge } from "@/components/ui/Badge";

export function TechnologyBadge({ technology }: { technology: Pick<Technology, "name"> }) {
  return <Badge>{technology.name}</Badge>;
}

