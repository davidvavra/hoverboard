import { Element } from '../../../@polymer/polymer/polymer-element.js';
import '../../../plastic-image/plastic-image.js';
import '../../../@polymer/paper-button/paper-button.js';
import '../../../@polymer/iron-icon/iron-icon.js';
import '../mixins/utils-functions.js';
import '../mixins/redux-mixin.js';
import './shared-styles.js';
import './text-truncate.js';

// eslint-disable-next-line no-undef
class LatestPostsBlock extends UtilsFunctions(ReduxMixin(Element)) {
  static get template() {
    return `
    <style is="custom-style" include="shared-styles flex flex-alignment"></style>

    <style>

      :host {
        display: block;
      }

      .posts-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 16px;
      }

      .image {
        width: 100%;
        height: 128px;
      }

      .details {
        padding: 16px;
      }

      .title {
        font-size: 20px;
        line-height: 1.2;
      }

      .description {
        margin-top: 8px;
        color: var(--secondary-text-color)
      }

      .date {
        margin-top: 16px;
        font-size: 12px;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .cta-button {
        margin-top: 24px;
      }

      @media (min-width: 640px) {
        .posts-wrapper {
          grid-template-columns: repeat(3, 1fr);
        }

        .post:last-of-type {
          display: none;
        }
      }

      @media (min-width: 812px) {
        .posts-wrapper {
          grid-template-columns: repeat(4, 1fr);
        }

        .post:last-of-type {
          display: flex;
        }
      }

    </style>

    <div class="container">
      <h1 class="container-title">{\$ latestPostsBlock.title \$}</h1>

      <div class="posts-wrapper">
        <template is="dom-repeat" items="[[posts]]" as="post">
          <a href\$="/blog/posts/[[post.id]]/" class="post card" ga-on="click" ga-event-category="blog" ga-event-action="open post" ga-event-label\$="[[post.title]]" flex="" layout="" vertical="">
            <plastic-image class="image" srcset="[[post.image]]" style\$="background-color: [[post.backgroundColor]];" sizing="cover" lazy-load="" preload="" fade=""></plastic-image>
            <div class="details" layout="" vertical="" justified="" flex-auto="">
              <div>
                <text-truncate lines="2">
                  <h3 class="title">[[post.title]]</h3>
                </text-truncate>
                <text-truncate lines="3">
                  <p class="description">[[post.brief]]</p>
                </text-truncate>
              </div>
              <div class="date">[[getDate(post.published)]]</div>
            </div>
          </a>
        </template>
      </div>

      <a href="{\$ latestPostsBlock.callToAction.link \$}">
        <paper-button class="cta-button animated icon-right">
          <span>{\$ latestPostsBlock.callToAction.label \$}</span>
          <iron-icon icon="hoverboard:arrow-right-circle"></iron-icon>
        </paper-button>
      </a>
    </div>
`;
  }

  static get is() {
    return 'latest-posts-block';
  }

  static get properties() {
    return {
      postsSource: {
        type: Object,
        statePath: 'blog',
        observer: '_transformPosts',
      },
      viewport: {
        type: Object,
        statePath: 'ui.viewport',
      },
      posts: Array,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!Object.keys(this.postsSource).length) blogActions.fetchList();
  }

  _transformPosts(postsSource) {
    const sortedPosts = this.transformToArray(postsSource, 'id')
      .sort((a, b) => b.published.localeCompare(a.published));
    this.set('posts', sortedPosts.slice(0, 4));
  }
}

window.customElements.define(LatestPostsBlock.is, LatestPostsBlock);