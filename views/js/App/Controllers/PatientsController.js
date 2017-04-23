"use strict";

angular.module('tunivetApp').
controller('patientsController', function ($timeout, $scope, PatientsService, patients) {
    $scope.search = {
        name: "",
        page: 0,
        items: 4
    };
    $scope.patients = patients.data;
    $scope.pages = Math.ceil(patients.count / $scope.search.items);

    $scope.showForm = false;
    $scope.dataLoading = true;
    $scope.adding = true;

    var _timeout;

    $scope.currentPatient = {
        name: "",
        condition: "",
        exitDate: new Date(),
        tarif: 0
    };

    $scope.setCurrent = (patient) => {
        $scope.showForm = true;
        if (patient) {
            $scope.adding = false;
            $scope.currentPatient.name = patient.name;
            $scope.currentPatient.condition = patient.condition;
            $scope.currentPatient.exitDate = new Date(patient.exitDate);
            $scope.currentPatient.id = patient.id;
            $scope.currentPatient.tarif = patient.tarif;
        } else {
            $scope.adding = true;
            $scope.currentPatient.name = "";
            $scope.currentPatient.condition = "";
            $scope.currentPatient.exitDate = new Date();
        }
    };

    $scope.send = () => {
        var promise;
        if ($scope.adding)
            promise = PatientsService.add($scope.currentPatient);
        else
            promise = PatientsService.update($scope.currentPatient);
        promise.then(suc => {
                $scope.closeForm();
                loadPatients();
            })
            .catch(e => {
                console.log(e.data);
                alert(e.data);
            });
    };

    $scope.delete = (patient) => {
        PatientsService.delete(patient)
            .then(suc => loadPatients())
            .catch(e => alert(e.data));
    };

    $scope.closeForm = () => {
        $scope.showForm = false;
        $scope.currentPatient.name = "";
        $scope.currentPatient.condition = "";
        $scope.currentPatient.exitDate = new Date();
        $scope.currentPatient.tarif = 0;
    };

    $scope.changePage = (page) => {
        if ($scope.search.page + page >= 0 && $scope.search.page + page < $scope.pages) {
            $scope.search.page += page;
            loadPatients(false);
        }
    };

    var loadPatients = () => {
        PatientsService
            .get($scope.search)
            .then(res => {
                $scope.patients = res.data;
                $scope.pages = Math.ceil(res.count / $scope.search.items);
                $scope.dataLoading = false;
                $scope.$apply();
            })
            .catch(e => {
                $scope.dataLoading = false;
                $scope.$apply();
            });
    };

    $scope.updateFilter = (resetPage) => {
        $scope.dataLoading = true;
        if (resetPage)
            $scope.search.page = 0;
        if (_timeout)
            $timeout.cancel(_timeout);
        _timeout = $timeout(() => {
            loadPatients();
            _timeout = null;
        }, 500);
    };
});