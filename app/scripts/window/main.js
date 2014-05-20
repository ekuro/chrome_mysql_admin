var chromeMyAdmin = angular.module("chromeMyAdmin", ["ngGrid", "ui.ace"]);

chromeMyAdmin.run(["$rootScope", "Events", "ErrorLevel", function($rootScope, Events, ErrorLevel) {
    "use strict";

    $rootScope.connected = false;

    $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase === '$apply' || phase === '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.fatalErrorOccurred = function(errorMessage) {
        $rootScope.$broadcast(Events.SHOW_ERROR_DIALOG, {
            errorLevel: ErrorLevel.FATAL,
            reason: errorMessage
        });
    };

    $rootScope.showErrorDialog = function(message, reason) {
        $rootScope.$broadcast(Events.SHOW_ERROR_DIALOG, {
            errorLevel: ErrorLevel.ERROR,
            message: message,
            reason: reason
        });
    };

    $rootScope.notifyConnectionChanged = function(connectionInfo) {
        $rootScope.$broadcast(Events.CONNECTION_CHANGED, connectionInfo);
    };

    $rootScope.showMainStatusMessage = function(message) {
        $rootScope.$broadcast(Events.SHOW_MAIN_STATUS_MESSAGE, message);
    };

    $rootScope.showProgressBar = function() {
        $rootScope.$broadcast(Events.SHOW_PROGRESS_BAR, null);
    };

    $rootScope.hideProgressBar = function() {
        $rootScope.$broadcast(Events.HIDE_PROGRESS_BAR, null);
    };

    $rootScope.callbackFromConfirmDialog = function(callbackEvent, result) {
        $rootScope.$broadcast(callbackEvent, result);
    };

    $rootScope.showConfirmDialog = function(
        message, yesButtonLabel, noButtonLabel, callbackEvent) {
        $rootScope.$broadcast(Events.SHOW_CONFIRM_DIALOG, {
            message: message,
            yesButtonLabel: yesButtonLabel,
            noButtonLabel: noButtonLabel,
            callbackEvent: callbackEvent
        });
    };

    $rootScope.showConfigurationDialog = function() {
        $rootScope.$broadcast(Events.SHOW_CONFIGURATION_DIALOG, null);
    };

    $rootScope.showQueryPanel = function(query) {
        $rootScope.$broadcast(Events.SHOW_QUERY_PANEL, {query: query});
    };

    var adjustMainPanelHeight = function() {
        $("#mainPanel").height($(window).height() - 76);
    };

    var assignWindowResizeEventHandler = function() {
        $(window).resize(function(evt) {
            adjustMainPanelHeight();
        });
    };

    assignWindowResizeEventHandler();
    adjustMainPanelHeight();
}]);

chromeMyAdmin.directive("resizeWhen", function() {
    "use strict";

    return {
        restrict: "A",
        scope: false,
        link: function(scope, elem, attrs, ctrl) {
            var resizeExpr = attrs.resizeWhen;
            var listener = scope.$watch(resizeExpr, function(value) {
                if (value) {
                    elem.resize();
                    listener();
                }
            }, false);
        }
    };
});
