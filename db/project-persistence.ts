type ProjectPersistenceIssue = "commit-status-unknown" | "document-cleanup-failed";

type ProjectPersistenceOptions = {
  insert: () => Promise<unknown>;
  rowExists: () => Promise<boolean>;
  removeDocument: () => Promise<unknown>;
  reportIssue?: (issue: ProjectPersistenceIssue) => void;
};

/**
 * Inserts a project row after storing its document. On an insert error, check
 * whether the database committed before attempting to remove the document.
 */
export async function insertProjectWithCompensation({
  insert,
  rowExists,
  removeDocument,
  reportIssue = () => {},
}: ProjectPersistenceOptions): Promise<void> {
  try {
    await insert();
  } catch (insertError) {
    let committed: boolean;
    try {
      committed = await rowExists();
    } catch {
      try { reportIssue("commit-status-unknown"); } catch { /* Preserve the original insert error. */ }
      throw insertError;
    }
    if (committed) return;

    try {
      await removeDocument();
    } catch {
      try { reportIssue("document-cleanup-failed"); } catch { /* Preserve the original insert error. */ }
    }
    throw insertError;
  }
}
