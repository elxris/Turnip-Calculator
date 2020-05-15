const fs = require("fs");
const path = require("path");
const { countries, languagesAll } = require("countries-list");

const files = fs
  .readdirSync("./src/locales", {})
  .filter((str) => !str.startsWith("index"));
const langs = [];

files.forEach((str) => {
  const [lang, country] = str.split("-");
  const { native: nativeLang = "" } =
    languagesAll[String(lang).toLowerCase()] || {};
  const { native: nativeCountry = "" } =
    countries[String(country).toUpperCase()] || {};
  return langs.push([
    str,
    nativeCountry ? `${nativeLang} (${nativeCountry})` : nativeLang,
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
