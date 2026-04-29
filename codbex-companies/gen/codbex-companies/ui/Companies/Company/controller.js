angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete Company? This action cannot be undone.',
			deleteTitle: 'Delete Company?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-companies:codbex-companies-model.defaults.yes');
			translated.no = LocaleService.t('codbex-companies:codbex-companies-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-companies:codbex-companies-model.defaults.deleteTitle', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)' });
			translated.deleteConfirm = LocaleService.t('codbex-companies:codbex-companies-model.messages.deleteConfirm', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-companies-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Companies' && e.view === 'Company' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-companies.Companies.Company.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {
					$filter: {}
				};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$filter.offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$filter.limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$filter.offset = 0;
					filter.$filter.limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					if (optionsManagerHasMore) {
						const optionsManagerSearchValues = Array.from(new Set(response.data.map(e => e.Manager)));
						if (optionsManagerSearchValues.length > 0) {
							$http.post('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsManagerSearchValues }
								]
							}).then((response) => {
								$scope.optionsManager.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Manager',
									message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsCountryHasMore) {
						const optionsCountrySearchValues = Array.from(new Set(response.data.map(e => e.Country)));
						if (optionsCountrySearchValues.length > 0) {
							$http.post('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsCountrySearchValues }
								]
							}).then((response) => {
								$scope.optionsCountry.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Country',
									message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsCityHasMore) {
						const optionsCitySearchValues = Array.from(new Set(response.data.map(e => e.City)));
						if (optionsCitySearchValues.length > 0) {
							$http.post('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsCitySearchValues }
								]
							}).then((response) => {
								$scope.optionsCity.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'City',
									message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					response.data.forEach(e => {
						if (e.CreatedAt) {
							e.CreatedAt = new Date(e.CreatedAt);
						}
						if (e.UpdatedAt) {
							e.UpdatedAt = new Date(e.UpdatedAt);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-companies:codbex-companies-model.t.COMPANY'),
						message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLF', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.COMPANY'),
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToCount', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsManager: $scope.optionsManager,
				optionsCountry: $scope.optionsCountry,
				optionsCity: $scope.optionsCity,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.createEntity', data: {
				entity: {},
				optionsManager: $scope.optionsManager,
				optionsCountry: $scope.optionsCountry,
				optionsCity: $scope.optionsCity,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsManager: $scope.optionsManager,
				optionsCountry: $scope.optionsCountry,
				optionsCity: $scope.optionsCity,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-companies.Companies.Company.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-companies:codbex-companies-model.t.COMPANY'),
							message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToDelete', { name: '$t(codbex-companies:codbex-companies-model.t.COMPANY)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'Company-filter',
				params: {
					entity: $scope.filterEntity,
					optionsManager: $scope.optionsManager,
					optionsCountry: $scope.optionsCountry,
					optionsCity: $scope.optionsCity,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsManager = [];
		$scope.optionsCountry = [];
		$scope.optionsCity = [];

		let optionsManagerHasMore = true;

		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts/count').then((response) => {
			const optionsManagerCount = response.data.count;
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts').then((response) => {
				$scope.optionsManager = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsManagerHasMore = optionsManagerCount > $scope.optionsManager.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Manager',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Manager',
				message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsCountryHasMore = true;

		$http.get('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts/count').then((response) => {
			const optionsCountryCount = response.data.count;
			$http.get('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts').then((response) => {
				$scope.optionsCountry = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsCountryHasMore = optionsCountryCount > $scope.optionsCountry.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Country',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Country',
				message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsCityHasMore = true;

		$http.get('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts/count').then((response) => {
			const optionsCityCount = response.data.count;
			$http.get('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts').then((response) => {
				$scope.optionsCity = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsCityHasMore = optionsCityCount > $scope.optionsCity.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'City',
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'City',
				message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsManagerValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsManager.length; i++) {
				if ($scope.optionsManager[i].value === optionKey) {
					return $scope.optionsManager[i].text;
				}
			}
			return null;
		};
		$scope.optionsCountryValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCountry.length; i++) {
				if ($scope.optionsCountry[i].value === optionKey) {
					return $scope.optionsCountry[i].text;
				}
			}
			return null;
		};
		$scope.optionsCityValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCity.length; i++) {
				if ($scope.optionsCity[i].value === optionKey) {
					return $scope.optionsCity[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
