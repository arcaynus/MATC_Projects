/**
 * Created by franciscomorales on 7/24/16.
 */
(function(){

    angular.module('toDoApp')
        .component('about', { // the tag for using this is <char-list>
            templateUrl: "templates/about.template.html"
        })
        .config(aboutConfig);

    function aboutConfig($stateProvider) {
        $stateProvider.state('about', {
            url: '/about',
            template: '<about></about>'
        });
    }

})();