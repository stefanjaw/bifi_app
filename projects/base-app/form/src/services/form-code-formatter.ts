import { Injectable } from '@angular/core';

// parsers
import prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/parser-babel';
import * as parserHtml from 'prettier/parser-html';
import * as parserPostCSS from 'prettier/parser-postcss';
import * as parserTypescript from 'prettier/parser-typescript';
import pluginEstree from 'prettier/plugins/estree';

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
            : 'babel'; // ts/js

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
