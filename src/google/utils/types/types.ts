export type GoogleHttpErrorResponseType = {
  code: number,
  message: string,
  errors: {
    message: string,
    domain: string,
    reason: string
  }[],
  status: string,
};
