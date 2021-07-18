import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store';

import VueTimeago from 'vue-timeago';

Vue.config.productionTip = false;

Vue.use(VueTimeago, {
  locale: 'en',
});

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
