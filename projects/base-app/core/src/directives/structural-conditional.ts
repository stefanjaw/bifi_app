import { inject, TemplateRef, ViewContainerRef } from '@angular/core';

export abstract class BaseStructuralConditional {
  protected readonly templateRef = inject(TemplateRef<any>);
  protected readonly viewContainer = inject(ViewContainerRef);
  protected elseTemplateRef: TemplateRef<any> | undefined = undefined;

  protected hasView = false;
  protected hasElseView = false;
  protected condition = false;

  public setCondition(condition: boolean) {
    this.condition = condition;
    this.updateContainer();
  }

  public setElseTemplate(template: TemplateRef<any>) {
    this.elseTemplateRef = template;
    this.updateContainer();
  }

  private clearContainer() {
    this.viewContainer.clear();
    this.hasView = false;
    this.hasElseView = false;
  }

  private updateContainer() {
    if (this.condition) {
      if (!this.hasView) {
        this.clearContainer();
        if (this.templateRef) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        }
      }
    } else {
      if (!this.hasElseView) {
        this.clearContainer();
        if (this.elseTemplateRef) {
          this.viewContainer.createEmbeddedView(this.elseTemplateRef);
          this.hasElseView = true;
        }
      }
    }
  }
}
