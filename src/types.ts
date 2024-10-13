export default interface PluginOptions {
  routes: { from: string | RegExp; to: string }[];
}
