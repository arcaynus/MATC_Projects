/**
 * Created by franciscomorales on 7/23/16.
 */
(function(){
    angular.module('toDoApp')
        .component('listDetail', {
            templateUrl: "templates/list-detail.template.html",
            controller: listDetailController,
            bindings: {
                list: '<selectedList'
            }
        });

    function listDetailController(toDoListService){
        var self = this;
        self.toDoListService = toDoListService;
    }
})();