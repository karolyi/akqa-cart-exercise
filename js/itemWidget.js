/*global $*/
'use strict';

$.widget('AKQA.itemWidget', {
  options: {
    index: 0,
    item: {},
    cartWidget: {},
    minValue: 1,
    maxValue: 10,
    startValue: 1,
    selectors: {
      productWrapper: 'label.product',
      priceWrapper: '.price span',
      costWrapper: '.cost span',
      quantityInput: 'input',
      quantityUp: 'button.qty-up',
      quantityDown: 'button.qty-down',
      buttonRemove: 'button.remove'
    }
  },

  _create: function () {
    var self = this;
    this.valueRegex = /^[0-9]+$/;
    this.productWrapper = this.element.find(this.options.selectors.productWrapper);
    this.costWrapper = this.element.find(this.options.selectors.costWrapper);
    this.priceWrapper = this.element.find(this.options.selectors.priceWrapper);
    this.quantityInput = this.element.find(this.options.selectors.quantityInput);
    this.quantityUp = this.element.find(this.options.selectors.quantityUp);
    this.quantityDown = this.element.find(this.options.selectors.quantityDown);
    this.buttonRemove = this.element.find(this.options.selectors.buttonRemove);
    this.quantityInput.change(function (event) {
      self._onChangeQuantity(event);
    });
    this.quantityUp.click(function (event) {
      self._onClickQuantityUp(event);
    });
    this.quantityDown.click(function (event) {
      self._onClickQuantityDown(event);
    });
    this.buttonRemove.click(function () {
      self.element.remove();
      self.options.cartWidget._updateTotals();
    });
    this.productWrapper.attr('for', 'qty-' + this.options.index)
      .text(this.options.item.product);
    this.quantityInput.attr('id', 'qty-' + this.options.index)
      .val(this.options.item.quantity);
    this.priceWrapper.text(this.options.item.price);
    this._updateCost();
  },

  _sanitizeQuantityValue: function () {
    var value = this.quantityInput.val();
    if (!this.valueRegex.test(value)) {
      this.quantityInput.val(0);
      return 0;
    }
    return parseInt(value, 10);
  },

  _onChangeQuantity: function () {
    var value = this._sanitizeQuantityValue();
    if (value > this.options.maxValue) {
      this.quantityInput.val(this.options.maxValue);
    }
    if (value < this.options.minValue) {
      this.quantityInput.val(this.options.minValue);
    }
    this._updateCost();
    this.options.cartWidget._updateTotals();
  },

  _handlePriceFloat: function (input) {
    return Math.round(input * 100) / 100;
  },

  _onClickQuantityUp: function () {
    var value = this._sanitizeQuantityValue();
    this.quantityInput.val(value + 1);
    this._onChangeQuantity();
  },

  _onClickQuantityDown: function () {
    var value = this._sanitizeQuantityValue();
    this.quantityInput.val(value - 1);
    this._onChangeQuantity();
  },

  _updateCost: function () {
    this.costWrapper.text(this.getCost());
  },

  getCost: function () {
    return this._handlePriceFloat(this.options.item.price * this._sanitizeQuantityValue());
  },

  getJson: function () {
    return {
      product: this.options.item.product,
      price: this.options.item.price,
      quantity: this._sanitizeQuantityValue(),
      cost: this.getCost()
    };
  }

});
