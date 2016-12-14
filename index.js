const ROUND_STEP = 0.5;
var fullPrice, price, ratio;


function parsePrice(text) {
    text = text+"";
    return parseFloat(text.split(' ')[0].replace(',','.'));
}

function priceToString(price) {
    price = price.toFixed(2) + " TL";
    return price.replace(".", ",");
}

function getPrices() {
    var prices = [];
    var index = 0;

    $(".newPrice").each(function() {
        prices[index] = parsePrice($(this)[0].innerHTML);
        index++;
    });

    return prices;
}

function getCount() {
    var count = [];
    var index = 0;

    $(".tdOrderCount").each(function() {
        count[index] = $(this)[0].innerHTML;
        index++;
    });

    return count;
}

function writePrices(prices) {
    var index = 0;

    $(".newPrice").each(function() {
        $(this).html(priceToString(prices[index]));
        index++;
    });

    return prices;
}

function dropCoin(prices, count) {
    var response = {newPrices: [], residue: 0};
    var newTotal = 0;

    for(var i=0; i<prices.length; i++) {
        if(isNaN(prices[i]) || isNaN(count[i+1])) {
            response.newPrices[i] = NaN;
        } else {
            if(prices[i]%ROUND_STEP > ROUND_STEP/2) {
                response.newPrices[i] = prices[i] + (ROUND_STEP - prices[i]%ROUND_STEP);
            } else {
                response.newPrices[i] = prices[i] - prices[i]%ROUND_STEP;
            }

            newTotal += count[i+1] * response.newPrices[i];
        }
    }

    response.residue = price - newTotal;

    return response;
}

function isJoker() {
    if($(".checkout-info-joker").length)
        return true;
    else
        return false;
}

// oran hesapla
function run() {
    fullPrice = parsePrice( $('.ys-basket .ys-overline')[0].innerHTML );
    price = parsePrice( $('.ys-basket .total')[1].innerHTML );
    ratio = price/fullPrice;

    // yeni fiyatları yaz
    $(".tdOrderPrice").each(function() {
        var result = parsePrice($(this)[0].innerHTML) * ratio;
        
        if(!isNaN(result)) {
            var oldDiv = '<div class="oldPrice">'+ $(this)[0].innerHTML +'</div>'
            $(this).html(oldDiv +'<div class="newPrice">'+priceToString(result)+'</div>');
        }
    });

    var defaultPrices = getPrices();

    // yuvarlama
    var roundOptions = [
        "Küsuratlı bırak",
        "En ucuz ürünle dengele",
        "En pahalı ürünle dengele"
    ];
    function round() {
        var option = $(this).val();
        var prices = defaultPrices ? defaultPrices : getPrices();
        var count = getCount();

        switch(option) {
            case "1":
                var response = dropCoin(prices, count);
                prices = response.newPrices;
                var index = prices.indexOf(Math.min.apply(Math, prices));
                prices[index] += response.residue/count[index+1];
                break;
            case "2":
                var response = dropCoin(prices, count);
                prices = response.newPrices;
                var index = prices.indexOf(Math.max.apply(Math, prices));
                prices[index] += response.residue/count[index+1];
                break;
            default:
                // do nothing
        }
        writePrices(prices);
    }

    var comboBox = $('<select class="roundOptions" />');
    comboBox.change(round);
    for(var i=0; i < roundOptions.length; i++) {
        comboBox.append($('<option />', {text: roundOptions[i], value: i}));
    }

    $('.ys-basket h3').append(comboBox);

    var copyButton = $('<button class="copyButton">Kopyala</button>');
    copyButton.click(function() {
        copyContent();
    });
    $('.ys-basket h3 a').after(copyButton);
}

function copyContent() {
    var title = $('.ys-basket h3 a').html();
    var dash = title.replace(/./g, "-");
    var names = $(".tdOrderName b");
    var counts = $(".tdOrderCount");
    var prices = $(".newPrice");

    var content = "";
    content += title +"\n";
    content += dash +"\n";

    for(var i=0; i<names.length; i++) {
        var count = counts[i+1].innerText;
        if(count > 1) {
            content += "(x"+count+") ";
        }

        content += names[i].innerText +": "+ prices[i].innerText +"\n";
    }

    content += dash +"\n";
    
    var infoTds = $(".order-detail-table td");

    for(i=0; i<infoTds.length; i++) {
        if(infoTds[i].innerText == "Ödeme Şekli:") {
            content += infoTds[i+1].innerText;
        }
    }

    var temp = $("<textarea>");
    $("body").append(temp);
    temp.val(content).select();
    document.execCommand("copy");
    temp.remove();
}

// main
if(isJoker()) {
    run();
}