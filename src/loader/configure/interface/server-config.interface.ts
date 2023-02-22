export interface ServerConfigInterface {
  readonly host: string;
  readonly http: {
    readonly port: number;
  };
}
