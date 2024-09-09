export class AppError extends Error {
  constructor(
    message?: string,
    private _errorCode: string = 'INTERNAL_SERVER_ERROR',
    private _httpStatusCode: number = 500,
    private _details: Record<string, any> = {},
  ) {
    super(message);
  }

  get errorCode() {
    return this._errorCode;
  }

  get httpStatusCode() {
    return this._httpStatusCode;
  }

  get details() {
    return this._details;
  }
}
