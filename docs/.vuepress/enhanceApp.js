import Vuex from 'vuex'
import store from './theme/store/index'
import './theme/styles/styles.scss'

export default ({
  Vue,
  options,
  router,
  siteData
}) => {

  Vue.use(Vuex)
  
  /**
   * Global Mixins
   */
  Vue.mixin({
    store: store,
    computed: {
      // Creates an easy way to access site data globally
      getSiteData() {
        return siteData
      }
    }
  })

  /**
   * Get the latest version
   * Good for use in pages, etc.
   */
  Vue.mixin({
    computed: {
      latestVer() {
        return siteData.themeConfig.latestVer
      }
    }
  })

  /**
   * find the version in the URI
   * and push it to the route as a param so
   * that we can access it later.
   */
  router.beforeEach((to, from, next) => {
    const query = /(\d+\.)(\d+\.)?(\d+\.)(\d)/gm;
    const pathMatch = to.path.match(query);
    const match = pathMatch ? pathMatch[0] : null;

    if (!to.params.version) {
      to.params.version = match;
      next();
    } else {
      next();
    }
  });
}
