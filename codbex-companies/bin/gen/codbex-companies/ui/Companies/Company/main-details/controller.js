angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-companies/gen/codbex_companies/api/companies/CompanyController';
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
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
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
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsManager = data.optionsManager;
				$scope.optionsCountry = data.optionsCountry;
				$scope.optionsCity = data.optionsCity;
				$scope.action = 'update';
			});
		}});

		$scope.serviceManager = '/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController';
		$scope.serviceCountry = '/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController';
		$scope.serviceCity = '/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController';

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

		const lastSearchValuesManager = new Set();
		const allValuesManager = [];
		let loadMoreOptionsManagerCounter = 0;
		$scope.optionsManagerLoading = false;
		$scope.optionsManagerHasMore = true;

		$scope.loadMoreOptionsManager = () => {
			const limit = 20;
			$scope.optionsManagerLoading = true;
			$http.get(`/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController?$limit=${limit}&$offset=${++loadMoreOptionsManagerCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesManager.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesManager.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsManager.find(o => o.value === e.value)) {
						$scope.optionsManager.push(e);
					}
				})
				$scope.optionsManagerHasMore = resultValues.length > 0;
				$scope.optionsManagerLoading = false;
			}, (error) => {
				$scope.optionsManagerLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Manager',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsManagerChange = (event) => {
			if (allValuesManager.length === 0) {
				allValuesManager.push(...$scope.optionsManager);
			}
			if (event.originalEvent.target.value === '') {
				allValuesManager.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsManager = allValuesManager;
				$scope.optionsManagerHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsManagerHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesManager).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesManager.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesManager.push(e);
							}
						});
						$scope.optionsManager = allValuesManager.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Manager',
							message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesManager.add(event.originalEvent.target.value);
				}
			}
		};

		$scope.refreshManager = () => {
			$scope.optionsManager = [];
			$http.get('/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController').then((response) => {
				$scope.optionsManager = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesManager.length === 0;
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
		const lastSearchValuesCountry = new Set();
		const allValuesCountry = [];
		let loadMoreOptionsCountryCounter = 0;
		$scope.optionsCountryLoading = false;
		$scope.optionsCountryHasMore = true;

		$scope.loadMoreOptionsCountry = () => {
			const limit = 20;
			$scope.optionsCountryLoading = true;
			$http.get(`/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController?$limit=${limit}&$offset=${++loadMoreOptionsCountryCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesCountry.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesCountry.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsCountry.find(o => o.value === e.value)) {
						$scope.optionsCountry.push(e);
					}
				})
				$scope.optionsCountryHasMore = resultValues.length > 0;
				$scope.optionsCountryLoading = false;
			}, (error) => {
				$scope.optionsCountryLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Country',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsCountryChange = (event) => {
			if (allValuesCountry.length === 0) {
				allValuesCountry.push(...$scope.optionsCountry);
			}
			if (event.originalEvent.target.value === '') {
				allValuesCountry.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsCountry = allValuesCountry;
				$scope.optionsCountryHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsCountryHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesCountry).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesCountry.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesCountry.push(e);
							}
						});
						$scope.optionsCountry = allValuesCountry.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Country',
							message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesCountry.add(event.originalEvent.target.value);
				}
			}
		};

		$scope.refreshCountry = () => {
			$scope.optionsCountry = [];
			$http.get('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController').then((response) => {
				$scope.optionsCountry = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesCountry.length === 0;
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
		const lastSearchValuesCity = new Set();
		const allValuesCity = [];
		let loadMoreOptionsCityCounter = 0;
		$scope.optionsCityLoading = false;
		$scope.optionsCityHasMore = true;

		$scope.loadMoreOptionsCity = () => {
			const limit = 20;
			$scope.optionsCityLoading = true;
			$http.get(`/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController?$limit=${limit}&$offset=${++loadMoreOptionsCityCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesCity.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesCity.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsCity.find(o => o.value === e.value)) {
						$scope.optionsCity.push(e);
					}
				})
				$scope.optionsCityHasMore = resultValues.length > 0;
				$scope.optionsCityLoading = false;
			}, (error) => {
				$scope.optionsCityLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'City',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsCityChange = (event) => {
			if (allValuesCity.length === 0) {
				allValuesCity.push(...$scope.optionsCity);
			}
			if (event.originalEvent.target.value === '') {
				allValuesCity.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsCity = allValuesCity;
				$scope.optionsCityHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsCityHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesCity).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesCity.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesCity.push(e);
							}
						});
						$scope.optionsCity = allValuesCity.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'City',
							message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesCity.add(event.originalEvent.target.value);
				}
			}
		};

		$scope.refreshCity = () => {
			$scope.optionsCity = [];
			$http.get('/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController').then((response) => {
				$scope.optionsCity = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesCity.length === 0;
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

		function isText(keycode) {
			if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
			return false;
		}

		//----------------Dropdowns-----------------//	
	});