const fs = require("fs");
const path = require("path");
const { countries, languagesAll } = require("countries-list");
const iso6393 = require("iso-639-3");

const files = fs
  .readdirSync("./src/locales", {})
  .filter((str) => !str.startsWith("index"));
const langs = [];

files.forEach((str) => {
  const [lang, country] = str.split("-");
  const { native: nativeLang = "", name: nameLang = "" } =
    languagesAll[String(lang).toLowerCase()] ||
    iso6393.find(({ iso6393: code }) => code === lang) ||
    {};
  const { native: nativeCountry = "" } =
    countries[String(country).toUpperCase()] || {};
  return langs.push([
    str,
    nativeCountry
      ? `${nativeLang || nameLang} (${nativeCountry})`
      : nativeLang || nameLang,
  ]);
});

const jsFile = `
// This file is generated with scripts/i18n.js

${files
  .map((code) => {
    const importName = `translation${code.replace("-", "")}`;
    return `import ${importName} from "./${code}/translation.json";`;
  })
  .join("\n")}

const list = JSON.parse('${JSON.stringify(langs)}');

const translations = {
${files
  .map((code) => {
    const importName = `translation${code.replace("-", "")}`;
    return `'${code}': {translations: ${importName}},`;
  })
  .join("\n")}
};

export { translations, list };
`;

fs.writeFileSync(path.join(process.cwd(), "src/locales/index.js"), jsFile);
