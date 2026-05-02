var WinJS = {};
WinJS.Application = {};
WinJS.Application.eventRecord = {};
WinJS.Application.InMemoryHelper = {};
WinJS.Application.IOHelper = {};
WinJS.Binding = {};
WinJS.Binding.dynamicObservableMixin = {};
WinJS.Binding.FilteredListProjection = {};
WinJS.Binding.GroupedSortedListProjection = {};
WinJS.Binding.GroupsListProjection = {};
WinJS.Binding.List = {};
WinJS.Binding.ListBase = {};
WinJS.Binding.ListBaseWithMutators = {};
WinJS.Binding.ListProjection = {};
WinJS.Binding.observableMixin = {};
WinJS.Binding.SortedListProjection = {};
WinJS.Binding.Template = {};
WinJS.Binding.Template.render = {};
WinJS.Class = {};
WinJS.Namespace = {};
WinJS.Navigation = {};
WinJS.Navigation.beforenavigate = {};
WinJS.Navigation.navigated = {};
WinJS.Navigation.navigating = {};
WinJS.Promise = {};
WinJS.PromiseStateMachine = {};
WinJS.Resources = {};
WinJS.UI = {};
WinJS.UI._LayoutCommon = {};
WinJS.UI._Selection.prototype = {};
WinJS.UI._SelectionManager.prototype = {};
WinJS.UI.Animation = {};
WinJS.UI.AppBar = {};
WinJS.UI.AppBarCommand = {};
WinJS.UI.BrowseMode.selectionchanging = {};
WinJS.UI.DatePicker = {};
WinJS.UI.DOMEventMixin = {};
WinJS.UI.FlipView = {};
WinJS.UI.Flyout = {};
WinJS.UI.Fragments = {};
WinJS.UI.GridLayout = {};
WinJS.UI.IListBinding = {};
WinJS.UI.IListDataSource = {};
WinJS.UI.ListLayout = {};
WinJS.UI.ListView = {};
WinJS.UI.ListView.ListViewAnimationType = {};
WinJS.UI.ListView.SelectionMode = {};
WinJS.UI.ListView.SwipeBehavior = {};
WinJS.UI.ListView.TapBehavior = {};
WinJS.UI.Menu = {};
WinJS.UI.MenuCommand = {};
WinJS.UI.Pages = {};
WinJS.UI.Pages._mixin = {};
WinJS.UI.Rating = {};
WinJS.UI.select = {};
WinJS.UI.SelectionManager.selectionchanging = {};
WinJS.UI.SemanticZoom = {};
WinJS.UI.SettingsFlyout = {};
WinJS.UI.TabContainer = {};
WinJS.UI.TimePicker = {};
WinJS.UI.ToggleSwitch = {};
WinJS.UI.Tooltip = {};
WinJS.UI.ViewBox = {};
WinJS.UI.VirtualizedDataSource = {};
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler = {};
WinJS.Utilities = {};
WinJS.Utilities.eventMixin = {};
WinJS.Utilities.Key = {};
WinJS.Utilities.QueryCollection = {};

var /*@interface */ IItemPromise;
var /*@interface */ IListDataAdapter;
var /*@interface in WinJS.UI : Object*/ Layout;

WinJS.strictProcessing = function () { };
WinJS.xhr = /*@type(WinJS.Promise)*/function (/*@type(Object)*/options) { };

WinJS.Application.queueEvent = function (/*@type(Object)*/eventRecord) { };
WinJS.Application.stop = function () { };
WinJS.Application.addEventListener = function (eventType,listener,capture) { };
WinJS.Application.removeEventListener = function (eventType,listener,capture) { };
WinJS.Application.checkpoint = function () { };
WinJS.Application.start = function () { };
WinJS.Application.local = /*@static_cast(Object)*/null;
WinJS.Application.temp = /*@static_cast(Object)*/null;
WinJS.Application.roaming = /*@static_cast(Object)*/null;
WinJS.Application.local = /*@static_cast(Object)*/null;
WinJS.Application.temp = /*@static_cast(Object)*/null;
WinJS.Application.roaming = /*@static_cast(Object)*/null;

WinJS.Application.eventRecord.setPromise = function (/*@type(WinJS.Promise)*/promise) { };

WinJS.Application.InMemoryHelper.prototype = {
     exists : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName) { },
     remove : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName) { },
     writeText : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName,/*@type(String)*/str) { },
     readText : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName,/*@type(String)*/def) { },
};

WinJS.Application.IOHelper.prototype = {
     exists : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName) { },
     remove : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName) { },
     writeText : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName,/*@type(String)*/str) { },
     readText : /*@type(WinJS.Promise)*/function (/*@type(String)*/fileName,/*@type(String)*/def) { },
};

WinJS.Binding.bind = /*@type(Object)*/function (/*@type(Object)*/observable,/*@type(Object)*/bindingDescriptor) { };
WinJS.Binding.expandProperties = /*@type(Object)*/function (/*@type(Object)*/shape) { };
WinJS.Binding.define = /*@type(Function)*/function (/*@type(Object)*/data) { };
WinJS.Binding.as = /*@type(Object)*/function (/*@type(Object)*/data) { };
WinJS.Binding.unwrap = /*@type(Object)*/function (/*@type(Object)*/data) { };
WinJS.Binding.declarativeBind = /*@type(WinJS.Promise)*/function (/*@type(HTMLElement)*/rootElement,/*@type(Object)*/dataContext,/*@type(Boolean)*/skipRoot,bindingCache) { };
WinJS.Binding.converter = /*@type(Function)*/function (/*@type(Function)*/convert) { };
WinJS.Binding.setAttribute = /*@type(Object)*/function (/*@type(Object)*/source,/*@type(Array)*/sourceProperties,/*@type(Object)*/dest,/*@type(Array)*/destProperties) { };
WinJS.Binding.setAttributeOneTime = function (/*@type(Object)*/source,/*@type(Array)*/sourceProperties,/*@type(Object)*/dest,/*@type(Array)*/destProperties) { };
WinJS.Binding.defaultBind = /*@type(Object)*/function (/*@type(Object)*/source,/*@type(Array)*/sourceProperties,/*@type(Object)*/dest,/*@type(Array)*/destProperties) { };
WinJS.Binding.oneTime = /*@type(Object)*/function (/*@type(Object)*/source,/*@type(Array)*/sourceProperties,/*@type(Object)*/dest,/*@type(Array)*/destProperties) { };
WinJS.Binding.initializer = /*@type(Function)*/function (/*@type(Function)*/customInitializer) { };

WinJS.Binding.define.return = function (/*@type(Object)*/init) { };

WinJS.Binding.dynamicObservableMixin.getProperty = /*@type(Object)*/function (/*@type(String)*/name) { };
WinJS.Binding.dynamicObservableMixin.setProperty = /*@type(Object)*/function (/*@type(String)*/name,value) { };
WinJS.Binding.dynamicObservableMixin.addProperty = /*@type(Object)*/function (/*@type(String)*/name,value) { };
WinJS.Binding.dynamicObservableMixin.updateProperty = /*@type(WinJS.Promise)*/function (/*@type(String)*/name,value) { };
WinJS.Binding.dynamicObservableMixin.removeProperty = /*@type(Object)*/function (/*@type(String)*/name) { };

WinJS.Binding.FilteredListProjection.prototype = {
     length : /*@static_cast(Number)*/null,
     getItem : /*@type(Object)*/function (/*@type(Number)*/index) { },
     indexOfKey : /*@type(Number)*/function (/*@type(String)*/key) { },
     notifyMutated : function (/*@type(Number)*/index) { },
     setAt : function (/*@type(Number)*/index,/*@type(Object)*/newValue) { },
};

WinJS.Binding.GroupedSortedListProjection.prototype = {
     groups : /*@static_cast(WinJS.Binding.List)*/null,
     getItemFromKey : /*@type(Object)*/function (/*@type(String)*/key) { },
};

WinJS.Binding.GroupsListProjection.prototype = {
     length : /*@static_cast(Number)*/null,
     getItem : /*@type(Object)*/function (/*@type(Number)*/index) { },
     getItemFromKey : /*@type(Object)*/function (/*@type(String)*/key) { },
     indexOfKey : /*@type(Number)*/function (/*@type(String)*/key) { },
};

WinJS.Binding.List.reverse = /*@type(WinJS.Binding.List)*/function () { };
WinJS.Binding.List.sort = /*@type(WinJS.Binding.List)*/function (/*@type(Function)*/sortFunction) { };
WinJS.Binding.List.push = /*@type(Number)*/function (/*@type(Object)*/value) { };
WinJS.Binding.List.unshift = /*@type(Number)*/function (/*@type(Object)*/value) { };

WinJS.Binding.List.prototype = {
     length : /*@static_cast(Number)*/null,
     getItem : /*@type(Object)*/function (/*@type(Number)*/index) { },
     getItemFromKey : /*@type(Object)*/function (/*@type(String)*/key) { },
     indexOfKey : /*@type(Number)*/function (/*@type(String)*/key) { },
     move : function (/*@type(Number)*/index,/*@type(Number)*/newIndex) { },
     notifyMutated : function (/*@type(Number)*/index) { },
     setAt : function (/*@type(Number)*/index,/*@type(Object)*/newValue) { },
     pop : /*@type(Object)*/function () { },
     shift : /*@type(Object)*/function () { },
     splice : /*@type(Array)*/function (/*@type(Number)*/start,/*@type(Number)*/howMany,/*@type(Object)*/item) { },
};

WinJS.Binding.ListBase.notifyReload = function () { };
WinJS.Binding.ListBase.forEach = function (/*@type(Function)*/callback,/*@type(Object)*/thisArg) { };

WinJS.Binding.ListBase.prototype = {
     onitemchanged : /*@static_cast(Function)*/null,
     oniteminserted : /*@static_cast(Function)*/null,
     onitemmoved : /*@static_cast(Function)*/null,
     onitemmutated : /*@static_cast(Function)*/null,
     onitemremoved : /*@static_cast(Function)*/null,
     onreload : /*@static_cast(Function)*/null,
     getAt : /*@type(Object)*/function (/*@type(Number)*/index) { },
     concat : /*@type(Array)*/function () { },
     join : /*@type(String)*/function (/*@type(String)*/separator) { },
     slice : /*@type(Array)*/function (/*@type(Number)*/begin,/*@type(Number)*/end) { },
     indexOf : /*@type(Number)*/function (/*@type(Object)*/searchElement,/*@type(Number)*/fromIndex) { },
     lastIndexOf : /*@type(Number)*/function (/*@type(Object)*/searchElement,/*@type(Number)*/fromIndex) { },
     every : /*@type(Boolean)*/function (/*@type(Function)*/callback,/*@type(Object)*/thisArg) { },
     filter : /*@type(Array)*/function (/*@type(Function)*/callback,/*@type(Object)*/thisArg) { },
     map : /*@type(Array)*/function (/*@type(Function)*/callback,/*@type(Object)*/thisArg) { },
     some : /*@type(Boolean)*/function (/*@type(Function)*/callback,/*@type(Object)*/thisArg) { },
     reduce : /*@type(Object)*/function (/*@type(Function)*/callback,/*@type(Object)*/initialValue) { },
     reduceRight : /*@type(Object)*/function (/*@type(Function)*/callback,/*@type(Object)*/initialValue) { },
     createFiltered : /*@type(WinJS.Binding.List)*/function (/*@type(Function)*/predicate) { },
     createGrouped : /*@type(WinJS.Binding.List)*/function (/*@type(Function)*/groupKey,/*@type(Function)*/groupData,/*@type(Function)*/groupSorter) { },
     createSorted : /*@type(WinJS.Binding.List)*/function (/*@type(Function)*/sorter) { },
};

WinJS.Binding.ListBaseWithMutators.prototype = {
     pop : /*@type(Object)*/function () { },
     push : /*@type(Number)*/function (/*@type(Object)*/value) { },
     shift : /*@type(Object)*/function () { },
     unshift : /*@type(Number)*/function (/*@type(Object)*/value) { },
};

WinJS.Binding.ListProjection.prototype = {
     dispose : function () { },
     getItemFromKey : /*@type(Object)*/function (/*@type(String)*/key) { },
     move : function (/*@type(Number)*/index,/*@type(Number)*/newIndex) { },
     splice : /*@type(Array)*/function (/*@type(Number)*/start,/*@type(Number)*/howMany,/*@type(Object)*/item) { },
};

WinJS.Binding.observableMixin.notify = /*@type(WinJS.Promise)*/function (/*@type(String)*/name,/*@type(Object)*/newValue,/*@type(Object)*/oldValue) { };
WinJS.Binding.observableMixin.bind = /*@type(Object)*/function (/*@type(String)*/name,/*@type(Function)*/action) { };
WinJS.Binding.observableMixin.unbind = /*@type(Object)*/function (/*@type(String)*/name,/*@type(Function)*/action) { };

WinJS.Binding.SortedListProjection.prototype = {
     length : /*@static_cast(Number)*/null,
     getItem : /*@type(Object)*/function (/*@type(Number)*/index) { },
     getItem : /*@type(Number)*/function (/*@type(String)*/key) { },
     notifyMutated : function (/*@type(Number)*/index) { },
     setAt : function (/*@type(Number)*/index,/*@type(Object)*/newValue) { },
};

WinJS.Binding.Template.prototype = {
     processTimeout : /*@static_cast(Number)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     renderItem : /*@type(HTMLElement)*/function (/*@type(Object)*/item,/*@type(HTMLElement)*/recycled) { },
     render : /*@type(WinJS.Promise)*/function (/*@type(Object)*/dataContext,/*@type(HTMLElement)*/container) { },
};

WinJS.Binding.Template.render.value = /*@type(WinJS.Promise)*/function (/*@type(String)*/href,/*@type(Object)*/dataContext,/*@type(HTMLElement)*/container) { };

WinJS.Class.define = /*@type(Function)*/function (/*@type(Function)*/constructor,/*@type(Object)*/instanceMembers,/*@type(Object)*/staticMembers) { };
WinJS.Class.derive = /*@type(Function)*/function (/*@type(Function)*/baseClass,/*@type(Function)*/constructor,/*@type(Object)*/instanceMembers,/*@type(Object)*/staticMembers) { };
WinJS.Class.mix = /*@type(Function)*/function (constructor) { };

WinJS.Namespace.defineWithParent = /*@type(Object)*/function (/*@type(Object)*/parentNamespace,/*@type(String)*/name,/*@type(Object)*/members) { };
WinJS.Namespace.define = /*@type(Object)*/function (/*@type(String)*/name,/*@type(Object)*/members) { };

WinJS.Navigation.canGoForward = /*@static_cast(Boolean)*/null;
WinJS.Navigation.canGoBack = /*@static_cast(Boolean)*/null;
WinJS.Navigation.location = null;
WinJS.Navigation.state = null;
WinJS.Navigation.history = null;
WinJS.Navigation.forward = /*@type(WinJS.Promise)*/function (/*@type(Number)*/distance) { };
WinJS.Navigation.back = /*@type(WinJS.Promise)*/function (/*@type(Number)*/distance) { };
WinJS.Navigation.navigate = /*@type(WinJS.Promise)*/function (/*@type(Object)*/location,/*@type(Object)*/initialState) { };
WinJS.Navigation.addEventListener = function (/*@type(String)*/eventType,/*@type(Function)*/listener,/*@type(Boolean)*/capture) { };
WinJS.Navigation.removeEventListener = function (/*@type(String)*/eventType,/*@type(Function)*/listener,/*@type(Boolean)*/capture) { };

WinJS.Navigation.beforenavigate.setPromise = function (/*@type(WinJS.Promise)*/promise) { };

WinJS.Navigation.navigated.setPromise = function (/*@type(WinJS.Promise)*/promise) { };

WinJS.Navigation.navigating.setPromise = function (/*@type(WinJS.Promise)*/promise) { };

WinJS.Promise.addEventListener = function (eventType,listener,capture) { };
WinJS.Promise.removeEventListener = function (eventType,listener,capture) { };

WinJS.Promise.prototype = {
     any : /*@type(WinJS.Promise)*/function (/*@type(Array)*/values) { },
     as : /*@type(WinJS.Promise)*/function (value) { },
     cancel : /*@static_cast(WinJS.Promise)*/null,
     dispatchEvent : /*@type(Boolean)*/function (eventType,details) { },
     is : /*@type(Boolean)*/function (value) { },
     join : /*@type(WinJS.Promise)*/function (/*@type(Object)*/values) { },
     then : /*@type(WinJS.Promise)*/function (value,/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { },
     thenEach : /*@type(WinJS.Promise)*/function (values,/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { },
     timeout : /*@type(WinJS.Promise)*/function (/*@type(Number)*/timeout,/*@type(WinJS.Promise)*/promise) { },
     wrap : /*@type(WinJS.Promise)*/function (value) { },
     wrapError : /*@type(WinJS.Promise)*/function (error) { },
};

WinJS.PromiseStateMachine.cancel = function () { };
WinJS.PromiseStateMachine.done = function (/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { };

WinJS.PromiseStateMachine.prototype = {
     then : /*@type(WinJS.Promise)*/function (/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { },
     cancel : function () { },
     done : function (/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { },
     then : /*@type(WinJS.Promise)*/function (/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { },
     cancel : function () { },
     done : function (/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { },
     then : /*@type(WinJS.Promise)*/function (/*@type(Function)*/onComplete,/*@type(Function)*/onError,/*@type(Function)*/onProgress) { },
};

WinJS.Resources.addEventListener = function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { };
WinJS.Resources.getString = /*@type(Object)*/function (/*@type(Number)*/resourceId) { };
WinJS.Resources.processAll = function (rootElement) { };

WinJS.UI.scopedSelect = /*@type(HTMLElement)*/function (/*@type(String)*/selector) { };
WinJS.UI.processAll = /*@type(WinJS.Promise)*/function (/*@type(Object)*/rootElement) { };
WinJS.UI.process = /*@type(WinJS.Promise)*/function (/*@type(Object)*/element) { };
WinJS.UI.isAnimationEnabled = /*@type(Boolean)*/function () { };
WinJS.UI.disableAnimations = function () { };
WinJS.UI.enableAnimations = function () { };
WinJS.UI.executeAnimation = /*@type(WinJS.Promise)*/function (element,animation) { };
WinJS.UI.executeTransition = /*@type(WinJS.Promise)*/function (element,transition) { };
WinJS.UI.eventHandler = /*@type(Object)*/function (/*@type(Object)*/handler) { };
WinJS.UI.computeDataSourceGroups = /*@type(WinJS.UI.IListDataSource)*/function (/*@type(WinJS.UI.VirtualizedDataSource)*/listDataSource,/*@type(Function)*/groupKey,/*@type(Function)*/groupData,/*@type(Object)*/options) { };
WinJS.UI._Overlay = /*@type(WinJS.UI._Overlay)*/function (/*@type(HTMLElement)*/element,/*@type(Object)*/options) { };

WinJS.UI._LayoutCommon.prototype = {
     init : function () { },
     setSite : function (layoutSite) { },
     disableBackdrop : /*@static_cast(Boolean)*/null,
     backdropColor : /*@static_cast(String)*/null,
     reset : function () { },
     itemInfo : /*@static_cast(Function)*/null,
     getKeyboardNavigatedItem : function (itemIndex,element,keyPressed) { },
     groupInfo : /*@static_cast(Function)*/null,
     updateBackdrop : function (count) { },
};

WinJS.UI._Overlay.show = function () { };
WinJS.UI._Overlay.hide = function () { };

WinJS.UI._Overlay.prototype = {
     element : /*@static_cast(HTMLElement)*/null,
     disabled : /*@static_cast(Boolean)*/null,
     hidden : /*@static_cast(Boolean)*/null,
     addEventListener : function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { },
     removeEventListener : function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { },
};

WinJS.UI._Selection.prototype.clear = /*@type(WinJS.Promise)*/function () { };

WinJS.UI._Selection.prototype.prototype = {
     set : /*@type(WinJS.Promise)*/function (items) { },
     add : /*@type(WinJS.Promise)*/function (items) { },
     remove : /*@type(WinJS.Promise)*/function (items) { },
     selectAll : /*@type(WinJS.Promise)*/function () { },
};

WinJS.UI._SelectionManager.prototype.count = /*@type(Number)*/function () { };
WinJS.UI._SelectionManager.prototype.getIndices = /*@type(Array)*/function () { };
WinJS.UI._SelectionManager.prototype.getItems = /*@type(WinJS.Promise)*/function () { };
WinJS.UI._SelectionManager.prototype.getRanges = /*@type(Array)*/function () { };
WinJS.UI._SelectionManager.prototype.isEverything = /*@type(Boolean)*/function () { };
WinJS.UI._SelectionManager.prototype.set = /*@type(WinJS.Promise)*/function (items) { };
WinJS.UI._SelectionManager.prototype.clear = /*@type(WinJS.Promise)*/function () { };
WinJS.UI._SelectionManager.prototype.add = /*@type(WinJS.Promise)*/function (items) { };
WinJS.UI._SelectionManager.prototype.remove = /*@type(WinJS.Promise)*/function (items) { };
WinJS.UI._SelectionManager.prototype.selectAll = /*@type(WinJS.Promise)*/function () { };

WinJS.UI.Animation.createExpandAnimation = /*@type(Object)*/function (revealed,affected) { };
WinJS.UI.Animation.createCollapseAnimation = /*@type(Object)*/function (hidden,affected) { };
WinJS.UI.Animation.createRepositionAnimation = /*@type(Object)*/function (element) { };
WinJS.UI.Animation.fadeIn = /*@type(WinJS.Promise)*/function (shown) { };
WinJS.UI.Animation.fadeOut = /*@type(WinJS.Promise)*/function (hidden) { };
WinJS.UI.Animation.createAddToListAnimation = /*@type(Object)*/function (added,affected) { };
WinJS.UI.Animation.createDeleteFromListAnimation = /*@type(Object)*/function (deleted,remaining) { };
WinJS.UI.Animation.createAddToSearchListAnimation = /*@type(Object)*/function (added,affected) { };
WinJS.UI.Animation.createDeleteFromSearchListAnimation = /*@type(Object)*/function (deleted,remaining) { };
WinJS.UI.Animation.showEdgeUI = /*@type(WinJS.Promise)*/function (element,offset) { };
WinJS.UI.Animation.showPanel = /*@type(WinJS.Promise)*/function (element,offset) { };
WinJS.UI.Animation.hideEdgeUI = /*@type(WinJS.Promise)*/function (element,offset) { };
WinJS.UI.Animation.hidePanel = /*@type(WinJS.Promise)*/function (element,offset) { };
WinJS.UI.Animation.showPopup = /*@type(WinJS.Promise)*/function (element,offset) { };
WinJS.UI.Animation.hidePopup = /*@type(WinJS.Promise)*/function (element) { };
WinJS.UI.Animation.pointerDown = /*@type(WinJS.Promise)*/function (element) { };
WinJS.UI.Animation.pointerUp = /*@type(WinJS.Promise)*/function (element) { };
WinJS.UI.Animation.dragSourceStart = /*@type(WinJS.Promise)*/function (dragSource,affected) { };
WinJS.UI.Animation.dragSourceEnd = /*@type(WinJS.Promise)*/function (dragSource,offset,affected) { };
WinJS.UI.Animation.enterContent = /*@type(WinJS.Promise)*/function (incoming,offset) { };
WinJS.UI.Animation.exitContent = /*@type(WinJS.Promise)*/function (outgoing,offset) { };
WinJS.UI.Animation.dragBetweenEnter = /*@type(WinJS.Promise)*/function (target,offset) { };
WinJS.UI.Animation.dragBetweenLeave = /*@type(WinJS.Promise)*/function (target) { };
WinJS.UI.Animation.swipeSelect = /*@type(WinJS.Promise)*/function (selected,selection) { };
WinJS.UI.Animation.swipeDeselect = /*@type(WinJS.Promise)*/function (deselected,selection) { };
WinJS.UI.Animation.swipeReveal = /*@type(WinJS.Promise)*/function (target,offset) { };
WinJS.UI.Animation.enterPage = /*@type(WinJS.Promise)*/function (element,offset) { };
WinJS.UI.Animation.exitPage = /*@type(WinJS.Promise)*/function (outgoing,offset) { };
WinJS.UI.Animation.crossFade = /*@type(WinJS.Promise)*/function (incoming,outgoing) { };
WinJS.UI.Animation.createPeekAnimation = /*@type(Object)*/function (element) { };
WinJS.UI.Animation.updateBadge = /*@type(WinJS.Promise)*/function (incoming,offset) { };

WinJS.UI.AppBar.hide = function () { };

WinJS.UI.AppBar.prototype = {
     placement : /*@static_cast(String)*/null,
     layout : /*@static_cast(String)*/null,
     sticky : /*@static_cast(Boolean)*/null,
     commands : /*@static_cast(Array)*/null,
     getCommandById : /*@type(Object)*/function (/*@type(String)*/id) { },
     showCommands : function (/*@type(Array)*/commands) { },
     hideCommands : function (/*@type(Array)*/commands) { },
     showOnlyCommands : function (/*@type(Array)*/commands) { },
     show : function () { },
};

WinJS.UI.AppBarCommand.prototype = {
     id : /*@static_cast(String)*/null,
     type : /*@static_cast(String)*/null,
     label : /*@static_cast(String)*/null,
     icon : /*@static_cast(String)*/null,
     onclick : /*@static_cast(Function)*/null,
     flyout : /*@static_cast(Object)*/null,
     section : /*@static_cast(String)*/null,
     tooltip : /*@static_cast(String)*/null,
     selected : /*@static_cast(Boolean)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     disabled : /*@static_cast(Boolean)*/null,
     hidden : /*@static_cast(Boolean)*/null,
     addEventListener : function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { },
     removeEventListener : function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { },
     extraClass : /*@static_cast(String)*/null,
};

WinJS.UI.BrowseMode.selectionchanging.setPromise = function (/*@type(WinJS.Promise)*/promise) { };

WinJS.UI.DatePicker.prototype = {
     calendar : /*@static_cast(String)*/null,
     current : /*@static_cast(Date)*/null,
     disabled : /*@static_cast(Boolean)*/null,
     datePattern : /*@static_cast(String)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     minYear : /*@static_cast(Number)*/null,
     maxYear : /*@static_cast(Number)*/null,
     monthPattern : /*@static_cast(String)*/null,
     yearPattern : /*@static_cast(String)*/null,
};

WinJS.UI.DOMEventMixin.addEventListener = function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { };
WinJS.UI.DOMEventMixin.dispatchEvent = /*@type(Boolean)*/function (/*@type(String)*/type,/*@type(Object)*/eventProperties) { };
WinJS.UI.DOMEventMixin.removeEventListener = function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { };
WinJS.UI.DOMEventMixin.setOptions = function (/*@type(Object)*/control,/*@type(Object)*/options) { };

WinJS.UI.FlipView.next = /*@type(Boolean)*/function () { };
WinJS.UI.FlipView.previous = /*@type(Boolean)*/function () { };
WinJS.UI.FlipView.count = /*@type(WinJS.Promise)*/function () { };
WinJS.UI.FlipView.setCustomAnimations = function (/*@type(Object)*/animations) { };
WinJS.UI.FlipView.forceLayout = function () { };

WinJS.UI.FlipView.prototype = {
     element : /*@static_cast(HTMLElement)*/null,
     currentPage : /*@static_cast(Number)*/null,
     orientation : /*@static_cast(String)*/null,
     itemDataSource : /*@static_cast(Object)*/null,
     itemTemplate : /*@static_cast(Function)*/null,
     itemSpacing : /*@static_cast(Number)*/null,
};

WinJS.UI.Flyout.show = function (/*@type(HTMLElement)*/anchor,/*@type(Object)*/placement,/*@type(Object)*/alignment) { };

WinJS.UI.Flyout.prototype = {
     anchor : /*@static_cast(String)*/null,
     placement : /*@static_cast(String)*/null,
     alignment : /*@static_cast(String)*/null,
     hide : function () { },
};

WinJS.UI.Fragments.renderCopy = /*@type(WinJS.Promise)*/function (/*@type(String)*/href,/*@type(HTMLElement)*/target) { };
WinJS.UI.Fragments.render = /*@type(WinJS.Promise)*/function (/*@type(String)*/href,/*@type(HTMLElement)*/target) { };
WinJS.UI.Fragments.cache = /*@type(WinJS.Promise)*/function (/*@type(Object)*/href) { };
WinJS.UI.Fragments.clearCache = function (/*@type(Object)*/href) { };

WinJS.UI.GridLayout.layoutHeader = function (groupIndex,element) { };
WinJS.UI.GridLayout.itemsAdded = function (elements) { };
WinJS.UI.GridLayout.itemsRemoved = function (elements) { };
WinJS.UI.GridLayout.itemsMoved = function () { };

WinJS.UI.GridLayout.prototype = {
     horizontal : /*@static_cast(Boolean)*/null,
     groupHeaderPosition : /*@static_cast(String)*/null,
     maxRows : /*@static_cast(Number)*/null,
     startLayout : function (beginScrollPosition,endScrollPosition,count) { },
     getScrollbarRange : function (count) { },
     getKeyboardNavigatedItem : function (itemIndex,element,keyPressed) { },
     prepareItem : function (element) { },
     prepareHeader : function (element) { },
     releaseItem : function (item,newItem) { },
     layoutItem : function (itemIndex,element) { },
     endLayout : function () { },
     calculateFirstVisible : function (beginScrollPosition,wholeItem) { },
     calculateLastVisible : function (endScrollPosition,wholeItem) { },
     hitTest : function (x,y) { },
     getItemPosition : function (itemIndex) { },
};

WinJS.UI.IListBinding.jumpToItem = /*@type(IItemPromise)*/function (/*@type(Object)*/item) { };
WinJS.UI.IListBinding.current = /*@type(IItemPromise)*/function () { };
WinJS.UI.IListBinding.previous = /*@type(IItemPromise)*/function () { };
WinJS.UI.IListBinding.next = /*@type(IItemPromise)*/function () { };
WinJS.UI.IListBinding.releaseItem = function (/*@type(Object)*/item) { };
WinJS.UI.IListBinding.release = function () { };
WinJS.UI.IListBinding.first = /*@type(IItemPromise)*/function () { };
WinJS.UI.IListBinding.last = /*@type(IItemPromise)*/function () { };
WinJS.UI.IListBinding.fromKey = /*@type(IItemPromise)*/function (/*@type(String)*/key,hints) { };
WinJS.UI.IListBinding.fromIndex = /*@type(IItemPromise)*/function (/*@type(Number)*/index) { };
WinJS.UI.IListBinding.fromDescription = /*@type(WinJS.Promise)*/function (description) { };

WinJS.UI.IListDataSource.createListBinding = /*@type(WinJS.UI.IListBinding)*/function (notificationHandler) { };
WinJS.UI.IListDataSource.invalidateAll = /*@type(WinJS.Promise)*/function () { };
WinJS.UI.IListDataSource.getCount = function () { };
WinJS.UI.IListDataSource.itemFromKey = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,hints) { };
WinJS.UI.IListDataSource.itemFromIndex = /*@type(WinJS.Promise)*/function (/*@type(Number)*/index) { };
WinJS.UI.IListDataSource.itemFromDescription = /*@type(WinJS.Promise)*/function (description) { };
WinJS.UI.IListDataSource.beginEdits = function () { };
WinJS.UI.IListDataSource.insertAtStart = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,data) { };
WinJS.UI.IListDataSource.insertBefore = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,data,/*@type(String)*/nextKey) { };
WinJS.UI.IListDataSource.insertAfter = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,data,/*@type(String)*/previousKey) { };
WinJS.UI.IListDataSource.insertAtEnd = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,data) { };
WinJS.UI.IListDataSource.change = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,/*@type(Object)*/newData) { };
WinJS.UI.IListDataSource.moveToStart = /*@type(WinJS.Promise)*/function (/*@type(String)*/key) { };
WinJS.UI.IListDataSource.moveBefore = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,/*@type(String)*/nextKey) { };
WinJS.UI.IListDataSource.moveAfter = /*@type(WinJS.Promise)*/function (/*@type(String)*/key,/*@type(String)*/previousKey) { };
WinJS.UI.IListDataSource.moveToEnd = /*@type(WinJS.Promise)*/function (/*@type(String)*/key) { };
WinJS.UI.IListDataSource.remove = /*@type(WinJS.Promise)*/function (/*@type(String)*/key) { };
WinJS.UI.IListDataSource.endEdits = function () { };

WinJS.UI.ListLayout.itemsAdded = function (elements) { };
WinJS.UI.ListLayout.itemsRemoved = function (elements) { };
WinJS.UI.ListLayout.itemsMoved = function () { };

WinJS.UI.ListLayout.prototype = {
     horizontal : /*@static_cast(Boolean)*/null,
     getKeyboardNavigatedItem : function (itemIndex,element,keyPressed) { },
     setSite : function (layoutSite) { },
     getScrollbarRange : function (count) { },
     getItemPosition : function (itemIndex) { },
     startLayout : function (beginScrollPosition,endScrollPosition,count) { },
     prepareItem : function (element) { },
     prepareHeader : function (element) { },
     releaseItem : function (item,newItem) { },
     layoutItem : function (itemIndex,element) { },
     layoutHeader : function (groupIndex,element) { },
     endLayout : function () { },
     calculateFirstVisible : function (beginScrollPosition,wholeItem) { },
     calculateLastVisible : function (endScrollPosition,wholeItem) { },
     hitTest : function (x,y) { },
};

WinJS.UI.ListView.forceLayout = function () { };
WinJS.UI.ListView.triggerDispose = function () { };

WinJS.UI.ListView.prototype = {
     element : /*@static_cast(HTMLElement)*/null,
     layout : /*@static_cast(WinJS.UI.Layout)*/null,
     pagesToLoad : /*@static_cast(Number)*/null,
     pagesToLoadThreshold : /*@static_cast(Number)*/null,
     groupDataSource : /*@static_cast(Object)*/null,
     automaticallyLoadPages : /*@static_cast(Boolean)*/null,
     loadingBehavior : /*@static_cast(String)*/null,
     selectionMode : /*@static_cast(String)*/null,
     tapBehavior : /*@static_cast(String)*/null,
     swipeBehavior : /*@static_cast(String)*/null,
     itemDataSource : /*@static_cast(Object)*/null,
     itemTemplate : /*@static_cast(Object)*/null,
     resetItem : /*@static_cast(Function)*/null,
     groupHeaderTemplate : /*@static_cast(Object)*/null,
     resetGroupHeader : /*@static_cast(Function)*/null,
     loadingState : /*@static_cast(String)*/null,
     selection : /*@static_cast(Object)*/null,
     indexOfFirstVisible : /*@static_cast(Number)*/null,
     indexOfLastVisible : /*@static_cast(Number)*/null,
     currentItem : /*@static_cast(Object)*/null,
     zoomableView : /*@static_cast(Object)*/null,
     elementFromIndex : /*@type(Object)*/function (/*@type(Number)*/itemIndex) { },
     indexOfElement : /*@type(Number)*/function (/*@type(HTMLElement)*/element) { },
     ensureVisible : function (/*@type(Number)*/itemIndex) { },
     loadMorePages : function () { },
     recalculateItemPosition : function () { },
     scrollPosition : /*@static_cast(Number)*/null,
};

WinJS.UI.ListView.ListViewAnimationType.entrance = null;
WinJS.UI.ListView.ListViewAnimationType.contentTransition = null;

WinJS.UI.ListView.SelectionMode.none = null;
WinJS.UI.ListView.SelectionMode.single = null;
WinJS.UI.ListView.SelectionMode.multi = null;

WinJS.UI.ListView.SwipeBehavior.select = null;
WinJS.UI.ListView.SwipeBehavior.none = null;

WinJS.UI.ListView.TapBehavior.directSelect = null;
WinJS.UI.ListView.TapBehavior.toggleSelect = null;
WinJS.UI.ListView.TapBehavior.invokeOnly = null;
WinJS.UI.ListView.TapBehavior.none = null;

WinJS.UI.Menu.show = function (/*@type(HTMLElement)*/anchor,/*@type(Object)*/placement,/*@type(Object)*/alignment) { };

WinJS.UI.Menu.prototype = {
     commands : /*@static_cast(Array)*/null,
     getCommandById : /*@type(Object)*/function (/*@type(String)*/id) { },
     showCommands : function (/*@type(Array)*/commands) { },
     hideCommands : function (/*@type(Array)*/commands) { },
     showOnlyCommands : function (/*@type(Array)*/commands) { },
};

WinJS.UI.MenuCommand.prototype = {
     id : /*@static_cast(String)*/null,
     type : /*@static_cast(String)*/null,
     label : /*@static_cast(String)*/null,
     onclick : /*@static_cast(Function)*/null,
     flyout : /*@static_cast(Object)*/null,
     selected : /*@static_cast(Boolean)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     disabled : /*@static_cast(Boolean)*/null,
     hidden : /*@static_cast(Boolean)*/null,
     extraClass : /*@static_cast(String)*/null,
     addEventListener : function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { },
     removeEventListener : function (/*@type(String)*/type,/*@type(Function)*/listener,/*@type(Boolean)*/useCapture) { },
};

WinJS.UI.Pages.define = /*@type(Function)*/function (uri,members) { };
WinJS.UI.Pages.get = /*@type(Function)*/function (uri) { };
WinJS.UI.Pages.render = /*@type(WinJS.Promise)*/function (uri,element,options,parentedPromise) { };

WinJS.UI.Pages._mixin.load = /*@type(WinJS.Promise)*/function (uri) { };
WinJS.UI.Pages._mixin.init = /*@type(WinJS.Promise)*/function (element,options) { };
WinJS.UI.Pages._mixin.processed = /*@type(WinJS.Promise)*/function (element,options) { };
WinJS.UI.Pages._mixin.render = /*@type(WinJS.Promise)*/function (element,options,loadResult) { };
WinJS.UI.Pages._mixin.ready = /*@type(WinJS.Promise)*/function (element,options) { };
WinJS.UI.Pages._mixin.error = /*@type(WinJS.Promise)*/function (err) { };

WinJS.UI.Rating.addEventListener = function (/*@type(String)*/eventName,/*@type(Function)*/eventCallback,/*@type(Boolean)*/capture) { };

WinJS.UI.Rating.prototype = {
     maxRating : /*@static_cast(Number)*/null,
     userRating : /*@static_cast(Number)*/null,
     averageRating : /*@static_cast(Number)*/null,
     disabled : /*@static_cast(Boolean)*/null,
     enableClear : /*@static_cast(Boolean)*/null,
     tooltipStrings : /*@static_cast(Array)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     removeEventListener : function (/*@type(String)*/eventName,/*@type(Function)*/eventCallback,/*@type(Boolean)*/capture) { },
};

WinJS.UI.select.createSelect = /*@type(HTMLElement)*/function (/*@type(String)*/selector) { };

WinJS.UI.SelectionManager.selectionchanging.setPromise = function (/*@type(WinJS.Promise)*/promise) { };

WinJS.UI.SemanticZoom.forceLayout = function () { };

WinJS.UI.SemanticZoom.prototype = {
     element : /*@static_cast(HTMLElement)*/null,
     enableButton : /*@static_cast(Boolean)*/null,
     zoomedOut : /*@static_cast(Boolean)*/null,
     zoomFactor : /*@static_cast(Number)*/null,
     locked : /*@static_cast(Boolean)*/null,
};

WinJS.UI.SettingsFlyout.hide = function () { };
WinJS.UI.SettingsFlyout.show = function () { };
WinJS.UI.SettingsFlyout.populateSettings = function (/*@type(Object)*/e) { };
WinJS.UI.SettingsFlyout.showSettings = function () { };

WinJS.UI.SettingsFlyout.prototype = {
     width : /*@static_cast(String)*/null,
     settingsCommandId : /*@static_cast(String)*/null,
     show : function () { },
};

WinJS.UI.TabContainer.prototype = {
     childFocus : /*@static_cast(HTMLElement)*/null,
     tabIndex : /*@static_cast(Number)*/null,
};

WinJS.UI.TimePicker.prototype = {
     clock : /*@static_cast(String)*/null,
     current : /*@static_cast(Date)*/null,
     disabled : /*@static_cast(Boolean)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     hourPattern : /*@static_cast(String)*/null,
     minuteIncrement : /*@static_cast(Number)*/null,
     minutePattern : /*@static_cast(String)*/null,
     periodPattern : /*@static_cast(String)*/null,
};

WinJS.UI.ToggleSwitch.prototype = {
     checked : /*@static_cast(Boolean)*/null,
     disabled : /*@static_cast(Boolean)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     labelOn : /*@static_cast(String)*/null,
     labelOff : /*@static_cast(String)*/null,
     title : /*@static_cast(String)*/null,
     addEventListener : function (/*@type(String)*/eventName,/*@type(Function)*/eventCallback,/*@type(Boolean)*/capture) { },
     removeEventListener : function (/*@type(String)*/eventName,/*@type(Function)*/eventCallback,/*@type(Boolean)*/capture) { },
};

WinJS.UI.Tooltip.close = function () { };

WinJS.UI.Tooltip.prototype = {
     innerHTML : /*@static_cast(String)*/null,
     element : /*@static_cast(HTMLElement)*/null,
     contentElement : /*@static_cast(HTMLElement)*/null,
     placement : /*@static_cast(String)*/null,
     infotip : /*@static_cast(Boolean)*/null,
     extraClass : /*@static_cast(String)*/null,
     addEventListener : function (/*@type(String)*/eventName,/*@type(Function)*/eventCallback,/*@type(Boolean)*/capture) { },
     removeEventListener : function (/*@type(String)*/eventName,/*@type(Function)*/eventCallback,/*@type(Boolean)*/capture) { },
     open : function (/*@type(String)*/type) { },
};

WinJS.UI.ViewBox.prototype = {
     element : /*@static_cast(HTMLElement)*/null,
};

WinJS.UI.VirtualizedDataSource._baseDataSourceConstructor = function (/*@type(IListDataAdapter)*/listDataAdapter,/*@type(Object)*/options) { };

WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.invalidateAll = /*@type(WinJS.Promise)*/function () { };
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.reload = function () { };
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.beginNotifications = function () { };
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.inserted = function (/*@type(Object)*/newItem,/*@type(String)*/previousKey,/*@type(String)*/nextKey,/*@type(Number)*/index) { };
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.changed = function (/*@type(Object)*/item) { };
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.moved = function (/*@type(Object)*/item,/*@type(String)*/previousKey,/*@type(String)*/nextKey,/*@type(Number)*/oldIndex,/*@type(Number)*/newIndex) { };
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.removed = function (/*@type(String)*/key,/*@type(Number)*/index) { };
WinJS.UI.VirtualizedDataSource.ListDataNotificationHandler.endNotifications = function () { };

WinJS.Utilities.hasWinRT = /*@static_cast(Boolean)*/null;
WinJS.Utilities.getMember = /*@type(Object)*/function (name,root) { };
WinJS.Utilities.ready = /*@type(WinJS.Promise)*/function (callback,async) { };
WinJS.Utilities.strictProcessing = /*@static_cast(Boolean)*/null;
WinJS.Utilities.markSupportedForProcessing = /*@type(Function)*/function (/*@type(Function)*/func) { };
WinJS.Utilities.requireSupportedForProcessing = /*@type(Object)*/function (/*@type(Object)*/value) { };
WinJS.Utilities.formatLog = /*@type(String)*/function (/*@type(String)*/message,/*@type(String)*/tag,/*@type(String)*/type) { };
WinJS.Utilities.startLog = function (/*@type(*)*/options) { };
WinJS.Utilities.stopLog = function () { };
WinJS.Utilities.createEventProperties = /*@type(Object)*/function (events) { };
WinJS.Utilities.setInnerHTML = function (/*@type(HTMLElement)*/element,/*@type(String)*/text) { };
WinJS.Utilities.setOuterHTML = function (/*@type(HTMLElement)*/element,/*@type(String)*/text) { };
WinJS.Utilities.insertAdjacentHTML = function (/*@type(HTMLElement)*/element,/*@type(String)*/position,/*@type(String)*/text) { };
WinJS.Utilities.setInnerHTMLUnsafe = function (/*@type(HTMLElement)*/element,/*@type(String)*/text) { };
WinJS.Utilities.setOuterHTMLUnsafe = function (/*@type(HTMLElement)*/element,/*@type(String)*/text) { };
WinJS.Utilities.insertAdjacentHTMLUnsafe = function (/*@type(HTMLElement)*/element,/*@type(String)*/position,/*@type(String)*/text) { };
WinJS.Utilities.setInnerHTML = function (/*@type(HTMLElement)*/element,/*@type(String)*/text) { };
WinJS.Utilities.setOuterHTML = function (/*@type(HTMLElement)*/element,/*@type(String)*/text) { };
WinJS.Utilities.insertAdjacentHTML = function (/*@type(HTMLElement)*/element,/*@type(String)*/position,/*@type(String)*/text) { };
WinJS.Utilities.query = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/query,/*@type(HTMLElement)*/element) { };
WinJS.Utilities.id = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/id) { };
WinJS.Utilities.children = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.data = /*@type(Object)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.hasClass = /*@type(Boolean)*/function (/*@type(HTMLElement)*/e,/*@type(String)*/name) { };
WinJS.Utilities.addClass = /*@type(HTMLElement)*/function (/*@type(HTMLElement)*/e,/*@type(String)*/name) { };
WinJS.Utilities.removeClass = /*@type(HTMLElement)*/function (/*@type(HTMLElement)*/e,/*@type(String)*/name) { };
WinJS.Utilities.toggleClass = /*@type(HTMLElement)*/function (/*@type(HTMLElement)*/e,/*@type(String)*/name) { };
WinJS.Utilities.getRelativeLeft = /*@type(Number)*/function (element,parent) { };
WinJS.Utilities.getRelativeTop = /*@type(Number)*/function (element,parent) { };
WinJS.Utilities.empty = /*@type(HTMLElement)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.getContentWidth = /*@type(Number)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.getTotalWidth = /*@type(Number)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.getContentHeight = /*@type(Number)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.getTotalHeight = /*@type(Number)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.getPosition = /*@type(Object)*/function (/*@type(HTMLElement)*/element) { };
WinJS.Utilities.convertToPixels = /*@type(Number)*/function (/*@type(HTMLElement)*/element,/*@type(String)*/value) { };
WinJS.Utilities.eventWithinElement = /*@type(Boolean)*/function (/*@type(HTMLElement)*/element,/*@type(Event)*/event) { };

WinJS.Utilities.eventMixin.addEventListener = function (type,listener,useCapture) { };
WinJS.Utilities.eventMixin.dispatchEvent = /*@type(Boolean)*/function (type,details) { };
WinJS.Utilities.eventMixin.removeEventListener = function (type,listener,useCapture) { };

WinJS.Utilities.Key.backspace = null;
WinJS.Utilities.Key.tab = null;
WinJS.Utilities.Key.enter = null;
WinJS.Utilities.Key.shift = null;
WinJS.Utilities.Key.ctrl = null;
WinJS.Utilities.Key.alt = null;
WinJS.Utilities.Key.pause = null;
WinJS.Utilities.Key.capsLock = null;
WinJS.Utilities.Key.escape = null;
WinJS.Utilities.Key.space = null;
WinJS.Utilities.Key.pageUp = null;
WinJS.Utilities.Key.pageDown = null;
WinJS.Utilities.Key.end = null;
WinJS.Utilities.Key.home = null;
WinJS.Utilities.Key.leftArrow = null;
WinJS.Utilities.Key.upArrow = null;
WinJS.Utilities.Key.rightArrow = null;
WinJS.Utilities.Key.downArrow = null;
WinJS.Utilities.Key.insert = null;
WinJS.Utilities.Key.deleteKey = null;
WinJS.Utilities.Key.num0 = null;
WinJS.Utilities.Key.num1 = null;
WinJS.Utilities.Key.num2 = null;
WinJS.Utilities.Key.num3 = null;
WinJS.Utilities.Key.num4 = null;
WinJS.Utilities.Key.num5 = null;
WinJS.Utilities.Key.num6 = null;
WinJS.Utilities.Key.num7 = null;
WinJS.Utilities.Key.num8 = null;
WinJS.Utilities.Key.num9 = null;
WinJS.Utilities.Key.a = null;
WinJS.Utilities.Key.b = null;
WinJS.Utilities.Key.c = null;
WinJS.Utilities.Key.d = null;
WinJS.Utilities.Key.e = null;
WinJS.Utilities.Key.f = null;
WinJS.Utilities.Key.g = null;
WinJS.Utilities.Key.h = null;
WinJS.Utilities.Key.i = null;
WinJS.Utilities.Key.j = null;
WinJS.Utilities.Key.k = null;
WinJS.Utilities.Key.l = null;
WinJS.Utilities.Key.m = null;
WinJS.Utilities.Key.n = null;
WinJS.Utilities.Key.o = null;
WinJS.Utilities.Key.p = null;
WinJS.Utilities.Key.q = null;
WinJS.Utilities.Key.r = null;
WinJS.Utilities.Key.s = null;
WinJS.Utilities.Key.t = null;
WinJS.Utilities.Key.u = null;
WinJS.Utilities.Key.v = null;
WinJS.Utilities.Key.w = null;
WinJS.Utilities.Key.x = null;
WinJS.Utilities.Key.y = null;
WinJS.Utilities.Key.z = null;
WinJS.Utilities.Key.leftWindows = null;
WinJS.Utilities.Key.rightWindows = null;
WinJS.Utilities.Key.menu = null;
WinJS.Utilities.Key.numPad0 = null;
WinJS.Utilities.Key.numPad1 = null;
WinJS.Utilities.Key.numPad2 = null;
WinJS.Utilities.Key.numPad3 = null;
WinJS.Utilities.Key.numPad4 = null;
WinJS.Utilities.Key.numPad5 = null;
WinJS.Utilities.Key.numPad6 = null;
WinJS.Utilities.Key.numPad7 = null;
WinJS.Utilities.Key.numPad8 = null;
WinJS.Utilities.Key.numPad9 = null;
WinJS.Utilities.Key.multiply = null;
WinJS.Utilities.Key.add = null;
WinJS.Utilities.Key.subtract = null;
WinJS.Utilities.Key.decimalPoint = null;
WinJS.Utilities.Key.divide = null;
WinJS.Utilities.Key.numLock = null;
WinJS.Utilities.Key.scrollLock = null;
WinJS.Utilities.Key.browserBack = null;
WinJS.Utilities.Key.browserForward = null;
WinJS.Utilities.Key.semicolon = null;
WinJS.Utilities.Key.equal = null;
WinJS.Utilities.Key.comma = null;
WinJS.Utilities.Key.dash = null;
WinJS.Utilities.Key.period = null;
WinJS.Utilities.Key.forwardSlash = null;
WinJS.Utilities.Key.graveAccent = null;
WinJS.Utilities.Key.openBracket = null;
WinJS.Utilities.Key.backSlash = null;
WinJS.Utilities.Key.closeBracket = null;
WinJS.Utilities.Key.singleQuote = null;

WinJS.Utilities.QueryCollection.forEach = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(Function)*/callbackFn,/*@type(Function)*/thisArg) { };
WinJS.Utilities.QueryCollection.setAttribute = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/name,/*@type(String)*/value) { };
WinJS.Utilities.QueryCollection.addClass = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/name) { };
WinJS.Utilities.QueryCollection.removeClass = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/name) { };
WinJS.Utilities.QueryCollection.toggleClass = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/name) { };
WinJS.Utilities.QueryCollection.listen = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/eventType,/*@type(Function)*/listener,/*@type(Boolean)*/capture) { };
WinJS.Utilities.QueryCollection.removeEventListener = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/eventType,/*@type(Function)*/listener,/*@type(Boolean)*/capture) { };
WinJS.Utilities.QueryCollection.setStyle = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/name,/*@type(String)*/value) { };
WinJS.Utilities.QueryCollection.clearStyle = /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/name) { };

WinJS.Utilities.QueryCollection.prototype = {
     get : /*@type(Object)*/function (/*@type(Number)*/index) { },
     getAttribute : /*@type(String)*/function (/*@type(String)*/name) { },
     hasClass : /*@type(Boolean)*/function (/*@type(String)*/name) { },
     query : /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(String)*/query) { },
     include : function (items) { },
     control : /*@type(WinJS.Utilities.QueryCollection)*/function (ctor,options) { },
     template : /*@type(WinJS.Utilities.QueryCollection)*/function (/*@type(HTMLElement)*/templateElement,/*@type(Object)*/data,/*@type(Function)*/renderDonePromiseCallback) { },
};

