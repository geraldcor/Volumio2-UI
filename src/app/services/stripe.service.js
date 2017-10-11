class StripeService {
  constructor(databaseService, authService, $q) {
    this.databaseService = databaseService;
    this.authService = authService;
    this.$q = $q;

    this.user = {};

    this.init();
  }

  init() {
    this.authService.getUserPromise();
  }

  processPayment() {

  }

  subscribe(subscription, userId) {
    var subscribing = this.$q.defer();
    var ref = 'payments/subscriptions/' + userId;

    this.databaseService.push(ref, subscription).then((subscriptionId) => {
      this.getSubscriptionResponse(subscriptionId, userId).then((status) => {
        console.log(status);
        if (status === true) {
          subscribing.resolve(status);
          return;
        }
        this.getSubscriptionError(subscriptionId, userId).then((error) => {
          subscribing.reject(error);
        });
      });
    }).catch((error) => {
      console.log(error);
      subscribing.reject(error);
    });
    return subscribing.promise;
  }

  getSubscriptionResponse(subscriptionId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/subscriptions/${userId}/${subscriptionId}/status`;
    this.databaseService.waitForValue(ref).then((status) => {
      console.log(status);
      getting.resolve(status);
    }, (error) => {
      console.log(error);
      getting.reject(error);
    });
    return getting.promise;
  }

  getPlanForSubscription(subscriptionId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/subscriptions/${userId}/${subscriptionId}/planCode`;
    this.databaseService.get(ref).then((planCode) => {
      getting.resolve(planCode);
    }, (error) => {
      getting.reject(error);
    });
    return getting.promise;
  }

  getSubscriptionError(subscriptionId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/subscriptions/${userId}/${subscriptionId}/error`;
    this.databaseService.get(ref).then((error) => {
      if (error === undefined) {
        getting.resolve("No success but no stripe error");
        return;
      }
      getting.resolve(error);
    }, (error) => {
      getting.reject(error);
    });
    return getting.promise;
  }

  cancelSubscription(subscriptionId, userId) {
    var cancellating = this.$q.defer();
    var ref = 'payments/cancellations/' + userId;

    const cancellation = {
      subscriptionId: subscriptionId,
      created_at: firebase.database.ServerValue.TIMESTAMP
    };

    this.databaseService.push(ref, cancellation).then((cancellationId) => {
      this.getCancellationResponse(cancellationId, userId).then((status) => {
        console.log(status);
        if (status === true) {
          cancellating.resolve(status);
          return;
        }
        this.getCancellationError(cancellationId, userId).then((error) => {
          cancellating.reject(error);
        });
      });
    }).catch((error) => {
      console.log(error);
      cancellating.reject(error);
    });
    return cancellating.promise;
  }

  getCancellationResponse(cancellationId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/cancellations/${userId}/${cancellationId}/status`;
    this.databaseService.waitForValue(ref).then((status) => {
      console.log(status);
      getting.resolve(status);
    }, (error) => {
      console.log(error);
      getting.reject(error);
    });
    return getting.promise;
  }

  getCancellationError(cancellationId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/cancellations/${userId}/${cancellationId}/error`;
    this.databaseService.get(ref).then((error) => {
      if (error === undefined) {
        getting.resolve("No success but no stripe error");
        return;
      }
      getting.resolve(error);
    }, (error) => {
      getting.reject(error);
    });
    return getting.promise;
  }

  updateSubscription(planCode, userId) {
    var updating = this.$q.defer();
    var ref = 'payments/updates/' + userId;

    const update = {
      planCode: planCode,
      created_at: firebase.database.ServerValue.TIMESTAMP
    };

    this.databaseService.push(ref, update).then((updateId) => {
      this.getUpdateResponse(updateId, userId).then((status) => {
        console.log(status);
        if (status === true) {
          updating.resolve(status);
          return;
        }
        this.getUpdateError(updateId, userId).then((error) => {
          updating.reject(error);
        });
      });
    }).catch((error) => {
      console.log(error);
      updating.reject(error);
    });
    return updating.promise;
  }

  getUpdateResponse(updateId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/updates/${userId}/${updateId}/status`;
    this.databaseService.waitForValue(ref).then((status) => {
      console.log(status);
      getting.resolve(status);
    }, (error) => {
      console.log(error);
      getting.reject(error);
    });
    return getting.promise;
  }

  getUpdateError(updateId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/updates/${userId}/${updateId}/error`;
    this.databaseService.get(ref).then((error) => {
      if (error === undefined) {
        getting.resolve("No success but no stripe error");
        return;
      }
      getting.resolve(error);
    }, (error) => {
      getting.reject(error);
    });
    return getting.promise;
  }

}

export default StripeService;