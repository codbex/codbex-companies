angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Company successfully created';
		let propertySuccessfullyUpdated = 'Company successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Company Details',
			create: 'Create Company',
			update: 'Update Company'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-companies:codbex-companies-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-companies:codbex-companies-model.defaults.formHeadSelect', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)' });
			$scope.formHeaders.create = LocaleService.t('codbex-companies:codbex-companies-model.defaults.formHeadCreate', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)' });
			$scope.formHeaders.update = LocaleService.t('codbex-companies:codbex-companies-model.defaults.formHeadUpdate', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-companies:codbex-companies-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-companies:codbex-companies-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-companies-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Companies' && e.view === 'Company' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsManager = [];
				$scope.optionsCountry = [];
				$scope.optionsCity = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsManager = data.optionsManager;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsManager = data.optionsManager;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsManager = data.optionsManager;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.action = 'update';
			});
		}});

		$scope.serviceManager = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceCountry = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryService.ts';
		$scope.serviceCity = '/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityService.ts';


		$scope.$watch('entity.Country', (newValue, oldValue) => {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.serviceCountry + '/' + newValue).then((response) => {
					let valueFrom = response.data.Id;
					$http.post('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityService.ts/search', {
						$filter: {
							equals: {
								Country: valueFrom
							}
						}
					}).then((response) => {
						$scope.optionsCity = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						if ($scope.action !== 'select' && newValue !== oldValue) {
							if ($scope.optionsCity.length == 1) {
								$scope.entity.City = $scope.optionsCity[0].value;
							} else {
								$scope.entity.City = undefined;
							}
						}
					}, (error) => {
						console.error(error);
					});
				}, (error) => {
					console.error(error);
				});
			}
		});
		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.COMPANY'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.COMPANY'),
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToCreate', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.COMPANY'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.COMPANY'),
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToCreate', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-companies.Companies.Company.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createManager = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCountry = () => {
			Dialogs.showWindow({
				id: 'Country-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCity = () => {
			Dialogs.showWindow({
				id: 'City-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshManager = () => {
			$scope.optionsManager = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
				$scope.optionsManager = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Manager',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCountry = () => {
			$scope.optionsCountry = [];
			$http.get('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryService.ts').then((response) => {
				$scope.optionsCountry = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Country',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCity = () => {
			$scope.optionsCity = [];
			$http.get('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityService.ts').then((response) => {
				$scope.optionsCity = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'City',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});