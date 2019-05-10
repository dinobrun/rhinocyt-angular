import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event } from '@angular/router';

import { filter, map, mergeMap } from 'rxjs/operators';

import { Title } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class TitleService {

  /**
   * The default title.
   */
  private static readonly DEFAULT_TITLE: string = 'Cynochew';

  /**
   * The default separator.
   */
  private static readonly DEFAULT_SEPARATOR: string = '-';

  /**
   * The separator of the title.
   */
  private separator: string = TitleService.DEFAULT_SEPARATOR;

  constructor(private title: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  /**
   * Sets the separator for the title.
   * @param separator The separator.
   */
  public setSeparator(separator: string) {
    this.separator = separator;
  }

  /**
   * Sets the DOM title.
   * @param title        The title.
   * @param useSeparator If should use the separator
   *                     (e.g., "My Title - Cynochew").
   */
  public setTitle(title: string, useSeparator: boolean = true) {
    if (useSeparator === true) {
      title += ` ${this.separator} ${TitleService.DEFAULT_TITLE}`;
    }
    this.title.setTitle(title);
  }

  /**
   * Sets the default title.
   */
  public setDefaultTitle() {
    this.setTitle(TitleService.DEFAULT_TITLE, false);
  }

  /**
   * Sets the title when the route changes.
   */
  public setTitleOnRouteChanged() {
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .pipe(map((event: Event) => this.activatedRoute))
      .pipe(map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter((route: ActivatedRoute) => route.outlet === 'primary'))
      .pipe(mergeMap((route: ActivatedRoute) => route.data))
      .subscribe((data: any) => {
          if (typeof data.title === 'string' && data.title.length > 0) {
            this.setTitle(data.title);
          } else {
            this.setDefaultTitle();
          }
      });
  }
}
