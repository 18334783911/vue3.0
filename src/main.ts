import Vue from "vue";
import './plugins/axios'
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./plugins/vxetable.js";
// import layout from  "@/plugins/mylayout.js";
import './assets/icon/iconfont.css'
import "./scss/element-variables.scss";
import './utils/Request'
import store from './store'
import 'vxe-table/lib/index.css'
import EventBus from 'vue-bus-ts';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import BipMenuItem from '@/components/menu/BipMenuItem.vue';
import BipCommEditor from '@/components/editorn/BipCommEditor.vue'
import BipSearchDialog from '@/components/searchdialog/BipSearchDialog.vue'
import BipSearchCont from '@/components/editorn/BipSearchCont.vue'
Vue.component('BaseLayout',BaseLayout);
Vue.component('BipMenuItem',BipMenuItem);
Vue.component('BipCommEditor',BipCommEditor);
Vue.component('BipSearchDialog',BipSearchDialog);
Vue.component('BipSearchCont',BipSearchCont);
Vue.use(EventBus);

var bus = new EventBus.Bus();


Vue.config.productionTip = false;
new Vue({
   bus,
  router,
  store,
  render: h => h(App)
}).$mount("#app");



import Component from 'vue-class-component';

Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate',
]);

// import {ElMessageBox} from 'element-ui/types/message-box'
declare module "vue/types/vue" {
  interface Vue {
    $loading: any,
    $msgbox: any,
    $alert: any,
    $confirm: any,
    $prompt: any,
    $notify: any,
    $message: any
  }
}
