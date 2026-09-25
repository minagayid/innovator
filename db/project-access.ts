export function buildVisibleProjectQuery(viewerId: string | undefined, projectId: string) {
  return {
    sql: `SELECT p.id, p.slug, p.owner_id AS ownerId, u.display_name AS ownerName, p.title, p.summary, p.category,
      p.status, p.readiness_stage AS readinessStage, p.visibility, p.document_key AS documentKey,
      p.created_at AS createdAt, p.updated_at AS updatedAt
      FROM projects p JOIN users u ON u.id = p.owner_id
      WHERE p.id = ? AND (p.visibility = 'public' OR p.owner_id = ?) LIMIT 1`,
    values: [projectId, viewerId ?? ""] as const,
  };
}
