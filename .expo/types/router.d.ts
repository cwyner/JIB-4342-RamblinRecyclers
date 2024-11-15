/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}${'/(home)'}` | ``; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}${'/(materials)'}` | ``; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}${'/(receiving)'}` | ``; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}${'/(home)'}` | ``; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}${'/(materials)'}` | ``; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}${'/(receiving)'}` | ``; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${'/(home)'}${`?${string}` | `#${string}` | ''}` | `${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${'/(materials)'}${`?${string}` | `#${string}` | ''}` | `${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${'/(receiving)'}${`?${string}` | `#${string}` | ''}` | `${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}${'/(home)'}` | ``; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}${'/(materials)'}` | ``; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}${'/(receiving)'}` | ``; params?: Router.UnknownInputParams; } | `/+not-found` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
    }
  }
}
