import { Injectable } from '@angular/core';

import { formCodeEditorLanguages } from '../interfaces/form-code-editor-languages';

@Injectable({
  providedIn: 'root',
})
export class FormCodeFormatter {
  async format(code: string, language: formCodeEditorLanguages) {
    code = code.replace(/\r\n/g, '\n');
    code = code.replace(/\\r\\n/g, '\n');

    const parser =
      language === 'text/html'
        ? 'html'
        : language === 'text/css'
          ? 'css'
          : language.includes('typescript')
            ? 'typescript'
            : 'babel';

    const [prettier, parserBabel, parserHtml, parserPostCSS, parserTypescript, pluginEstree] =
      await Promise.all([
        import('prettier/standalone').then(m => m.default),
        import('prettier/parser-babel'),
        import('prettier/parser-html'),
        import('prettier/parser-postcss'),
        import('prettier/parser-typescript'),
        import('prettier/plugins/estree').then(m => m.default),
      ]);

    const plugins = [parserBabel, parserHtml, parserPostCSS, parserTypescript, pluginEstree];

    try {
      return await prettier.format(code, {
        parser,
        plugins,
        singleQuote: true,
        semi: true,
        tabWidth: 2,
        trailingComma: 'es5',
      });
    } catch (e) {
      console.error(e);
      return code;
    }
  }
}
