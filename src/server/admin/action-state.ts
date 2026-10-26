/** Result of an admin Server Action, consumed by `useActionState` in the panel. */
export interface ActionState {
  ok: boolean;
  /** Shown as a toast (success) or above the form (failure). */
  message?: string;
  /** Field errors keyed by input name, e.g. `"fa.title"`. */
  errors?: Record<string, string>;
  /** Changes on every completed submission so the client can react to repeats. */
  at?: number;
}

export const idleState: ActionState = { ok: false };
