
export type AIServiceStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

// Generic state for an asynchronous AI operation.
export type AIServiceState<T> =
  | {
      status: "idle";
      data: null;
      error: null;
    }
  | {
      status: "loading";
      data: null;
      error: null;
    }
  | {
      status: "success";
      data: T;
      error: null;
    }
  | {
      status: "error";
      data: null;
      error: string;
    };

// Create the initial state.
export function createIdleAIState<T>(): AIServiceState<T> {
  return {
    status: "idle",
    data: null,
    error: null,
  };
}