document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	var gameState;

	initialize(localStorage['incremental.save'] ? JSON.parse(localStorage['incremental.save']) : null);

	document.getElementById('button').addEventListener('click', function () {
		incrementScore(gameState.clickValue);
	});
	document.getElementById('saveButton').addEventListener('click', save);
	document.getElementById('resetButton').addEventListener('click', function () {
		confirm('Are you sure you want to reset?') && reset();
	});
	document.getElementById('upgradeClickValueButton').addEventListener('click', function () {
		if (gameState.score < gameState.clickValueUpgradePrice)
			return;
		incrementScore(- gameState.clickValueUpgradePrice);
		gameState.clickValueUpgradePrice *= 2;
		updateClickValueUpgradePriceDisplay();
		gameState.clickValue ++;
		updateClickValueDisplay();
	});
	document.getElementById('upgradeAutoclickValueButton').addEventListener('click', function () {
		if (gameState.score < gameState.autoclickValueUpgradePrice)
			return;
		incrementScore(- gameState.autoclickValueUpgradePrice);
		gameState.autoclickValueUpgradePrice *= 2;
		updateAutoclickValueUpgradePriceDisplay();
		gameState.autoclickValue ++;
		updateAutoclickValueDisplay();
	});

	setInterval(function () {
		var currentTime = Date.now(), timeElapsed = currentTime - gameState.lastTick;
		gameState.lastTick = currentTime;

		incrementScore(gameState.autoclickValue * (timeElapsed / 1000));
	}, 1000);

	setInterval(save, 30000);
	window.addEventListener('beforeunload', save);

	function incrementScore(delta) {
		gameState.score += delta;
		updateScoreDisplay();
	}

	function updateScoreDisplay() {
		var displayedScore = Math.round(gameState.score);
		document.getElementById('score').textContent = displayedScore;
		document.title = displayedScore;
	}
	function updateClickValueDisplay() {
		document.getElementById('clickValue').textContent = gameState.clickValue;
	}
	function updateAutoclickValueDisplay() {
		document.getElementById('autoclickValue').textContent = gameState.autoclickValue;
	}
	function updateClickValueUpgradePriceDisplay() {
		document.getElementById('clickValueUpgradePrice').textContent = gameState.clickValueUpgradePrice;
	}
	function updateAutoclickValueUpgradePriceDisplay() {
		document.getElementById('autoclickValueUpgradePrice').textContent = gameState.autoclickValueUpgradePrice;
	}

	function save() {
		localStorage['incremental.save'] = JSON.stringify(gameState);
	}

	function reset() {
		initialize();
		save();
	}

	function initialize(state) {
		gameState = state || {
			score: 0,
			lastTick: Date.now(),
			clickValue: 1,
			autoclickValue: 0,
			clickValueUpgradePrice: 1,
			autoclickValueUpgradePrice: 1
		};
		updateScoreDisplay();
		updateClickValueDisplay();
		updateAutoclickValueDisplay();
		updateClickValueUpgradePriceDisplay();
		updateAutoclickValueUpgradePriceDisplay();
	}

});
