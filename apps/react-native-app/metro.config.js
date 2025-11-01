// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('mjs', 'cjs'); // my god - webpack may try to use older libraries and dependencies 
// and mjs and cjs are two formats they try to find everything that u need to run and when it does there's some
// configs that you gotta do (sometimes you gotta change configs)

module.exports = config;
// module.exports = (async () => {
//     const {
//       resolver: { sourceExts, assetExts },
//     } = await getDefaultConfig(__dirname);
//     return {
//       transformer: {
//         babelTransformerPath: require.resolve('react-native-svg-transformer'),
//       },
//       resolver: {
//         assetExts: assetExts.filter(ext => ext !== 'svg'),
//         sourceExts: [...sourceExts, 'svg'],
//       },
//     };
//   })();


