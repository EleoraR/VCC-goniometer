import hostDrawer from './lib/hostDrawer';
import pluginConfig from './lib/configure';
import { APP_NAME } from './lib/constants';

/**
 * Plugin instantiation method
 * @param {*} api An instance of the Coviu interface call plugin API
 */
function plugin(api) {
  return Promise.all([]).then(function () {
    const isHost = api.call.hasOwnerAccess();

    if (isHost) {
      // Registers a drawer for the host
      api.drawers.registerDrawer(hostDrawer(api));
    } 
    return {
      name: APP_NAME,
    };
  });
}

if (typeof configure !== 'undefined') {
  configure(pluginConfig);
} else if (typeof activate !== 'undefined') {
  activate(plugin);
} else {
  module.exports = plugin;
}
