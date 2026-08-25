export class NoToastContextError extends Error {
  constructor() {
    super("No ToastContext found");
  }
}

export class UnauthorizedError extends Error {
  data: object;
  constructor(data: object) {
    super(JSON.stringify(data));
    this.data = data;
  }

  override toString() {
    return JSON.stringify(this.data);
  }
}

export class TokenExpiresError extends UnauthorizedError {
  constructor() {
    super({ message: "Token is expired" });
  }
}

export class NullParamsException extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(trace?: any) {
    super("Params cannot be null" + trace ? `: ${trace}` : "");
  }
}

export class TooManyRequestsAtOnceError extends Error {
  constructor() {
    super("Too many requests at once");
  }
}

export class FetchAbortedError extends Error {
  constructor(where?: string) {
    super("Fetch aborted" + where ? `: ${where}` : "");
  }
}

export class NoReduxStoreError extends Error {
  constructor(storeNames: string[]) {
    super(`No ${storeNames.join(", ")} store(s) found`);
  }
}
