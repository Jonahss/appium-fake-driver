import _ from 'lodash';
import { errors } from 'mobile-json-wire-protocol';

let commands = {}, helpers = {}, extensions = {};

helpers.getRawContexts = function () {
  let contexts = {'NATIVE_APP': null};
  let wvs = this.appModel.getWebviews();
  for (let i = 1; i < wvs.length + 1; i++) {
    contexts[`WEBVIEW_${i}`] = wvs[i - 1];
  }
  return contexts;
};

helpers.assertWebviewContext = function () {
  if (this.curContext === 'NATIVE_APP') {
    throw new errors.InvalidContextError();
  }
};

commands.getCurrentContext = async function () {
  return this.curContext;
};

commands.getContexts = async function () {
  return _.keys(this.getRawContexts());
};

commands.setContext = async function (context) {
  let contexts = this.getRawContexts();
  if (_.contains(_.keys(contexts), context)) {
    this.curContext = context;
    if (context === 'NATIVE_APP') {
      this.appModel.deactivateWebview();
    } else {
      this.appModel.activateWebview(contexts[context]);
    }
  } else {
    throw new errors.NoSuchContextError();
  }
};

commands.setFrame = async function (frameId) {
  this.assertWebviewContext();
  if (frameId === null) {
    this.appModel.deactivateFrame();
  } else {
    let nodes = this.appModel.xpathQuery(`//iframe[@id="${frameId}"]`);
    if (!nodes.length) {
      throw new errors.NoSuchFrameError();
    }
    this.appModel.activateFrame(nodes[0]);
  }
};

Object.assign(extensions, commands, helpers);
export { commands, helpers };
export default extensions;
