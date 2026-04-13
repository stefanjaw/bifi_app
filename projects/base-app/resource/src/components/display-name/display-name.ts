import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'bifi-app-display-name',
  imports: [TagModule],
  templateUrl: './display-name.html',
})
export class DisplayName {
  info = input<string[] | null | undefined>();

  values = computed(() => {
    const data = this.info();

    if (!data || data.length === 0) {
      return ['Not set'];
    }

    return data;
  });
}
