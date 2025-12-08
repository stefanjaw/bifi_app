import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'bifi-app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  currentYear = signal(dayjs().format('YYYY'));
}
