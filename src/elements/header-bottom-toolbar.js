import { Element } from '../../../@polymer/polymer/polymer-element.js';
import '../mixins/utils-functions.js';
import '../mixins/redux-mixin.js';
import './shared-styles.js';
import './content-loader.js';

// eslint-disable-next-line no-undef
class HeaderBottomToolbar extends UtilsFunctions(ReduxMixin(Element)) {
  static get template() {
    return `
    <style is="custom-style" include="shared-styles flex flex-alignment positioning"></style>

    <style>

      :host {
        display: block;
        background-color: var(--primary-background-color);
      }

      app-toolbar {
        margin: 0 auto;
        padding: 0 16px;
        height: auto;
        max-width: var(--max-container-width);
      }

      .nav-items {
        --paper-tabs-selection-bar-color: var(--default-primary-color);
        --paper-tabs: {
          height: 64px;
        };
      }

      .nav-item a {
        padding: 0 14px;
        color: var(--primary-text-color);
        text-transform: uppercase;
      }

      @media (min-width: 640px) {
        app-toolbar {
          padding: 0 36px;
        }
      }

    </style>


    <app-toolbar class="bottom-toolbar">

      <content-loader class="nav-items" card-padding="15px" card-width="105px" card-margin="0 14px 0 0" card-height="64px" avatar-size="0" avatar-circle="0" title-top-position="20px" title-height="24px" title-width="75%" load-from="-240%" load-to="350%" blur-width="80px" items-count="{\$ contentLoaders.schedule.itemsCount \$}" layout="" horizontal="" hidden\$="[[contentLoaderVisibility]]">
      </content-loader>

      <paper-tabs class="nav-items" selected="[[route.subRoute]]" attr-for-selected="day" noink="">
        <template is="dom-repeat" items="[[transformToArray(schedule.days, 'date')]]" as="day">
          <paper-tab class="nav-item" day="[[day.date]]" link="">
            <a href\$="/schedule/[[day.date]]" layout="" vertical="" center-center="">[[day.dateReadable]]</a>
          </paper-tab>
        </template>
      </paper-tabs>
    </app-toolbar>
`;
  }

  static get is() {
    return 'header-bottom-toolbar';
  }

  static get properties() {
    return {
      route: {
        type: String,
        statePath: 'routing',
      },
      schedule: {
        type: Object,
        statePath: 'schedule',
      },
      contentLoaderVisibility: {
        type: String,
        value: null,
      },
    };
  }

  static get observers() {
    return [
      '_scheduleChanged(schedule.days)',
    ];
  }

  _scheduleChanged() {
    if (this.schedule.days) {
      this.contentLoaderVisibility = 'hidden';
    }
  }
}

customElements.define(HeaderBottomToolbar.is, HeaderBottomToolbar);