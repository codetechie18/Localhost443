export const REPORT_DRAFT_KEY = 'civic:report-draft';

export const EMPTY_REPORT_FORM = {
  title: '',
  description: '',
  category: '',
  image: null,
};

export function hasReportDraftContent(form) {
  return Boolean(form.title?.trim() || form.description?.trim() || form.category?.trim());
}

export function readReportDraft() {
  if (typeof window === 'undefined') return null;

  try {
    const rawValue = window.localStorage.getItem(REPORT_DRAFT_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      description: typeof parsed.description === 'string' ? parsed.description : '',
      category: typeof parsed.category === 'string' ? parsed.category : '',
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
    };
  } catch {
    return null;
  }
}

export function saveReportDraft(form) {
  if (typeof window === 'undefined') return null;

  const payload = {
    title: form.title || '',
    description: form.description || '',
    category: form.category || '',
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(REPORT_DRAFT_KEY, JSON.stringify(payload));
  return payload;
}

export function clearReportDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(REPORT_DRAFT_KEY);
}
