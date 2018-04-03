import { Element } from '../../../@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '../../../@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '../../../plastic-image/plastic-image.js';
import '../../../@polymer/iron-icon/iron-icon.js';
import '../mixins/utils-functions.js';
import './shared-styles.js';

// eslint-disable-next-line no-undef
class SessionElement extends UtilsFunctions(GestureEventListeners(Element)) {
  static get template() {
    return `
    <style is="custom-style" include="shared-styles flex flex-alignment positioning"></style>

    <style>

      :host {
        display: block;
        background-color: #fff;
        border-bottom: 1px solid var(--border-light-color);
        height: 100%;
      }

      .session {
        height: 100%;
        color: var(--primary-text-color);
        overflow: hidden;
      }

      .session:hover {
        background-color: var(--additional-background-color);
      }

      .session-icon {
        --iron-icon-width: 88px;
        --iron-icon-height: 88px;
        --iron-icon-fill-color: var(--border-light-color);
        position: absolute;
        right: 40px;
        bottom: -4px;
      }

      .session-header,
      .session-content,
      .session-footer {
        padding: 16px;
        z-index: 1;
      }

      .session-header {
        padding-bottom: 8px;
      }

      .language {
        margin-left: 8px;
        font-size: 12px;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .session-content {
        padding-top: 0;
        padding-bottom: 40px;
      }

      .bookmark-session {
        color: var(--secondary-text-color);
      }

      .session[featured] .bookmark-session {
        color: var(--default-primary-color);
      }

      .bookmark-session:hover {
        color: var(--default-primary-color);
      }

      .session-title {
        font-size: 20px;
        line-height: 1.2;
      }

      .session-meta {
        margin: 0;
        padding: 0;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .session-footer {
        font-size: 14px;
      }

      .speakers {
        margin-top: 10px;
      }
      
      .speaker:not(:last-of-type) {
        padding-bottom: 10px;
      }

      .speaker-photo {
        margin-right: 12px;
        width: 32px;
        height: 32px;
        background-color: var(--secondary-background-color);
        border-radius: 50%;
        overflow: hidden;
        transform: translateZ(0);
      }

      .speaker-name {
        margin-bottom: 4px;
        line-height: 1.2;
      }

      .speaker-title {
        font-size: 12px;
        line-height: 1;
      }

      @media (min-width: 640px) {
        :host {
          border: 1px solid var(--border-light-color);
        }
      }

    </style>

    <a class="session" href\$="/schedule/[[dayName]]?sessionId=[[session.id]]" featured\$="[[isFeatured]]" layout="" vertical="" relative="">
      <iron-icon class="session-icon" icon="hoverboard:[[session.icon]]"></iron-icon>

      <div class="session-header" layout="" horizontal="" justified="">
        <div flex="">
          <h3 class="session-title">[[session.title]]</h3>
        </div>
        <span class="language">[[slice(session.language, 2)]]</span>
      </div>

      <div class="session-content" flex="" layout="" horizontal="" justified="">
        <div class="session-meta">
          <div hidden\$="[[!session.complexity]]">[[session.complexity]]</div>
        </div>
        <iron-icon class="bookmark-session" icon="hoverboard:[[_getFeaturedSessionIcon(featuredSessions, session.id)]]" on-tap="_toggleFeaturedSession"></iron-icon>
      </div>

      <div class="session-footer">
        <div layout="" horizontal="" justified="" center-aligned="">
          <div class="session-meta" flex="">
            <span hidden\$="[[!session.duration.hh]]">[[session.duration.hh]] hour[[_getEnding(session.duration.hh)]]</span>
            <span hidden\$="[[!session.duration.mm]]">[[session.duration.mm]] min[[_getEnding(session.duration.mm)]]</span>
          </div>
          <div hidden\$="[[!session.tags.length]]">
            <template is="dom-repeat" items="[[session.tags]]" as="tag">
              <span class="tag" style\$="color: [[_getTagColor(tag)]]">[[tag]]</span>
            </template>
          </div>
        </div>

        <div class="speakers" hidden\$="[[!session.speakers.length]]">
          <template is="dom-repeat" items="[[session.speakers]]" as="speaker">
            <div class="speaker" layout="" horizontal="" center="">
              <plastic-image class="speaker-photo" srcset="[[speaker.photoUrl]]" sizing="cover" lazy-load="" preload="" fade=""></plastic-image>

              <div class="speaker-details" flex="">
                <div class="speaker-name">[[speaker.name]]</div>
                <div class="speaker-title">[[speaker.company]] / [[speaker.country]]</div>
              </div>
            </div>
          </template>
        </div>

      </div>

    </a>
`;
  }

  static get is() {
    return 'session-element';
  }

  static get properties() {
    return {
      user: Object,
      session: Object,
      featuredSessions: Object,
      sessionColor: {
        type: String,
        computed: '_getTagColor(session.mainTag)',
      },
      isFeatured: {
        type: String,
        computed: '_isFeatured(featuredSessions, session.id)',
      },
    };
  }

  _getTagColor(value) {
    if (ShadyCSS) {
      return ShadyCSS.getComputedStyleValue(this, `--${this.generateClassName(value)}`);
    }
    return getComputedStyle(this, `--${this.generateClassName(value)}`);
  }

  _isFeatured(featuredSessions, sessionId) {
    if (!featuredSessions || !sessionId) return false;
    return featuredSessions[sessionId];
  }

  _getEnding(number) {
    return number > 1 ? 's' : '';
  }

  _getFeaturedSessionIcon(featuredSessions, sessionId) {
    return this.isFeatured ? 'bookmark-check' : 'bookmark-plus';
  }

  _toggleFeaturedSession(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.user.signedIn) {
      toastActions.showToast({
        message: '{$ schedule.saveSessionsSignedOut $}',
        action: {
          title: 'Sign in',
          callback: () => {
            dialogsActions.openDialog(DIALOGS.SIGNIN);
          },
        },
      });
      return;
    }
    const sessions = Object.assign({}, this.featuredSessions, {
      [this.session.id]: !this.featuredSessions[this.session.id] ? true : null,
    });

    sessionsActions.setUserFeaturedSessions(this.user.uid, sessions);
  }
}

window.customElements.define(SessionElement.is, SessionElement);