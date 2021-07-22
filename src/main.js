import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store';

import VueTimeago from 'vue-timeago';
import VueTimers from 'vue-timers';

Vue.config.productionTip = false;

Vue.use(VueTimeago, {
  locale: 'en',
});
Vue.use(VueTimers);

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
