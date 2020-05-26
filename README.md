# ACNH Turnip Calculator

Calculate your turnip price patterns and gain the most from the stalk market!

You can find the live calculator [here](https://elxris.github.io/Turnip-Calculator/).

## API

Looking for an API? [See this](https://github.com/elxris/Turnip-Calculator/issues/72#issuecomment-617483396)

## Local Development

To run this application locally, run the following commands:

```
git clone git@github.com:elxris/Turnip-Calculator.git
cd Turnip-Calculator
npm i
npm start
```

## Localizations

### For translators

Please go to [i18n.ac-turnip.com](https://i18n.ac-turnip.com/projects/turnip-calculator/application/) to start translating.

### For developers

This app supports dynamic localization using [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/), with [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) to automatically detect the user's native OS language preferences and switch the app's language accordingly.

### Adding new text to localizations

As features are added to the calculator, they'll most likely not be localised immediately. To localise any new text in the app, make sure to first wrap the text in the `t()` method taken from the `useTranslation()` hook. Then, in your language's `translation.json`, add a new JSON key/value pair with the key used in the `t()` method, using your translated text as the value.

For example, let's say we're adding a new button that says "Show Current Pattern". In the component where that text would be displayed, you would instead write `t("Show Current Pattern")`, wrapping the statement in brackets `{}` if it were part of JSX code.

Then, to add a translation to your language, you'd go to your languages `translation.json` file, and add the following line (using Spanish as an example):

`"Show Current Pattern": "Mostrar Patrón Actual",`

If no key is specified in the localization files, the app will simply display whatever text is passed into `t()`, to avoid errors.

### Creating new localizations

To localise the app to a new language, the following simple steps need to be done:

- Create a new folder under `/locales` for your language using the standard two-letter [IETF language code](https://gist.github.com/traysr/2001377) for your language (e.g. `es` for Spanish, `zh` for Chinese). Keep in mind, the **language** code often differs from the more commonly known **country code**. For example, the _country code_ for Korea is `kr`, but the _language code_ for Korean is `ko`.
  - Dialect codes are supported (e.g. `en-GB` for British English and `pt-BR` for Brazilian Portuguese), but **be sure to avoid hyphens (-) in variable names.** As a reminder, hyphens can't be used in JavaScript variable names. When in doubt, stay consistent with existing code.
- In the newly created folder, copy and paste the `translation.json` file from one of the other languages.
- Edit the `translation.json` file to translate each untranslated JSON value to the appropriate translated equivalent in your language.
- In `/src/i18n.js`, create an `import` statement for your language, importing the `translation.json` file you just created. Follow the pattern used by the existing statements.
- In the same file (`/src/i18n.js`), add your language to the list of languages inside the `resources` object within the `i18n.init()` method, following the pattern of other declared languages, and using the same two-letter language code you used for the folder name in the first step.
- Lastly, to add your language to the manual language switcher on the page, make sure to edit the `Localizer` component at `/src/Localizer.jsx`. Add a tuple for your language to the `languages` array, with the first value being your two-letter language code and the second value being the name of your language, in your language.
  - For example, to add Japanese to the list, you'd add `["ja", "日本語"],`

The localization is now ready to deploy and will appear to users who use your language for their browser.
