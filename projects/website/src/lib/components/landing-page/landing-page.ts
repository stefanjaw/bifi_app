import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-landing-page',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  currentYear = signal(dayjs().format('YYYY'));
}
