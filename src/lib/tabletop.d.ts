declare module 'tabletop' {
  export interface TabletopOptions {
    key: string;
    callback?: (data: any, tabletop: Tabletop) => void;
    simpleSheet?: boolean;
    wanted?: string[];
    postProcess?: (element: any) => any;
    debug?: boolean;
    authkey?: string;
    query?: object;
    endpoint?: string;
    prettyColumnNames?: boolean;
    proxyAddress?: string;
    parseNumbers?: boolean;
    wait?: boolean;
    reverse?: boolean;
  }

  export interface TabletopWorksheet {
    name: string;
    element: any;
    all(): any[];
    column(name: string): any[];
    elements: any[];
  }

  export interface Tabletop {
    sheets(name: string): TabletopWorksheet;
    foundSheetNames: string[];
    data: Record<string, TabletopWorksheet>;
  }

  export default class TabletopStatic {
    static init(options: TabletopOptions): Tabletop;
  }
} 