declare module "*.css";
declare module "*.sass";
declare module "*.less";
declare module "*.json";
declare module "*.es6";

declare var __DEV__: boolean;
declare const gio: any;
declare const dataLayer: any;
declare const TencentCaptcha: any;

declare var PACK_DEFINE_PRODUCTION: boolean;
declare var __DEV__: boolean;
declare var PACK_VERSION: string;
declare var SENTRY_DSN: string;
declare var IS_SSR: boolean;
declare var IS_FRAME_ONLY: boolean;
declare const QRCode: any;

interface Window {
	gio: any;
}
declare module "*.scss" {
	const styles: any;
	export = styles;
}
