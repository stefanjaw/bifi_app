import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import grapesjs, { Editor } from 'grapesjs';
import grapesjsMjml from 'grapesjs-mjml';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import grapesjsRte from 'grapesjs-rte-extensions';

export interface EmailEditorOutput {
  designJson: any;
  mjml: string;
  html: string;
}

type InspectorTab = 'styles' | 'settings' | 'layers';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const GJS_DEVICE: Record<DeviceMode, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile portrait',
};

const DEFAULT_MJML = `<mjml>
  <mj-body background-color="#f4f4f4">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="22px" font-weight="bold" color="#222222">Hello there 👋</mj-text>
        <mj-text font-size="14px" color="#555555" line-height="22px">
          Start designing your email by dragging blocks from the left panel,
          or double-click any text to edit it inline.
        </mj-text>
        <mj-button background-color="#2563eb" href="#">Call to action</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

@Component({
  selector: 'bifi-app-email-editor',
  imports: [TranslatePipe],
  templateUrl: './email-editor.html',
  styleUrl: './email-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailEditor implements AfterViewInit, OnDestroy {
  private translationService = inject(TranslationService);

  private gjsContainer = viewChild.required<ElementRef<HTMLDivElement>>('gjs');
  private blocksContainer = viewChild.required<ElementRef<HTMLDivElement>>('blocks');
  private stylesContainer = viewChild.required<ElementRef<HTMLDivElement>>('styles');
  private selectorsContainer = viewChild.required<ElementRef<HTMLDivElement>>('selectors');
  private traitsContainer = viewChild.required<ElementRef<HTMLDivElement>>('traits');
  private layersContainer = viewChild.required<ElementRef<HTMLDivElement>>('layers');

  designJson = input<any>(null);

  private editor: Editor | null = null;
  private initialized = signal(false);
  private pendingDesign = signal<any>(null);
  private dividerLineSectorEl: HTMLElement | null = null;

  activeTab = signal<InspectorTab>('styles');
  activeDevice = signal<DeviceMode>('desktop');
  leftCollapsed = signal(false);
  rightCollapsed = signal(false);

  codeDialogVisible = signal(false);
  codeMjml = signal('');
  codeHtml = signal('');

  constructor() {
    effect(() => {
      const design = this.designJson();
      if (this.initialized() && this.editor && design) {
        this.loadDesign(design);
      } else if (design) {
        this.pendingDesign.set(design);
      }
    });
  }

  ngAfterViewInit(): void {
    this.editor = grapesjs.init({
      container: this.gjsContainer().nativeElement,
      fromElement: false,
      height: '100%',
      width: 'auto',
      storageManager: false,
      panels: { defaults: [] },
      blockManager: { appendTo: this.blocksContainer().nativeElement },
      styleManager: { appendTo: this.stylesContainer().nativeElement },
      selectorManager: { appendTo: this.selectorsContainer().nativeElement },
      traitManager: { appendTo: this.traitsContainer().nativeElement },
      layerManager: { appendTo: this.layersContainer().nativeElement },
      plugins: [grapesjsMjml, grapesjsRte],
      pluginsOpts: {
        [grapesjsRte as any]: {
          base: {
            bold: true,
            italic: true,
            underline: true,
            strikethrough: true,
            link: true,
          },
          fonts: true,
          fontName: true,
          fontSize: true,
          fontColor: true,
          hilite: true,
          format: true,
          textAlign: true,
          actionbar: true,
        },
      },
    });

    // Remove any panels grapesjs-mjml adds so no native chrome renders.
    this.editor.Panels.getPanels().reset();

    // Add border controls (Line sector) scoped to mj-divider.
    this.extendDividerStyles(this.editor);

    // Register Tablet device alongside the plugin's Desktop + Mobile portrait.
    this.editor.DeviceManager.add({
      name: GJS_DEVICE.tablet,
      width: '768px',
    });

    const pending = this.pendingDesign();
    if (pending) {
      this.loadDesign(pending);
      this.pendingDesign.set(null);
    } else {
      this.editor.setComponents(DEFAULT_MJML);
    }

    this.editor.setDevice(GJS_DEVICE.desktop);
    this.initialized.set(true);
  }

  private loadDesign(design: any): void {
    if (!this.editor) return;
    try {
      if (design && typeof design === 'object' && Object.keys(design).length) {
        this.editor.loadProjectData(design);
      }
    } catch {
      this.editor.setComponents(DEFAULT_MJML);
    }
  }

  private extendDividerStyles(editor: Editor): void {
    editor.StyleManager.addSector('mj-divider-line', {
      name: this.translationService.translate('editor.line', {}, 'email-marketing'),
      open: true,
      properties: [
        {
          type: 'integer',
          label: this.translationService.translate('editor.thickness', {}, 'email-marketing'),
          property: 'border-width',
          units: ['px'],
          default: '4',
          min: 1,
        } as any,
        {
          type: 'color',
          label: this.translationService.translate('editor.color', {}, 'email-marketing'),
          property: 'border-color',
          default: '#000000',
        } as any,
        {
          type: 'select',
          label: this.translationService.translate('editor.style', {}, 'email-marketing'),
          property: 'border-style',
          default: 'solid',
          options: [
            {
              id: 'solid',
              label: this.translationService.translate('editor.solid', {}, 'email-marketing'),
            },
            {
              id: 'dashed',
              label: this.translationService.translate('editor.dashed', {}, 'email-marketing'),
            },
            {
              id: 'dotted',
              label: this.translationService.translate('editor.dotted', {}, 'email-marketing'),
            },
          ],
        } as any,
      ],
    } as any);

    const showSector = (visible: boolean): void => {
      if (!this.dividerLineSectorEl) {
        const container = this.stylesContainer().nativeElement;
        const titles = container.querySelectorAll<HTMLElement>('.gjs-sm-sector-title');
        for (const title of Array.from(titles)) {
          if (
            title.textContent?.trim() ===
            this.translationService.translate('editor.line', {}, 'email-marketing')
          ) {
            this.dividerLineSectorEl = title.closest<HTMLElement>('.gjs-sm-sector');
            break;
          }
        }
      }
      if (this.dividerLineSectorEl) {
        this.dividerLineSectorEl.style.display = visible ? '' : 'none';
      }
    };

    requestAnimationFrame(() => showSector(false));

    editor.on('component:selected', (component: any) => {
      showSector(component?.get('type') === 'mj-divider');
    });

    editor.on('component:deselected', () => showSector(false));
  }

  setTab(tab: InspectorTab): void {
    this.activeTab.set(tab);
  }

  setActiveDevice(device: DeviceMode): void {
    if (!this.editor) return;
    this.editor.setDevice(GJS_DEVICE[device]);
    this.activeDevice.set(device);
  }

  toggleLeft(): void {
    this.leftCollapsed.update(v => !v);
  }

  toggleRight(): void {
    this.rightCollapsed.update(v => !v);
  }

  undo(): void {
    this.editor?.runCommand('core:undo');
  }

  redo(): void {
    this.editor?.runCommand('core:redo');
  }

  openCode(): void {
    const output = this.getOutput();
    this.codeMjml.set(output.mjml);
    this.codeHtml.set(output.html);
    this.codeDialogVisible.set(true);
  }

  closeCode(): void {
    this.codeDialogVisible.set(false);
  }

  copy(value: string): void {
    if (value && navigator?.clipboard) {
      navigator.clipboard.writeText(value).catch(() => undefined);
    }
  }

  getOutput(): EmailEditorOutput {
    if (!this.editor) {
      return { designJson: null, mjml: '', html: '' };
    }
    const designJson = this.editor.getProjectData();
    const mjml = this.editor.getHtml();
    let html = '';
    try {
      const result: any = this.editor.runCommand('mjml-code-to-html');
      html = result?.html ?? '';
    } catch {
      html = '';
    }
    return { designJson, mjml, html };
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }
}
