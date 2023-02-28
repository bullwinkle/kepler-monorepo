import { Configuration, DefinePlugin } from "webpack";

interface Options {
  buildOptimizer: boolean,
  optimization: boolean,
  vendorChunk: boolean,
  extractLicenses: boolean,
  sourceMap: boolean,
  namedChunks: boolean
}


type Env = { [key: string]: any };

const ENV_VARIABLES_PREFIXES = ["NX", "KEPLER"];

function getClientEnvironment(configuration: string) {
  // Grab NODE_ENV and NX_* environment variables and prepare them to be
  // injected into the application via DefinePlugin in webpack configuration.
  const NX_APP = new RegExp(`^(${ENV_VARIABLES_PREFIXES.join("|")})_`, "i");

  const raw = Object.keys(process.env)
    .filter((key) => NX_APP.test(key))
    .reduce(
      (env: Env, key) => {
        env[key] = process.env[key] as string | number | undefined;
        return env;
      },
      {
        NODE_ENV: process.env['NODE_ENV'] || configuration
      }
    );

  // Stringify all values so we can feed into webpack DefinePlugin
  return {
    "process.env": Object.keys(raw).reduce((env: Env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };
}

module.exports = (config: Configuration, options: Options, context: { project: string, target: string, configuration: string }) => {
  console.warn(options);
  console.warn(context);
  const definePlugin = new DefinePlugin(getClientEnvironment(context.configuration));
  (config.plugins || (config.plugins = [])).push(definePlugin);
  return config;
};
