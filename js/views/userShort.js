import $ from 'jquery';
import BaseVw from './baseVw';
import loadTemplate from '../utils/loadTemplate';
import app from '../app';
import Profile from '../models/Profile';

export default class extends BaseVw {
  constructor(options = {}) {
    super(options);
    this.options = options;
    this.guid = options.guid;

    this.loadUser();
    /* the view should be rendered when it is created and before it has data, so it can occupy
       space in the DOM while the data is being fetched. */
  }

  loadUser(guid = this.guid) {
    let profile;
    let profileFetch;

    this.loading = true;

    if (guid === app.profile.id) {
      // don't fetch our this user's own profile, since we have it already
      profileFetch = $.Deferred().resolve();
      profile = app.profile;
    } else {
      profile = new Profile({ id: guid });
      profileFetch = profile.fetch();
    }

    profileFetch.done(() => {
      this.loading = false;
      this.notFound = false;
      this.render();
    }).fail(() => {
      this.loading = false;
      this.notFound = true;
      this.render();
    });
  }

  className() {
    return 'userShort';
  }

  events() {
    return {
      'click .js-tab': 'tabClick',
    };
  }

  tabClick(e) {
    const targ = $(e.target).closest('.js-tab');
    this.selectTab(targ);
  }

  render() {
    loadTemplate('userPage/userPage.html', (t) => {
      this.$el.html(t({
        loading: this.loading,
        notFound: this.notFound,
      }));
    });

    return this;
  }
}
