import { DomainException } from "./DomainException";

export class CorsOriginException extends Error implements DomainException {
  constructor(origin: string) {
    super(
      `A política CORS para este site não permite acesso da Origem ${origin}.`
    );

    this.name = "CorsOriginException";
  }
}
