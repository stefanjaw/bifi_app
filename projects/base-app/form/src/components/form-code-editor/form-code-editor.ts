import {
  Component,
  ElementRef,
  inject,
  ChangeDetectionStrategy,
  forwardRef,
  input,
  effect,
  AfterViewInit,
} from '@angular/core';

import { EditorView, basicSetup } from 'codemirror';
import { MergeView } from '@codemirror/merge';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

// Languages...
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formCodeEditorLanguages } from '../../interfaces/form-code-editor-languages';
import { LanguageSupport } from '@codemirror/language';

@Component({
  selector: 'bifi-app-form-code-editor',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCodeEditor),
      multi: true,
    },
  ],
  templateUrl: './form-code-editor.html',
  styleUrl: './form-code-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCodeEditor implements AfterViewInit {
  private editor!: EditorView | MergeView;

  // inputs normales
  language = input<formCodeEditorLanguages | undefined>('text/html');

  // diff mode
  diffMode = input<boolean>(false);
  leftFormControl = input<FormControl>(); // original
  rightFormControl = input<FormControl>(); // updated

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: string) => {
    // empty
  };
  private onTouched = () => {
    // empty
  };

  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  codeExtentions = [basicSetup, oneDark, keymap.of([indentWithTab]), EditorView.lineWrapping];

  constructor() {
    effect(() => {
      const language = this.language();

      if (!this.host.nativeElement) return;

      const languageSupport = this.getLanguage(language || 'text/html');

      if (this.diffMode()) {
        this.createDiffEditor(languageSupport);
      } else {
        this.createNormalEditor(languageSupport);
      }
    });
  }

  ngAfterViewInit(): void {
    const language = this.language();
    const languageSupport = this.getLanguage(language || 'text/html');

    if (this.diffMode()) {
      this.createDiffEditor(languageSupport);
    } else {
      this.createNormalEditor(languageSupport);
    }
  }

  private getLanguage(type: formCodeEditorLanguages) {
    switch (type) {
      case 'application/javascript':
      case 'text/javascript':
        return javascript();
      case 'application/typescript':
      case 'text/typescript':
        return javascript({ typescript: true });
      case 'text/css':
        return css();
      case 'text/html':
        return html();
      default:
        return javascript();
    }
  }

  // ------------------------------
  // MODO NORMAL
  // ------------------------------
  private createNormalEditor(languageSupport: LanguageSupport) {
    this.editor = new EditorView({
      doc: '',
      extensions: [
        ...this.codeExtentions,
        languageSupport,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            this.onChange(update.state.doc.toString());
          }
        }),
      ],
      parent: this.host.nativeElement.querySelector('.editor-container') as HTMLElement,
    });
  }

  // ------------------------------
  // MODO DIFF
  // ------------------------------
  private createDiffEditor(languageSupport: LanguageSupport) {
    const original = this.leftFormControl()?.value ?? '';
    const modified = this.rightFormControl()?.value ?? '';

    this.editor = new MergeView({
      a: {
        doc: original,
        extensions: [
          ...this.codeExtentions,
          languageSupport,
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              this.leftFormControl()?.setValue(update.state.doc.toString());
            }
          }),
        ],
      },
      b: {
        doc: modified,
        extensions: [
          ...this.codeExtentions,
          languageSupport,
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              this.rightFormControl()?.setValue(update.state.doc.toString());
            }
          }),
        ],
      },
      parent: this.host.nativeElement.querySelector('.merge-container') as HTMLElement,
      highlightChanges: true,
    });
  }

  // CVA solo se usa en modo normal
  writeValue(value: string) {
    if (this.diffMode()) return;

    if (!this.editor) return;

    const view = this.editor as EditorView;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value ?? '' },
    });
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
