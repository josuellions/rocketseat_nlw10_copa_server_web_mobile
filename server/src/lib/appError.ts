export default class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly data?: unknown;

  constructor(message: string, statusCode = 412, data?: unknown) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
