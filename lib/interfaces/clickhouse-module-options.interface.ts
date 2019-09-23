interface ConfigOptions {
  url: String;
  port: number;
  debug?: boolean;
  basicAuth?: object;
  isUseGzip?: boolean;
  config?: object;
  reqParams?: object;
}

export interface ClickhouseModuleOptions extends ConfigOptions {}
