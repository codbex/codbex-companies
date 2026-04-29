angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.CreatedAtFrom) {
			params.entity.CreatedAtFrom = new Date(params.entity.CreatedAtFrom);
		}
		if (params?.entity?.CreatedAtTo) {
			params.entity.CreatedAtTo = new Date(params.entity.CreatedAtTo);
		}
		if (params?.entity?.UpdatedAtFrom) {
			params.entity.UpdatedAtFrom = new Date(params.entity.UpdatedAtFrom);
		}
		if (params?.entity?.UpdatedAtTo) {
			params.entity.UpdatedAtTo = new Date(params.entity.UpdatedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		const optionsManagerMap = new Map();
		params.optionsManager.forEach(e => optionsManagerMap.set(e.value, e));
		$scope.optionsManager = Array.from(optionsManagerMap.values());
		const optionsCountryMap = new Map();
		params.optionsCountry.forEach(e => optionsCountryMap.set(e.value, e));
		$scope.optionsCountry = Array.from(optionsCountryMap.values());
		const optionsCityMap = new Map();
		params.optionsCity.forEach(e => optionsCityMap.set(e.value, e));
		$scope.optionsCity = Array.from(optionsCityMap.values());
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				conditions: [],
				sorts: [],
				limit: 20,
				offset: 0
			}
		};
		if (entity.Id !== undefined) {
			const condition = { propertyName: 'Id', operator: 'EQ', value: entity.Id };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Name) {
			const condition = { propertyName: 'Name', operator: 'LIKE', value: `%${entity.Name}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Manager !== undefined) {
			const condition = { propertyName: 'Manager', operator: 'EQ', value: entity.Manager };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Email) {
			const condition = { propertyName: 'Email', operator: 'LIKE', value: `%${entity.Email}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Phone) {
			const condition = { propertyName: 'Phone', operator: 'LIKE', value: `%${entity.Phone}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Address) {
			const condition = { propertyName: 'Address', operator: 'LIKE', value: `%${entity.Address}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PostCode) {
			const condition = { propertyName: 'PostCode', operator: 'LIKE', value: `%${entity.PostCode}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Country !== undefined) {
			const condition = { propertyName: 'Country', operator: 'EQ', value: entity.Country };
			filter.$filter.conditions.push(condition);
		}
		if (entity.City !== undefined) {
			const condition = { propertyName: 'City', operator: 'EQ', value: entity.City };
			filter.$filter.conditions.push(condition);
		}
		if (entity.TIN) {
			const condition = { propertyName: 'TIN', operator: 'LIKE', value: `%${entity.TIN}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.IBAN) {
			const condition = { propertyName: 'IBAN', operator: 'LIKE', value: `%${entity.IBAN}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtFrom) {
			const condition = { propertyName: 'CreatedAt', operator: 'GE', value: entity.CreatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtTo) {
			const condition = { propertyName: 'CreatedAt', operator: 'LE', value: entity.CreatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedBy) {
			const condition = { propertyName: 'CreatedBy', operator: 'LIKE', value: `%${entity.CreatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtFrom) {
			const condition = { propertyName: 'UpdatedAt', operator: 'GE', value: entity.UpdatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtTo) {
			const condition = { propertyName: 'UpdatedAt', operator: 'LE', value: entity.UpdatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedBy) {
			const condition = { propertyName: 'UpdatedBy', operator: 'LIKE', value: `%${entity.UpdatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-companies.Companies.Company.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-companies.Companies.Company.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
		lastSearchValuesManager.clear();
		allValuesManager.length = 0;
		lastSearchValuesCountry.clear();
		allValuesCountry.length = 0;
		lastSearchValuesCity.clear();
		allValuesCity.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Company-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesManager = new Set();
	const allValuesManager = [];
	let loadMoreOptionsManagerCounter = 0;
	$scope.optionsManagerLoading = false;
	$scope.optionsManagerHasMore = true;

	$scope.loadMoreOptionsManager = () => {
		const limit = 20;
		$scope.optionsManagerLoading = true;
		$http.get(`/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts?$limit=${limit}&$offset=${++loadMoreOptionsManagerCounter * limit}`)
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
				$http.post('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts/search', {
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

	const lastSearchValuesCountry = new Set();
	const allValuesCountry = [];
	let loadMoreOptionsCountryCounter = 0;
	$scope.optionsCountryLoading = false;
	$scope.optionsCountryHasMore = true;

	$scope.loadMoreOptionsCountry = () => {
		const limit = 20;
		$scope.optionsCountryLoading = true;
		$http.get(`/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCountryCounter * limit}`)
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
				$http.post('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts/search', {
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

	const lastSearchValuesCity = new Set();
	const allValuesCity = [];
	let loadMoreOptionsCityCounter = 0;
	$scope.optionsCityLoading = false;
	$scope.optionsCityHasMore = true;

	$scope.loadMoreOptionsCity = () => {
		const limit = 20;
		$scope.optionsCityLoading = true;
		$http.get(`/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCityCounter * limit}`)
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
				$http.post('/services/ts/codbex-cities/gen/codbex-cities/api/Settings/CityController.ts/search', {
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

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});