/**
 * Created by franciscomorales on 8/21/16.
 */
(function(){
    angular.module("toDoApp")
        .filter('capitalize', function(){
           return function(input){
               if(input && input.length > 0) {
                   var stringArray = input.toString().split(" ");
                   for(var i = 0; i < stringArray.length; i++){
                       stringArray[i] = stringArray[i].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                   }
                   input = stringArray.join(" ");
               }
               return input;
           };
        });
})();
