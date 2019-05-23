/**
 * A SidenavItem represent an item on the sidenav.
 */
export class SidenavItem {

  /**
   * The sidenav item separator.
   */
  private static readonly ITEM_SEPARATOR = new SidenavItem('separator');


  private constructor(public type: SidenavItemType,
                      public text?: string,
                      public url?: string[] | string,
                      public options?: SidenavItemOptions) { }

  /**
   * Returns a new separator item.
   * @return The separator item.
   */
  public static separator() {
    return new SidenavItem('separator');
  }

  /**
   * Returns a new text item.
   * @param  text The text of the item.
   * @param  icon The icon's name.
   * @return      The text item.
   */
  public static text(text: string, options: SidenavItemOptions = {}): SidenavItem {
    return new SidenavItem('text', text, undefined, options);
  }

  /**
   * Returns a new internal link item.
   * @param  text    The text of the item.
   * @param  url     The internal link url (see routerLink input).
   * @param  options The options for the item.
   * @return         The internal link item.
   */
  public static internalLink(text: string, url: string[] | string, options: SidenavItemOptions = {}): SidenavItem {
    return new SidenavItem('internal_link', text, url, options);
  }

  /**
   * Returns a new internal link item.
   * @param  text    The text of the item.
   * @param  url     The internal link url (see routerLink input).
   * @param  options The options for the item.
   * @return         The internal link item.
   */
  public static selectedLable(text: string, url: string[] | string, options: SidenavItemOptions = {}): SidenavItem {
    return new SidenavItem('selected_lable', text, url, options);
  }

  /**
   * Returns a new external link item.
   * @param  text    The text of the item.
   * @param  url     The external link URL.
   * @param  options The options for the item.
   * @return         The external link item.
   */
  public static externalLink(text: string, url: string, options: SidenavItemOptions = {}): SidenavItem {
    return new SidenavItem('external_link', text, url, options);
  }
}

/**
 * Type declaration of the sidenav item type.
 */
export declare type SidenavItemType = 'text' |'selected_lable' | 'internal_link' | 'external_link' | 'separator';

/**
 * Type declaration of the sidenav item options.
 */
export interface SidenavItemOptions {
  icon?: string;
  newTab?: boolean;
  disabled?: boolean;
}
