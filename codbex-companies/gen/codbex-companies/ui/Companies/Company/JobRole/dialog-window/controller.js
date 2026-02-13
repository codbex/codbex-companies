angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/JobRoleService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'JobRole successfully created';
		let propertySuccessfullyUpdated = 'JobRole successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'JobRole Details',
			create: 'Create JobRole',
			update: 'Update JobRole'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-companies:codbex-companies-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-companies:codbex-companies-model.defaults.formHeadSelect', { name: '$t(codbex-companies:codbex-companies-model.t.JOBROLE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-companies:codbex-companies-model.defaults.formHeadCreate', { name: '$t(codbex-companies:codbex-companies-model.t.JOBROLE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-companies:codbex-companies-model.defaults.formHeadUpdate', { name: '$t(codbex-companies:codbex-companies-model.t.JOBROLE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-companies:codbex-companies-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-companies:codbex-companies-model.t.JOBROLE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-companies:codbex-companies-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-companies:codbex-companies-model.t.JOBROLE)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-companies.Companies.JobRole.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.JOBROLE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.JOBROLE'),
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToCreate', { name: '$t(codbex-companies:codbex-companies-model.t.JOBROLE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-companies.Companies.JobRole.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.JOBROLE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-companies:codbex-companies-model.t.JOBROLE'),
					message: LocaleService.t('codbex-companies:codbex-companies-model.messages.error.unableToUpdate', { name: '$t(codbex-companies:codbex-companies-model.t.JOBROLE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};


		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'JobRole-details' });
		};
	});