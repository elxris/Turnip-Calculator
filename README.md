# ACNH Turnip Calculator

Calculate your turnip price patterns and gain the most from the stalk market!

You can find the live calculator [here](https://elxris.github.io/Turnip-Calculator/).

## Changelog

1.1: Clear data button! Please use it responsibly!  
1.2a: Fixed pattern ranges  
1.3: Animations fixed. New icons [#2](/../../issues/3). New horizontal marker for buy price [#5](/../../issues/5).  
1.4: Guaranteed Min [#10](/../../issues/10). Localization Support #12. New Currency Icon [#11](/../../issues/11).  
1.4b: A lot of new translations! [#8](/../../issues/8) [#15](/../../issues/15) [#16](/../../issues/16) [#18](/../../issues/18) [#19](/../../issues/19) [#20](/../../issues/20) [#21](/../../issues/21) [#22](/../../issues/22) [#23](/../../issues/28) [#24](/../../issues/24) [#25](/../../issues/25) [#26](/../../issues/26) [#27](/../../issues/27)  
1.5: Styling update! Thank you! @mtaylor76 [#24](/../../issues/24)  
1.6: Translation switcher! I can't thank you enough @mtaylor76! [#33](/../../issues/33) New vector for bells currency! [#34](/../../issues/34) New Translations and Translation Updates! [#28](/../../issues/28) [#30](/../../issues/30) [#31](/../../issues/31)  
1.7: We have domain! Confirmation of erase data button! [#35](/../../issues/35) New Translations and Translation Updates! [#37](/../../issues/7) [#36](/../../issues/36) [#38](/../../issues/38) [#39](/../../issues/39) [#40](/../../issues/40) [#41](/../../issues/41)  
1.8: Share button! New translations! Service Workers! Smaller website size!  
1.9: New heuristic filter! Share improvements!  
1.9.1: New colors to show probabilities!

## API

Looking for an API? [See this](https://github.com/elxris/Turnip-Calculator/issues/72#issuecomment-617483396)

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
