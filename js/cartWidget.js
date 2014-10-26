/*jshint devel:true*/
/*global $*/
'use strict';

$.widget('AKQA.cartWidget', {
  options: {
    inputFile: 'data/cart.json',
    selectors: {
      items: '#items',
      subTotal: '#cart-totals #subtotal .amount span',
      vat: '#cart-totals #vat .amount span',
      total: '#cart-totals #total .amount span',
      form: '#cart-form',
      buttonBuy: '#buy-btn'
    }
  },

  _create: function () {
    var self = this;
    this.subTotalWrapper = this.element.find(this.options.selectors.subTotal);
    this.vatWrapper = this.element.find(this.options.selectors.vat);
    this.totalWrapper = this.element.find(this.options.selectors.total);
    this.itemsWrapper = this.element.find(this.options.selectors.items);
    this.buttonBuy = this.element.find(this.options.selectors.buttonBuy);
    this.buttonBuy.click(function (event) {
      self._displaySummary(event);
    });
    $.when(
      $.ajax(this.options.inputFile),
      $.ajax('template/item.html')
    ).then(function (inputFileResponse, templateResponse) {
      self.inputFile = inputFileResponse[0];
      self.itemTemplate = templateResponse[0];
      self._continueInit();
    });
    this.element.find(this.options.selectors.form).submit(function (event) {
      event.preventDefault();
    });
  },

  _continueInit: function () {
    for (var idx = 0; idx < this.inputFile.basket.length; idx++) {
      var item = this.inputFile.basket[idx];
      var itemWrapper = $(this.itemTemplate);
      itemWrapper.itemWidget({
        index: idx,
        item: item,
        cartWidget: this
      });
      this.itemsWrapper.append(itemWrapper);
    }
    this._updateTotals();
  },

  _handlePriceFloat: function (input) {
    return Math.round(input * 100) / 100;
  },

  _updateTotals: function () {
    var result = this._getSummary();
    this.subTotalWrapper.text(result.subTotal);
    this.vatWrapper.text(result.vat);
    this.totalWrapper.text(result.total);
    this.buttonBuy.prop('disabled', result.total === 0);
  },

  _getSummary: function () {
    var items = this.itemsWrapper.children();
    var result = {
      basket: [],
      subTotal: 0,
      vat: 0,
      total: 0
    };
    for (var idx = 0; idx < items.length; idx++) {
      var item = $(items[idx]);
      var itemResult = item.itemWidget('getJson');
      result.subTotal += itemResult.cost;
      result.basket.push(itemResult);
    }
    result.subTotal = this._handlePriceFloat(result.subTotal);
    result.vat = this._handlePriceFloat(result.subTotal * 0.2);
    result.total = this._handlePriceFloat(result.subTotal + result.vat);
    return result;
  },

  _displaySummary: function () {
    alert(JSON.stringify(this._getSummary(), null, 2));
  }
});
