import { Element } from '../../../../@polymer/polymer/polymer-element.js';
import '../../../../@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../../../../@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '../../../../@polymer/app-layout/app-toolbar/app-toolbar.js';
import '../../../../plastic-image/plastic-image.js';
import '../../../../@polymer/iron-icon/iron-icon.js';
import { IronOverlayBehavior } from '../../../../@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import '../../../../@polymer/marked-element/marked-element.js';
import '../../mixins/utils-functions.js';
import '../../mixins/redux-mixin.js';
import '../text-truncate.js';
import '../shared-styles.js';
import './dialog-styles.js';
import { mixinBehaviors } from '../../../../@polymer/polymer/lib/legacy/class.js';

// eslint-disable-next-line no-undef
class SpeakerDetails extends UtilsFunctions(
  ReduxMixin(mixinBehaviors([IronOverlayBehavior], Element))
) {
  static get template() {
    return `
    <style is="custom-style" include="shared-styles dialog-styles flex flex-alignment positioning"></style>

    <style>

      .photo {
        margin-right: 16px;
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background-color: var(--contrast-additional-background-color);
        transform: translateZ(0);
      }

      .badge:not(:last-of-type)::after {
        margin-left: -4px;
        content: ',';
      }

      .action {
        color: var(--secondary-text-color);
      }

    </style>

    <app-header-layout has-scrolling-region="">
      <app-header slot="header" class="header" fixed="[[viewport.isTabletPlus]]">
        <iron-icon class="close-icon" icon="hoverboard:[[_getCloseBtnIcon(viewport.isLaptopPlus)]]" on-tap="close"></iron-icon>

        <app-toolbar>
          <div class="dialog-container header-content" layout="" horizontal="" center="">
            <plastic-image class="photo" srcset="[[speaker.photoUrl]]" sizing="cover" lazy-load="" preload="" fade=""></plastic-image>
            <h2 class="name" flex="">[[speaker.name]]</h2>
          </div>
        </app-toolbar>
      </app-header>

      <div class="dialog-container content">
        <h3 class="meta-info">[[speaker.country]]</h3>
        <h3 class="meta-info">[[speaker.title]], [[speaker.company]]</h3>
        <h3 class="meta-info" hidden\$="[[isEmpty(speaker.badges)]]">
          <template is="dom-repeat" items="[[speaker.badges]]" as="badge">
            <a class="badge" href\$="[[badge.link]]" target="_blank" rel="noopener noreferrer" title\$="[[badge.description]]">
              [[badge.description]]
            </a>
          </template>
        </h3>

        <marked-element class="description" markdown="[[speaker.bio]]">
          <div slot="markdown-html"></div>
        </marked-element>

        <div class="actions" layout="" horizontal="">
          <template is="dom-repeat" items="[[speaker.socials]]" as="social">
            <a class="action" href\$="[[social.link]]" target="_blank" rel="noopener noreferrer">
              <iron-icon icon="hoverboard:[[social.icon]]"></iron-icon>
            </a>
          </template>
        </div>

        <div class="additional-sections" hidden\$="[[!speaker.sessions.length]]">
          <h3>{\$ speakerDetails.sessions \$}</h3>

          <template is="dom-repeat" items="[[speaker.sessions]]" as="session">
            <a href\$="/schedule?sessionId=[[session.id]]" class="section" on-tap="close">
              <div layout="" horizontal="" center="">
                <div class="section-details" flex="">
                  <div class="section-primary-text">[[session.title]]</div>
                  <div class="section-secondary-text" hidden\$="[[!session.dateReadable]]">[[session.dateReadable]], [[session.startTime]] - [[session.endTime]]</div>
                  <div class="section-secondary-text" hidden\$="[[!session.track.title]]">[[session.track.title]]</div>
                  <div class="tags" hidden\$="[[!session.tags.length]]">
                    <template is="dom-repeat" items="[[session.tags]]" as="tag">
                      <span class="tag" style\$="color: [[getVariableColor(tag)]]">[[tag]]</span>
                    </template>
                  </div>
                </div>
              </div>
            </a>
          </template>
        </div>

      </div>
    </app-header-layout>
`;
  }

  static get is() {
    return 'speaker-details';
  }

  static get properties() {
    return {
      speaker: {
        type: Object,
      },
      viewport: {
        type: Object,
        statePath: 'ui.viewport',
      },
    };
  }

  constructor() {
    super();
    this.addEventListener('iron-overlay-canceled', this._close);
  }

  static get observers() {
    return [
      '_handleClose(opened, speaker)',
    ];
  }

  _close() {
    dialogsActions.closeDialog(DIALOGS.SPEAKER);
  }

  _handleClose(opened, speaker) {
    if (!opened && speaker && Object.keys(speaker).length) {
      this._close();
      history.back();
    }
  }

  _getCloseBtnIcon(isLaptopViewport) {
    return isLaptopViewport ? 'close' : 'arrow-left';
  }
}

window.customElements.define(SpeakerDetails.is, SpeakerDetails);