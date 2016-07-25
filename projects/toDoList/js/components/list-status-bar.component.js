/**
 * Created by franciscomorales on 7/24/16.
 */
(function(){
    angular.module('toDoApp')
        .component('listStatusBar', {
            templateUrl: "templates/list-status-bar.template.html",
            controller: listStatusBar
        });
    function listStatusBar(toDoListService) {
        var self = this;
        self.toDoListService = toDoListService;
    }
})();