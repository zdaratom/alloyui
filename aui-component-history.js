YUI.add('my-search-params', function(Y) {
    Y.namespace('MY');
    var HISTORY, ATTR = MY._aliases;

    Y.MY.SearchParams = Y.Base.create('my-search-params', Y.Base, [], {
        initializer: function() {
            var self = this;
            HISTORY = new Y.HistoryHash({initialState: {t: self.get('defaultTab')}});
            HISTORY.on('change', function(event) {
                var params = {_change: {}}
                ;
                MY._each(ATTR, function(attrName, name) {
                    if (event.removed[attrName]) {
                        params[name] = self._getDefaultValue(name);
                    }
                    else if (event.changed[attrName]) {
                        params[name] = event.changed[attrName].newVal;
                        params._change[name] = true;
                    } else {
                        params[name] = HISTORY.get(attrName) || self._getDefaultValue(name);
                    }
                });
                if (!params._change.page) {
                    params.page = 1;
                }
                self.fire('paramsChanged', params);
            });
        },
        _getDefaultValue: function(name) {
            return this.get('default' + name.charAt(0).toUpperCase() + name.slice(1)) || "";
        },
        setParam: function(name, value) {
            var attrName = ATTR[name];
            HISTORY.addValue(attrName, value || null);
            if (name != 'page') {
                this.setParam('page', 1);
            }
        },
        getParam: function(name) {
            var attrName = ATTR[name];
            return HISTORY.get(attrName)==null?"":HISTORY.get(attrName);
        },
        prevPage: function() {
            var actualPage = HISTORY.get(ATTR['page'])==undefined?1:HISTORY.get(ATTR['page']);
            if (actualPage>1) {
                this.setParam('page', actualPage-1);
            }else{
                this.setParam('page', 1);
            }
        },  
        nextPage: function() {
            var actualPage = HISTORY.get(ATTR['page'])==undefined?1:HISTORY.get(ATTR['page']);
            this.setParam('page', (actualPage*1)+1);
        },       
        /*cannot be performed in initializer because it requires paramsChanged to be prepared*/
        initialSearch: function() {
            var self = this
                    , params = {}
            ;
            if (MY._each(HISTORY.get())) {
                MY._each(ATTR, function(attrName, name) {
                    params[name] = HISTORY.get(attrName) || self._getDefaultValue(name);
                });
                self.fire('paramsChanged', params);
            }
        }
    },
    {
        ATTRS: {
            defaultTab: "all",
            defaultPage: 1
        }
    });
}, '1.0.0', {requires: ['widget', 'base-build', 'node', 'event', 'attribute', 'history', 'event-outside']});