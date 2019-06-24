var app = angular.module("app", ["ngRoute", "ngMaterial", 'ngFileUpload', "ui.router"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/upload", {
            templateUrl: "./views/upload.html",
            controller: "uploadController as uploadCtrl"
        })
        .when("/list", {
            templateUrl: "./views/uploadedlist.html",
            controller: "uploadListController"
        })
        .when("/data", {
            templateUrl: "./views/filedata.html",
            controller: "uploadDataController"
        });
});

app.controller("uploadController", function($scope, Upload, $http, $location) {
    var vm = this;
    $scope.files = [];
    vm.upload = upload;
    vm.reset = reset;
    localStorage.removeItem("q");

    function upload() {
        if (!$scope.files.name) return;
        else
            Upload.upload({
                url: '/upload',
                data: { file: $scope.files },
            }).then(async function(resp) {
                    vm.progress = "";
                    toastr.options = {
                        "positionClass": "toast-bottom-right"
                    }
                    toastr.success("File has been uploaded!");
                    $location.path('/list');
                },
                function(exp) {
                    swal("File is not uploaded!");
                    vm.progress = "";
                },
                function(evt) {
                    vm.progress = parseInt(100.0 * evt.loaded / evt.total);
                });
    }

    function reset() {
        $scope.files = [];
    }

    vm.files = function() {
        $location.path('/list');
    }

});
app.controller("uploadListController", function($http, $scope, $location) {
    localStorage.removeItem("q");
    $http.get('/list').then(response => {
        $scope.lists = response.data.list;
    });
    $scope.filedata = function(id) {
        localStorage.setItem("q", id);
        $location.path('/data');
    }
});
app.controller("uploadDataController", function($scope, $location, $window, $http) {
    $scope.msg = "uploaded data";
    let id = localStorage.getItem("q");
    if (!id) {
        return $location.path('/list');
    }
    $http.get('/listing?id=' + id).then(response => {
        if (response.status == 201) {
            swal(response.data.msg);
        }
        $scope.headers = response.data.headers;
        $scope.listData = response.data.result;
        console.log("$scope.listData", $scope.listData);
    });



});

app.filter('sizeFilter', sizeFilter);

function sizeFilter() {
    return function(bytes) {
        if (bytes <= 0) return 0 + " byte";
        var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes) / Math.log(1000));
        return Math.round((bytes / Math.pow(1000, Math.floor(e)))).toFixed(1) + " " + s[e];
    };
}