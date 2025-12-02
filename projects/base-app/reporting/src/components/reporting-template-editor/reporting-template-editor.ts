import { Component, ElementRef, AfterViewInit, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

@Component({
  selector: 'bifi-app-reporting-template-editor',
  standalone: true,
  template: `<div class="max-h-[450px] w-full rounded overflow-auto editor-container"></div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReportingTemplateEditor),
      multi: true,
    },
  ],
})
export class ReportingTemplateEditor implements AfterViewInit, ControlValueAccessor {
  private editor!: EditorView;
  private pendingValue: string | null = null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: string) => {
    /* empty */
  };
  private onTouched = () => {
    /* empty */
  };
  private host = inject(ElementRef);

  ngAfterViewInit() {
    this.editor = new EditorView({
      doc: this.pendingValue ?? '',
      extensions: [
        basicSetup,
        html(),
        oneDark,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            this.onChange(update.state.doc.toString());
          }
        }),
      ],
      parent: this.host.nativeElement.querySelector('.editor-container'),
    });

    // Después de crear el editor, limpiar pendingValue
    this.pendingValue = null;
  }

  writeValue(value: string) {
    if (!this.editor) {
      // Editor no creado → guardar valor
      this.pendingValue = value ?? '';
      return;
    }

    // Editor ya creado → actualizar contenido
    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: value ?? '',
      },
    });
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
