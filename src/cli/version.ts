// Version is set at build time
declare const BUILD_VERSION: string;

export const version = typeof BUILD_VERSION !== "undefined" ? BUILD_VERSION : "0.0.0-dev";
