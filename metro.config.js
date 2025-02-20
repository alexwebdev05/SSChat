const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Si la opción "serializer.isThirdPartyModule" existe, se elimina
  if (config.serializer && config.serializer.isThirdPartyModule) {
    delete config.serializer.isThirdPartyModule;
  }

  return config;
})();
