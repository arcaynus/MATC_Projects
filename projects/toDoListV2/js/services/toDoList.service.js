/**
 * Created by franciscomorales on 7/23/16.
 */
(function(){
    angular.module('toDoApp')
        .service('toDoListService', ['$localStorage','toaster', toDoListService]);

    function toDoListService($localStorage, toaster){
        var self = this;
        self.selectedList = undefined;
        self.selectList = selectList;
        self.getNewestList = getNewestList;
        self.createList = createList;
        self.deleteList = deleteList;
        self.addTask = addTask;
        self.deleteTask = deleteTask;
        self.completeTask = completeTask;
        self.completedTaskPercent = completedTaskPercent;
        self.clearCompletedTasks = clearCompletedTasks;
        self.completeAllTasks = completeAllTasks;
        self.turnOffEditForAllTasks = turnOffEditForAllTasks;
        self.getStatistics = getStatistics;
        self.toDoList = $localStorage.$default(getDefaultData()).todoApp;
        self.pop = function(type, title, text){
            toaster.pop(type, title, text);
        };
        function init(){
            self.selectedList = getNewestList();
        }
        function selectList(listToSelect){
            self.selectedList = listToSelect;
        }
        function getNewestList(){

            var list;
            if(self.toDoList.length === 0){
                list = null;
            }else{
                list = self.toDoList[0];
                for (var l = 1; l < self.toDoList.length; l++){
                    if(list.createdDate < self.toDoList[l].createdDate){
                        list = self.toDoList[l];
                    }
                }
            }
            return list;
        }

        function createList(){
            self.toDoList[self.toDoList.length] = {
                "listName": "New List " + self.toDoList.length,
                "listID": createUUID(),
                "createdDate": new Date(),
                "completedDate": null,
                "taskList": [
                    {
                        "taskID": createUUID(),
                        "taskName": "",
                        "createdDate": new Date(),
                        "completedDate": null,
                        "editing": true
                    }
                ]
            };
            self.selectedList = self.toDoList[self.toDoList.length-1];
            self.pop('success', 'List', self.toDoList[self.toDoList.length-1].listName + ' added');
        }
        function deleteList(listToDelete){
            var listRemoved;
            for(var list = 0; list < self.toDoList.length; list++){
                if(listToDelete.listID === self.toDoList[list].listID){
                    if(listToDelete.listID === self.selectedList.listID){
                        self.selectedList = undefined;
                    }
                    listRemoved = self.toDoList.splice(list, 1);
                    self.pop('error', 'List', listRemoved[0].listName + ' removed');
                }
            }
            self.selectedList = getNewestList();
        }
        function addTask(list){
            // Turn off editing
            turnOffEditForAllTasks();

            list.taskList.push({
                "taskID": createUUID(),
                "taskName": "",
                "createdDate": new Date(),
                "completedDate": null,
                "editing": true
            });
            self.pop('success', 'Task', 'New task added');
        }
        function deleteTask(index){
            var task = self.selectedList.taskList.splice(index, 1);
            self.pop('error', 'Task', task[0].taskName + ' deleted');
        }
        function completeTask(taskToComplete){
            if(taskToComplete.completedDate){
                taskToComplete.completedDate = null;
                self.pop('warning', 'Task', taskToComplete.taskName + ' not completed');
            }else{
                taskToComplete.completedDate = new Date();
                self.pop('success', 'Task', taskToComplete.taskName + ' completed');
            }
        }

        function completedTaskPercent(list){
            var percent;
            var totalCompletedTasks = 0;
            var totalTasks = list.taskList.length;

            // Deal with there being no tasks (used for requirement 5
            if(totalTasks == 0){
                percent = 1
            }else{
                for(var t = 0; t < totalTasks; t++){
                    if(list.taskList[t].completedDate != null){
                        totalCompletedTasks++;
                    }
                }
                percent = totalCompletedTasks/totalTasks;
            }
            return (percent * 100).toFixed(2);
        }

        function clearCompletedTasks(){
            for(var t = 0; t < self.selectedList.taskList.length; t++){
                if(self.selectedList.taskList[t].completedDate){
                    deleteTask(t);
                    t--;
                }
            }
            self.pop('success', 'Task', 'Completed Tasks Cleared');
        }

        function getStatistics() {
            var totalNumLists = self.toDoList.length;
            var totalNumTasks = 0;
            var totalNumCompLists = 0;
            var totalNumCompTasks = 0;
            var listComplete;

            for(var list = 0; list < self.toDoList.length; list++){
                // increase task count
                totalNumTasks += self.toDoList[list].taskList.length;
                // set the list complete check to true;
                listComplete = true;
                for(var task = 0; task < self.toDoList[list].taskList.length; task++){
                    if(!self.toDoList[list].taskList[task].completedDate){
                        listComplete = false;
                    }else{
                        totalNumCompTasks++;
                    }
                }
                if(listComplete){
                    totalNumCompLists++;
                }
            }
            return {
                totalNumLists: totalNumLists,
                totalNumTasks: totalNumTasks,
                totalNumCompLists: totalNumCompLists,
                totalNumCompTasks: totalNumCompTasks
            }
        }

        function completeAllTasks() {

        }

        function turnOffEditForAllTasks(){
            var len = self.selectedList.taskList.length;
            for(var t = 0; t < len; t++){
                self.selectedList.taskList[t].editing = false;
            }
        }
        function createUUID() {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [36];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            return s.join("");;
        }

        function getDefaultData(){
            return {
               todoApp: [{
                    "listName": "Shopping",
                    "listID": createUUID(),
                    "createdDate": new Date('December 30, 1979 02:15:00'),
                    "completedDate": null,
                    "taskList": [
                        {
                            "taskID": createUUID(),
                            "taskName": "eggs",
                            "createdDate": new Date('December 30, 1979 02:16:00'),
                            "completedDate": new Date('December 30, 1979 02:17:00'),
                            "editing": false
                        },
                        {
                            "taskID": createUUID(),
                            "taskName": "bacon",
                            "createdDate": new Date('December 30, 1979 02:18:00'),
                            "completedDate": new Date('December 30, 1979 02:19:00'),
                            "editing": false
                        },
                        {
                            "taskID": createUUID(),
                            "taskName": "toast",
                            "createdDate": new Date('December 30, 1979 02:20:00'),
                            "completedDate": null,
                            "editing": false
                        }
                    ]
                }]
            };
        }
        // Call the init function
        init();
    }
})();