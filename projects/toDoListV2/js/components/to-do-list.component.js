/**
 * Created by franciscomorales on 7/23/16.
 */
(function(){
    angular.module('toDoApp')
        .component('toDoList', {
            templateUrl: "templates/to-do-list.template.html",
            controller: toDoListController
        })
        .config(toDoListConfig);

    function toDoListConfig($stateProvider) {
        $stateProvider.state('main', {
            url: '/main',
            template: '<to-do-list></to-do-list>'
        });
    }

    function toDoListController(toDoListService){
        // Variables
        var self = this;
        self.orderBy = 'newest';
        self.sortClass= 'sort-asc';
        self.toDoListService = toDoListService;

        // Functions

    }
})();