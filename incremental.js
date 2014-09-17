var incrementalApp = angular.module('incrementalApp', []);
incrementalApp.controller('incrementalController', ['$scope', '$interval', function ($scope, $interval) {
	'use strict';

	initialize(localStorage['incremental.save'] ? JSON.parse(localStorage['incremental.save']) : null);

	Object.defineProperty($scope, 'displayedScore', {
		get: function () {
			return Math.round($scope.score);
		}
	});

	$scope.click = function () {
		incrementScore($scope.clickValue);
	};
	$scope.save = save;
	$scope.reset = function () {
		if (!confirm('Are you sure you want to reset?'))
			return;
		initialize();
		save();
	};
	$scope.upgradeClickValue = function () {
		if ($scope.score < $scope.clickValueUpgradePrice)
			return;
		incrementScore(- $scope.clickValueUpgradePrice);
		$scope.clickValueUpgradePrice *= 2;
		$scope.clickValue ++;
	};
	$scope.upgradeAutoclickValue = function () {
		if ($scope.score < $scope.autoclickValueUpgradePrice)
			return;
		incrementScore(- $scope.autoclickValueUpgradePrice);
		$scope.autoclickValueUpgradePrice *= 2;
		$scope.autoclickValue ++;
	};

	$interval(function () {
		var currentTime = Date.now(), timeElapsed = currentTime - $scope.lastTick;
		$scope.lastTick = currentTime;

		incrementScore($scope.autoclickValue * (timeElapsed / 1000));
	}, 1000);

	$interval(save, 30000);
	window.addEventListener('beforeunload', save);

	function incrementScore(delta) {
		$scope.score += delta;
	}

	function save() {
		var state = {};
		['score', 'lastTick', 'clickValue', 'autoclickValue', 'clickValueUpgradePrice', 'autoclickValueUpgradePrice'].forEach(function (key) {
			state[key] = $scope[key];
		});
		localStorage['incremental.save'] = JSON.stringify(state);
	}

	function initialize(state) {
		angular.extend($scope, state || {
			score: 0,
			lastTick: Date.now(),
			clickValue: 1,
			autoclickValue: 0,
			clickValueUpgradePrice: 1,
			autoclickValueUpgradePrice: 1
		});

	}

}]);
