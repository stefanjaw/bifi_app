import {
  Component,
  ElementRef,
  inject,
  ChangeDetectionStrategy,
  forwardRef,
  input,
  effect,
  AfterViewInit,
  computed,
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
import { Diagnostic, linter } from '@codemirror/lint';

import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formCodeEditorLanguages } from '../../interfaces/form-code-editor-languages';
import { LanguageSupport, syntaxTree } from '@codemirror/language';
import { Compartment } from '@codemirror/state';
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
  private languageCompartment = new Compartment();
  private formCodeFormatter = inject(FormCodeFormatter);

  // inputs normales
  language = input<formCodeEditorLanguages | undefined>('text/html');

  languageSupport = computed(() => {
    const language = this.language();

    switch (language) {
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
  });

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
  private initialValue: string | undefined = undefined;

  codeExtentions = [basicSetup, oneDark, keymap.of([indentWithTab]), EditorView.lineWrapping];

  constructor() {
    effect(() => {
      const languageSupport = this.languageSupport();

      // if no editor, abort
      if (!this.editor) return;

      if (this.diffMode()) {
        const editor = this.editor as MergeView;

        editor.a.dispatch({
          effects: this.languageCompartment.reconfigure(languageSupport),
        });
        editor.b.dispatch({
          effects: this.languageCompartment.reconfigure(languageSupport),
        });
      } else {
        const editor = this.editor as EditorView;
        editor.dispatch({ effects: this.languageCompartment.reconfigure(languageSupport) });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.diffMode()) {
      this.createDiffEditor(this.languageSupport());
    } else {
      this.createNormalEditor(this.languageSupport());

      if (this.initialValue) {
        const editor = this.editor as EditorView;

        editor.dispatch({
          changes: { from: 0, to: editor.state.doc.length, insert: this.initialValue },
        });

        // once flag was used, empty it
        this.initialValue = undefined;
      }
    }
  }

  // ------------------------------
  // NORMAL MODE
  // ------------------------------
  private createNormalEditor(languageSupport: LanguageSupport) {
    this.editor = new EditorView({
      doc: '',
      extensions: [
        ...this.codeExtentions,
        this.languageCompartment.of(languageSupport),
        linter(this.syntaxErrorLinter()),
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
  // DIFF MODE
  // ------------------------------
  private createDiffEditor(languageSupport: LanguageSupport) {
    const original = this.leftFormControl()?.value ?? '';
    const modified = this.rightFormControl()?.value ?? '';

    this.editor = new MergeView({
      a: {
        doc: original,
        extensions: [
          ...this.codeExtentions,
          this.languageCompartment.of(languageSupport),
          linter(this.syntaxErrorLinter()),
          EditorView.updateListener.of(update => {
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
          ...this.codeExtentions,
          this.languageCompartment.of(languageSupport),
          linter(this.syntaxErrorLinter()),
          EditorView.updateListener.of(update => {
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

  // CVA solo se usa en modo normal
  writeValue(value: string) {
    if (this.diffMode()) return;

    this.initialValue = value ?? '';

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

  syntaxErrorLinter() {
    return (view: EditorView): Diagnostic[] => {
      const diagnostics: Diagnostic[] = [];
      const tree = syntaxTree(view.state);

      tree.iterate({
        enter(node) {
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

  async formatCode() {
    const lang = this.language() ?? 'text/html';

    const formatContent = (content: string) => this.formCodeFormatter.format(content, lang);

    if (this.diffMode()) {
      // Format BOTH panels
      const merge = this.editor as MergeView;

      const leftDoc = merge.a.state.doc.toString();
      const rightDoc = merge.b.state.doc.toString();

      const leftFormatted = await formatContent(leftDoc);
      const rightFormatted = await formatContent(rightDoc);

      merge.a.dispatch({
        changes: { from: 0, to: merge.a.state.doc.length, insert: leftFormatted },
      });

      merge.b.dispatch({
        changes: { from: 0, to: merge.b.state.doc.length, insert: rightFormatted },
      });

      this.leftFormControl()?.setValue(leftFormatted);
      this.rightFormControl()?.setValue(rightFormatted);
    } else {
      // Normal editor
      const editor = this.editor as EditorView;
      const current = editor.state.doc.toString();
      const formatted = await formatContent(current);

      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: formatted },
      });

      this.onChange(formatted);
    }
  }
}
