'use strict';

angular.module('copayApp.controllers').controller('SettingsController', function($scope, $rootScope, $window, $location, controllerUtils, notification) {


  controllerUtils.redirIfLogged();




  $scope.title = 'Settings';
  $scope.defaultLanguage = config.defaultLanguage || 'en';
  $scope.insightLivenet = config.network.livenet.url;
  $scope.insightTestnet = config.network.testnet.url;
  $scope.defaultLogLevel = config.logLevel || 'log';

  var logLevels = copay.logger.getLevels();

  $scope.availableLogLevels = [];


  for (var key in logLevels) {
    $scope.availableLogLevels.push({
      'name': key
    });
  }

  $scope.availableStorages = [{
      name: 'Insight',
      pluginName: 'EncryptedInsightStorage',
    }, {
      name: 'Localstorage',
      pluginName: 'EncryptedLocalStorage',
    },
    // {
    //   name: 'GoogleDrive',
    //   pluginName: 'GoogleDrive',
    // }
  ];

  _.each($scope.availableStorages, function(v) {
    if (config.plugins[v.pluginName])
      $scope.selectedStorage = v;
  });

  $scope.availableLanguages = [{
    name: 'English',
    isoCode: 'en',
  }, {
    name: 'Spanish',
    isoCode: 'es',
  }];

  for (var ii in $scope.availableLanguages) {
    if ($scope.defaultLanguage === $scope.availableLanguages[ii].isoCode) {
      $scope.selectedLanguage = $scope.availableLanguages[ii];
      break;
    }
  }

  for (var ii in $scope.availableLogLevels) {
    if ($scope.defaultLogLevel === $scope.availableLogLevels[ii].name) {
      $scope.selectedLogLevel = $scope.availableLogLevels[ii];
      break;
    }
  }


  $scope.save = function() {
    $scope.insightLivenet = copay.Insight.setCompleteUrl($scope.insightLivenet);
    $scope.insightTestnet = copay.Insight.setCompleteUrl($scope.insightTestnet);


    var insightSettings = {
      livenet: {
        url: $scope.insightLivenet,
        transports: ['polling'],
      },
      testnet: {
        url: $scope.insightTestnet,
        transports: ['polling'],
      },
    }


    var plugins = {};
    plugins[$scope.selectedStorage.pluginName] = true;
    copay.logger.setLevel($scope.selectedLogLevel.name);

    localStorage.setItem('config', JSON.stringify({
      network: insightSettings,
      version: copay.version,
      defaultLanguage: $scope.selectedLanguage.isoCode,
      plugins: plugins,
      logLevel: $scope.selectedLogLevel.name,
    }));

    // Go home reloading the application
    var hashIndex = window.location.href.indexOf('#!/');
    window.location = window.location.href.substr(0, hashIndex);
  };
});
