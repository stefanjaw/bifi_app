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

import type { EditorView } from 'codemirror';
import type { MergeView } from '@codemirror/merge';
import type { LanguageSupport } from '@codemirror/language';
import type { Compartment } from '@codemirror/state';
import type { Diagnostic } from '@codemirror/lint';

import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formCodeEditorLanguages } from '../../interfaces/form-code-editor-languages';
import { ButtonModule } from 'primeng/button';
import { FormCodeFormatter } from '../../services/form-code-formatter';

@Component({
  selector: 'bifi-app-form-code-editor',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCodeEditor),
      multi: true,
    },
  ],
  imports: [ButtonModule],
  templateUrl: './form-code-editor.html',
  styleUrl: './form-code-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCodeEditor implements AfterViewInit {
  private editor!: EditorView | MergeView;
  private languageCompartment!: Compartment;
  private formCodeFormatter = inject(FormCodeFormatter);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  private _cm: any = null;
  private _modulesReady = false;

  language = input<formCodeEditorLanguages | undefined>('text/html');
  diffMode = input<boolean>(false);
  leftFormControl = input<FormControl>();
  rightFormControl = input<FormControl>();

  private initialValue: string | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange = (_value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};

  constructor() {
    effect(() => {
      const language = this.language();
      if (!this._modulesReady || !this.editor || !this._cm) return;

      const languageSupport: LanguageSupport = this._cm.getLanguage(language);

      if (this.diffMode()) {
        const editor = this.editor as MergeView;
        editor.a.dispatch({ effects: this.languageCompartment.reconfigure(languageSupport) });
        editor.b.dispatch({ effects: this.languageCompartment.reconfigure(languageSupport) });
      } else {
        (this.editor as EditorView).dispatch({
          effects: this.languageCompartment.reconfigure(languageSupport),
        });
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    const [
      { EditorView, basicSetup },
      { MergeView },
      { indentWithTab },
      { keymap },
      { html },
      { javascript },
      { css },
      { oneDark },
      { linter },
      { syntaxTree },
      { Compartment },
    ] = await Promise.all([
      import('codemirror'),
      import('@codemirror/merge'),
      import('@codemirror/commands'),
      import('@codemirror/view'),
      import('@codemirror/lang-html'),
      import('@codemirror/lang-javascript'),
      import('@codemirror/lang-css'),
      import('@codemirror/theme-one-dark'),
      import('@codemirror/lint'),
      import('@codemirror/language'),
      import('@codemirror/state'),
    ]);

    this.languageCompartment = new Compartment();

    const getLanguage = (lang: formCodeEditorLanguages | undefined): LanguageSupport => {
      switch (lang) {
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
    };

    this._cm = {
      getLanguage,
      extensions: [basicSetup, oneDark, keymap.of([indentWithTab]), EditorView.lineWrapping],
      EditorView,
      MergeView,
      linter,
      syntaxTree,
    };
    this._modulesReady = true;

    const languageSupport = getLanguage(this.language());

    if (this.diffMode()) {
      this.createDiffEditor(languageSupport);
    } else {
      this.createNormalEditor(languageSupport);

      if (this.initialValue) {
        const editor = this.editor as EditorView;
        editor.dispatch({
          changes: { from: 0, to: editor.state.doc.length, insert: this.initialValue },
        });
        this.initialValue = undefined;
      }
    }
  }

  private syntaxErrorLinterFn(): (view: EditorView) => Diagnostic[] {
    const syntaxTree = this._cm.syntaxTree;
    return (view: EditorView): Diagnostic[] => {
      const diagnostics: Diagnostic[] = [];
      syntaxTree(view.state).iterate({
        enter(node: any) {
          if (node.type.isError) {
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: 'error',
              message: 'Syntax error',
            });
          }
        },
      });
      return diagnostics;
    };
  }

  private createNormalEditor(languageSupport: LanguageSupport): void {
    const { extensions, EditorView, linter } = this._cm;
    this.editor = new EditorView({
      doc: '',
      extensions: [
        ...extensions,
        this.languageCompartment.of(languageSupport),
        linter(this.syntaxErrorLinterFn()),
        EditorView.updateListener.of((update: any) => {
          if (update.docChanged) {
            this.onChange(update.state.doc.toString());
          }
        }),
      ],
      parent: this.host.nativeElement.querySelector('.editor-container') as HTMLElement,
    });
  }

  private createDiffEditor(languageSupport: LanguageSupport): void {
    const { extensions, EditorView, MergeView, linter } = this._cm;
    const original = this.leftFormControl()?.value ?? '';
    const modified = this.rightFormControl()?.value ?? '';

    this.editor = new MergeView({
      a: {
        doc: original,
        extensions: [
          ...extensions,
          this.languageCompartment.of(languageSupport),
          linter(this.syntaxErrorLinterFn()),
          EditorView.updateListener.of((update: any) => {
            if (update.docChanged) {
              this.leftFormControl()?.setValue(update.state.doc.toString());
              this.leftFormControl()?.markAsDirty();
            }
          }),
        ],
      },
      b: {
        doc: modified,
        extensions: [
          ...extensions,
          this.languageCompartment.of(languageSupport),
          linter(this.syntaxErrorLinterFn()),
          EditorView.updateListener.of((update: any) => {
            if (update.docChanged) {
              this.rightFormControl()?.setValue(update.state.doc.toString());
              this.rightFormControl()?.markAsDirty();
            }
          }),
        ],
      },
      parent: this.host.nativeElement.querySelector('.merge-container') as HTMLElement,
      highlightChanges: true,
    });
  }

  writeValue(value: string): void {
    if (this.diffMode()) return;

    this.initialValue = value ?? '';

    if (!this.editor) return;

    const view = this.editor as EditorView;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value ?? '' },
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  async formatCode(): Promise<void> {
    const lang = this.language() ?? 'text/html';
    const formatContent = (content: string) => this.formCodeFormatter.format(content, lang);

    if (this.diffMode()) {
      const merge = this.editor as MergeView;
      const [leftFormatted, rightFormatted] = await Promise.all([
        formatContent(merge.a.state.doc.toString()),
        formatContent(merge.b.state.doc.toString()),
      ]);

      merge.a.dispatch({
        changes: { from: 0, to: merge.a.state.doc.length, insert: leftFormatted },
      });
      merge.b.dispatch({
        changes: { from: 0, to: merge.b.state.doc.length, insert: rightFormatted },
      });

      this.leftFormControl()?.setValue(leftFormatted);
      this.rightFormControl()?.setValue(rightFormatted);
    } else {
      const editor = this.editor as EditorView;
      const formatted = await formatContent(editor.state.doc.toString());
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: formatted },
      });
      this.onChange(formatted);
    }
  }
}
