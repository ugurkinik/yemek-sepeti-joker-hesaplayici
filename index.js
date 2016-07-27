function parsePrice(text) {
	text = text+"";
	return parseFloat(text.split(' ')[0].replace(',','.'));
}

function priceToString(price) {
	price = price.toFixed(2) + " TL";
	return price.replace(".", ",");
}

// oran hesapla
var fullPrice = parsePrice( $('.ys-basket .ys-overline')[0].innerHTML );
var price = parsePrice( $('.ys-basket .total')[1].innerHTML );
var ratio = price/fullPrice;

// yeni fiyatları yaz
$(".tdOrderPrice").each(function() {
	var result = parsePrice($(this)[0].innerHTML) * ratio;
	
	if(!isNaN(result)) {
		var oldDiv = '<div style="text-decoration:line-through">'+ $(this)[0].innerHTML +'</div>'
		$(this).html(oldDiv +'<div style="color:#391">'+priceToString(result)+'</div>');
	}
});

// yuvarlama
var roundOptions = ["Küsüratlı bırak"];
function round() {
	var option = $(this).val();

	switch(option) {
		default:
			// do nothing
	}
}

var comboBox = $('<select />').css("float", "right");
comboBox.change(round);
for(var i=0; i < roundOptions.length; i++) {
	comboBox.append($('<option />', {text: roundOptions[i], value: i}));
}
$('.ys-basket h3').append(comboBox);

