var request = require('request');
var cheerio = require('cheerio');
var accounting = require('accounting');
var fs = require('fs');
var path = require('path');

var exec = require('child_process').exec;

var submarino_url = "http://www.submarino.com.br/produto/";
var product_id = 128479090;

var product_url = submarino_url + product_id;

var interval = 5 * 1000;

var old, product;

(function check() {
    var now = new Date();

    request(product_url, function (err, res, body) {
        if (!err) {
            var $ = cheerio.load(body);

            var title = $('.product-name').text();
            var venda = $('.sales-price').text();
            var boleto = $('.payment-option.boleto span').first().text();
            var cartao = $('.payment-option.cartao-credito span').first().text();
            var ccsub = $('.payment-option.cartao-marca span').first().text();

            old = product;

            product = {
                id: product_id,
                title: title,
                price: {
                    venda: accounting.parse(venda, ','),
                    boleto: accounting.parse(boleto, ','),
                    cartao: accounting.parse(cartao, ','),
                    ccsub: accounting.parse(ccsub, ',')
                }
            };

            old = old ? old : product;

            if (product.price.boleto < old.price.boleto ||
                product.price.cartao < old.price.cartao ||
                product.price.ccsub < old.price.ccsub ) {
                    old = undefined;
                alert(true);
            }

            console.log(product)

        } else {
            console.log(err)
        }

    })

    setTimeout(check, interval)

} ())

function alert(important) {
    exec("afplay " + path.dirname(require.main.filename) + "/chime.mp3");

    setTimeout(alert, 1000);
}