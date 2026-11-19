/**
 * Skeleton shown in the admin shell while a panel page loads. Every page
 * reads the session and fresh database rows per request, so each panel
 * segment has a `loading.tsx` rendering this: navigations run as
 * transitions, which never re-show an already visible boundary, so a
 * boundary must mount fresh in the segment being navigated to.
 */
export function PanelLoading() {
  return (
    <div role="status" aria-busy="true" className="motion-safe:animate-pulse">
      <span className="sr-only">در حال بارگذاری…</span>
      <div aria-hidden>
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2.5">
            <div className="h-7 w-40 rounded-sm bg-tint/[0.07]" />
            <div className="h-4 w-72 max-w-full rounded-sm bg-tint/[0.05]" />
          </div>
          <div className="h-9 w-32 rounded-sm bg-tint/[0.07]" />
        </div>
        <div className="overflow-hidden rounded-lg border border-line">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-b-0">
              <div className="h-4 w-8 rounded-sm bg-tint/[0.05]" />
              <div className="h-4 flex-1 rounded-sm bg-tint/[0.06]" />
              <div className="hidden h-4 w-24 rounded-sm bg-tint/[0.05] sm:block" />
              <div className="h-7 w-16 rounded-sm bg-tint/[0.05]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for a create/edit form page: header with a back link, then a form card. */
export function PanelFormLoading() {
  return (
    <div role="status" aria-busy="true" className="motion-safe:animate-pulse">
      <span className="sr-only">در حال بارگذاری…</span>
      <div aria-hidden>
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2.5">
            <div className="h-7 w-48 rounded-sm bg-tint/[0.07]" />
            <div className="h-4 w-72 max-w-full rounded-sm bg-tint/[0.05]" />
          </div>
          <div className="h-9 w-36 rounded-sm bg-tint/[0.07]" />
        </div>
        <div className="space-y-5 rounded-lg border border-line p-5 sm:p-7">
          {Array.from({ length: 3 }, (_, section) => (
            <div key={section} className="space-y-4 border-t border-line pt-5 first:border-t-0 first:pt-0">
              <div className="h-4 w-28 rounded-sm bg-tint/[0.07]" />
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, field) => (
                  <div key={field} className="space-y-2">
                    <div className="h-3 w-20 rounded-sm bg-tint/[0.05]" />
                    <div className="h-9 rounded-sm bg-tint/[0.06]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
