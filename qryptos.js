const ccxt = require('ccxt');
var volThreshold = 3;
var btc24VolThreshold = 0.01;
var mult = 64;
var startBtc = 0.01063821;
var orders3 = [];
var orders4 = [];
var btc = 0
var feesHr = 0;

var feesMoreHr = 0;
var tracker = []
var hrCount = 0;
var moreHrCount = 0;
var math = require("mathjs");
const express = require('express');
var favicon = require('serve-favicon')
var path = require('path')
 
var app = express()
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

var dorefresh = false;
var request = require("request")
var bodyParser = require('body-parser')

app.use(bodyParser.json()); // to support JSON-encoded bodies
var sList = []
var gobuy = [];
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
var percent
var diff2
var minutes
var hours
var percentHr
var startDate = new Date('2018/06/27 18:22')
//console.log(startDate.getTime());
//console.log(new Date().getTime());
//var MongoClient = require('mongodb').MongoClient;
var ips = []
function doget(req, res){
	if (dorefresh){
		var tot = 0;
		var whiches = []
		for (var i in tracker){
			whiches.push(tracker[i].pair);
			tot+=tracker[i].total;
		}
		var buytot = 0;
		for (var i in tracker){
			buytot+=tracker[i].buys;
		}
		var selltot = 0;
		for (var i in tracker){
			selltot+=tracker[i].sells;
		}
		console.log((tracker));
                res.send('<head> <link rel="icon" href="https://qryptosfeemonster.herokuapp.com/favicon.ico?v=2" /><meta http-equiv="refresh" content="25"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script></head><h1>Don\'t Panic! If the data seems off, wait a minute or so.</h1><br>btc: ' + btc + '<br>minutes: ' + minutes + '<br>hours: ' + hours
				+ '<br>percent: ' + percent + '%'
				+ '<br>trades last hr: ' + hrCount 
				+ '<br>trades last 24hr: ' + moreHrCount 
				+ '<br>avg. trades/hr last 24hr: ' + (moreHrCount / 24).toFixed(2)
				+ '<br><br>fees last hr (sats): ' + math.format(feesHr,{exponential:{lower:1e-100,upper:1e100}})
				+ '<br>fees last 24hr (sats): ' + math.format(feesMoreHr ,{exponential:{lower:1e-100,upper:1e100}})
				+ '<br>avg. fees/hr last 24hr (sats): ' + math.format((feesMoreHr / 24),{exponential:{lower:1e-100,upper:1e100}})
				+ '<br>Pairs: ' + (whiches).toString()
				
				+ '<h1>percent/24hr: ' + (percentHr * 24).toFixed(4) + '%</h1>'
				+ '<h1>percent/hr: ' + percentHr + '%</h1>'
				+ '<br>bought(6 hrs) according to trackerdata in btc: ' + buytot 
				+ '<br>sold (6 hrs) according to trackerdatat in btc: ' + selltot
				+ '<br>total (6 hrs) according to trackerdata (who seems to be off) (sats): ' + tot * Math.pow(10,8)
				+ '<br>trackerdata (6 hrs):<br><div style="display:none;" id="orders">' + JSON.stringify(orders3) + '</div>'
				+ '<div style="display:none;" id="tracker">' + JSON.stringify((tracker)) + '</div><div id="trackerdata"></div>current, open orders: '
				+ '<div style="display:none;" id="orders4">' + JSON.stringify(orders4) + '</div><div id="showData"></div><br><br>filled orders: <br><div id="showData2"></div><script>for(var col=[],i=0;i<JSON.parse($("#tracker").text()).length;i++)for(var key in JSON.parse($("#tracker").text())[i])-1===col.indexOf(key)&&col.push(key);var table3=document.createElement("table"),tr=table3.insertRow(-1);for(i=0;i<col.length;i++){var th=document.createElement("th");th.innerHTML=col[i],tr.appendChild(th)}for(i=0;i<JSON.parse($("#tracker").text()).length;i++){tr=table3.insertRow(-1);for(var j=0;j<col.length;j++){var tabCell=tr.insertCell(-1);tabCell.innerHTML=JSON.parse($("#tracker").text())[i][col[j]]}}var divContainer3 = document.getElementById("trackerdata");divContainer3.innerHTML = "", divContainer3.appendChild(table3); console.log(table3); for(var col=[],i=0;i<JSON.parse($("#orders").text()).length;i++)for(var key in JSON.parse($("#orders").text())[i])-1===col.indexOf(key)&&col.push(key);var table=document.createElement("table"),tr=table.insertRow(-1);for(i=0;i<col.length;i++){var th=document.createElement("th");th.innerHTML=col[i],tr.appendChild(th)}for(i=0;i<JSON.parse($("#orders").text()).length;i++){tr=table.insertRow(-1);for(var j=0;j<col.length;j++){var tabCell=tr.insertCell(-1);tabCell.innerHTML=JSON.parse($("#orders").text())[i][col[j]]}}var divContainer=document.getElementById("showData");divContainer.innerHTML="",divContainer.appendChild(table);for(var col=[],i=0;i<JSON.parse($("#orders4").text()).length;i++)for(var key in JSON.parse($("#orders4").text())[i])-1===col.indexOf(key)&&col.push(key);var table2=document.createElement("table"),tr=table2.insertRow(-1);for(i=0;i<col.length;i++){var th=document.createElement("th");th.innerHTML=col[i],tr.appendChild(th)}for(i=0;i<JSON.parse($("#orders4").text()).length;i++){tr=table2.insertRow(-1);for(var j=0;j<col.length;j++){var tabCell=tr.insertCell(-1);tabCell.innerHTML=JSON.parse($("#orders4").text())[i][col[j]]}}var divContainer2=document.getElementById("showData2");divContainer2.innerHTML="",divContainer2.appendChild(table2);</script>');
    }
	else {
		setTimeout(function(){
			doget(req, res);
		}, 2000);
	}
}
app.get('/', function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if (!ips.includes(ip)){
		
		ips.push(ip);
	console.log('New ip hit: ' + ips);
	}
	doget(req, res);
});

            app.listen(process.env.PORT || 8080, function() {});
async function doOrders(lp, side, op, precision, price, qryptos, balance, btcfree, callback) {
    try {
        //////console.log('bal');
        //////console.log(balance * .5);
        //////console.log(side);
        ////console.log('lp.minimum');
        ////console.log(lp.minimum)
        if (side == 'buy') {
			if ((balance / 12.05).toFixed(8) > lp.minimum){ //12.01
				balance = balance / 12.05;
			//	//console.log(balance);
			//	//console.log(lp.pair);
			} 
			else if ((balance / 8.05).toFixed(8) > lp.minimum){ //12.01
				balance = balance / 8.05;
			//	//console.log(balance);
			//	//console.log(lp.pair);
			} else if ((balance / 4.05).toFixed(8) > lp.minimum){ //12.01
				balance = balance /4.05;
			//	//console.log(balance);
			//	//console.log(lp.pair);
			}
			else if ((balance / 2.05).toFixed(8) > lp.minimum){
            balance =  lp.minimum ; //12.01
			}
			else {
				balance = btcfree / price * .995;
			}
            order = (await qryptos.createOrder(lp.pair, 'limit', side, balance, (price).toFixed(precision)))
        } else {
           order = (await qryptos.createOrder(lp.pair, 'limit', side, balance, (price).toFixed(precision)))

        }
        ////////console.log(order);
        /*
        if (order.id) {
            collectiondbo.insertOne({
                'order': order,
                'id': order.id,
                'price': price,
                'internalStatus': side
            }, function(err, res) {
                if (err) {
					console.log(err);
				}
                ////console.log('res2')
                ////console.log(res.result);
            });
        }*/
        ////////console.log(order);
        callback(order);

    } catch (err) {
        console.error('error', err)
        //db.close();
    }
}
async function cancelcancel(qryptos, id, callback) {
    try {
        let order = await qryptos.cancelOrder(id);
        callback(order);

    } catch (err) {
        console.error('error', err)
    }
}
async function cancel(op, o, qryptos, callback) {
    try {
        //////console.log('---');
        //////console.log('---');
        //////console.log(op[o].id);
        //////console.log('---');
        //////console.log('---');
        /*
		collectiondbo.update({
                "id": op[o].id
            }, {
                "$set": {
                    "internalStatus": 'cancelled'
                }
            }, {
                multi: true
            },
           function(err, result) {
			   if (err){
				   console.log(err);
			   }
                ////console.log('res3');
               // ////console.log(result.result);
			   */
        let order = cancelcancel(qryptos, op.id, function(order) {
            //	////console.log(order);
            //  });


            callback(order);
        });
    } catch (err) {
        //console.log('138000');
		heroku();
        console.error('error', err)
    }
}
function heroku(){
	var token = process.env.HEROKU_API_TOKEN;
	var appName = "qryptosfeemonster";
	request.delete(
    {
        url: 'https://api.heroku.com/apps/' + appName + '/dynos/',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.heroku+json; version=3',
            'Authorization': 'Bearer ' + token
        }
    },
    function(error, response, body) {
        request.post(
    {
        url: 'https://api.heroku.com/apps/' + appName + '/dynos/',
		
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.heroku+json; version=3',
            'Authorization': 'Bearer ' + token
        }
    });
    }
);
}
			function sortFunction(a,b){  
				var dateA = new Date(a.datetime).getTime();
				var dateB = new Date(b.datetime).getTime();
				return dateA < dateB ? 1 : -1;  
			}; 
async function dodatthing(qryptos, lpairs, pairs, balances) {
    try {
		var index = 0;
		
        for (var p in pairs) {
            //////console.log(pairs[p].pair);
            if (pairs[p].pair == "ETH/BTC" || pairs[p].pair == "FLIXX/BTC" ||pairs[p].pair == "STX/BTC" ||pairs[p].pair == "TPAY/BTC" ||pairs[p].pair == "IPSX/BTC" ||pairs[p].pair == "BCH/BTC" || pairs[p].pair == "FSN/BTC" || pairs[p].pair == "NEO/BTC" || pairs[p].pair == "ENJ/BTC" || pairs[p].pair == "QTUM/BTC") { // only btc? //hardwire btc/eth
                //////console.log(balances[lp.which].free);//hardwire btc/eth
                //////console.log(balances.BTC.free);//hardwire btc/eth
                lpairs[index] = {}
                lpairs[index].which = pairs[p].which
				gobuy[pairs[p].pair] = true;
                lpairs[index].minimum = pairs[p].minimum
                lpairs[index].precision = pairs[p].precision
                lpairs[index].pair = (pairs[p].pair);
                lpairs[index].vol = pairs[p].info.volume_24h * pairs[p].info.last_traded_price;
                let ticker;
                try {
                    ticker = await qryptos.fetchTicker(pairs[p].pair)
                    ////////console.log('ticker data');
                    lpairs[index].ticker = {};
                    (lpairs[index].ticker.bid = ticker.bid);
                    (lpairs[index].ticker.ask = ticker.ask);
                    ////////console.log('%');
                    (lpairs[index].ticker.spread = 100 * (-1 * (1 - ticker.ask / ticker.bid)));

                } catch (err) {
                    //console.log('138000');
                    console.error('error', err)
		heroku();
                }

                let ob;
                try {
                    ob = await qryptos.fetchOrderBook(pairs[p].pair)
                    ////////console.log('ob data');
                    lpairs[index].ob = {}
                    lpairs[index].ob.bid = {}
                    lpairs[index].ob.ask = {}
                    lpairs[index].ob.bid2 = {}
                    lpairs[index].ob.ask2 = {}
                    var bVol = 0;
                    var aVol = 0;
                    for (var v in ob.asks) {
                        if (v != 0 && v <= volThreshold) {
                            aVol += ob.asks[v][1] * ob.asks[v][0]
                        }
                    }
                    for (var v in ob.bids) {
                        if (v != 0 && v <= volThreshold) {
                            bVol += ob.bids[v][1] * ob.bids[v][0]

                        }
                    }
                    lpairs[index].ob.bid.thresholdVol = bVol;

                    lpairs[index].ob.ask.thresholdVol = aVol;

                    lpairs[index].ob.bid.price = (ob.bids[0][0]);
                    lpairs[index].ob.ask.price = (ob.asks[0][0]);
                    lpairs[index].ob.bid2.price = (ob.bids[1][0]);
                    lpairs[index].ob.ask2.price = (ob.asks[1][0]);
                    ////////console.log('vol');
                    lpairs[index].ob.bid.vol = (ob.bids[0][1] * ob.bids[0][0]);
                    lpairs[index].ob.ask.vol = (ob.asks[0][1] * ob.asks[0][0]);
                    ////////console.log('%');
                    lpairs[index].ob.spread = 100 * (-1 * (1 - ob.asks[0][0] / ob.bids[0][0]));
                    //////console.log(lpairs[index].ob.spread);
                } catch (err) {
                    //console.log('138000');
                    console.error('error', err)
		heroku();
                }

                let trades;
                try {
                    trades = await qryptos.fetchTrades(pairs[p].pair)
                    var tVol = 0;
                    for (var t in trades) {
                        if (t != 0 && t <= volThreshold) {
                            tVol += trades[t].amount * trades[t].price;
                        }
                    }

                    ////////console.log('most recent trade');
                    lpairs[index].recentTrade = {}
                    lpairs[index].recentTrade.recentVol = tVol;
                    lpairs[index].recentTrade.side = (trades[trades.length - 1].side);
                    lpairs[index].recentTrade.timestamp = trades[trades.length - 1].timestamp;
                    lpairs[index].recentTrade.amount = trades[trades.length - 1].amount * trades[trades.length - 1].price;
                    lpairs[index].recentTrade.price = trades[trades.length - 1].price;
                    //////console.log(lpairs[index].recentTrade.price);
                    ////console.log(lpairs[index]);
                    ////////console.log('--');
                } catch (err) {
                    //console.log('138000');
                    console.error('error', err)
		heroku();
                }
                
                ////console.log(lpairs[p]);
				
            }
			index++;
        }
			godoxyz = true;
			var arr = []
			var done = false;
			while (done == false){
				var val = Math.floor(Math.random() * Object.keys(lpairs).length);
				
				if (!arr.includes(val)){
					arr.push(val);

				//	//console.log(val);
				}
				if (arr.length == Object.keys(lpairs).length){
					done = true;
				}
			}
			console.log(tracker);
			////console.log(arr);
			                let balances = await qryptos.fetchBalance();
				dorefresh = false;
				btc = 0;
					orders3 = []
					tracker = []
					orders4 = []
					feesHr = 0;
					feesMoreHr = 0;
					hrCount = 0;
					moreHrCount = 0;
					var orders5 = [];
					var oCount = 0;
			var counts = []
			sList = []
			for (var p in arr){
				tracker.push({'pair': lpairs[p].pair, 'fees': 0, 'buys': 0, 'sells': 0, 'bidask': 0, 'total' : 0});

			}
			console.log(tracker);
			for (var p in arr){
				let orders;
                try {
				
					orders = await qryptos.fetchOrders( lpairs[p].pair, 0, 100000);
                   
					for (var i in orders) {
						if (orders[i].symbol == "ETH/BTC"){
							//console.log(orders[i].amount);
						//	console.log((orders[i].amount * orders[i].price));
						}
						for (var abc in tracker){
							var diff3 = Math.abs(new Date() - new Date(orders[i].timestamp));
						hours = ((diff3/1000)/60 / 60).toFixed(8);
						if (orders[i].symbol == tracker[abc].pair && hours <= 6){
						tracker[abc].fees += (-1 * orders[i].fee.cost);
						if (orders[i].side == 'buy'){
						tracker[abc].buys = tracker[abc].buys - (orders[i].amount * orders[i].price);  
						}
						else {
							tracker[abc].sells +=  (orders[i].amount * orders[i].price);  
						}
						
						tracker[abc].bidask = tracker[abc].sells+ tracker[abc].buys;
						tracker[abc].total = tracker[abc].bidask + tracker[abc].fees;
			//console.log(tracker[abc]);
						}
						}
					if (orders[i].status == 'closed'){
						
						
						orders5.push(orders[i]);
						
						//console.log(tracker);
						//console.log(math.format(orders[i].fee.cost,{exponential:{lower:1e-100,upper:1e100}}));


						var diff3 = Math.abs(new Date() - new Date(orders[i].timestamp));
						hours = ((diff3/1000)/60 / 60).toFixed(8);
						if (hours <= 1){
							feesHr +=(orders[i].fee.cost * Math.pow(10,8));
							hrCount++;
						}
						if (hours <= 24){
							feesMoreHr+=(orders[i].fee.cost * Math.pow(10,8));
							moreHrCount++;
						}
					}
					
					}
                    orders = await qryptos.fetchOrders(lpairs[p].pair, 0, 100000, {status: 'open'});
                    //////console.log(orders);
					for (var i in orders) {
						
					if (orders[i].status == 'open'){
						orders[i].fee = (orders[i].fee.cost * Math.pow(10,8))
						orders3.push(orders[i]);
					}
					
					if (orders[i].status == 'open' && orders[i].side == "sell") {
						//////console.log(orders2[i]);
						btc+=(orders[i].price * orders[i].amount);
					}
				}
				
                } catch (err) {
                    //console.log('138000');
                    console.log(err);
		heroku();
                }
                    
                doOrders2(pairs, lpairs[p], p, qryptos, balances, orders, pairs.length);
			}
			orders3.sort(sortFunction);
			orders5.sort(sortFunction);
			for (var i in orders5){
						counts[orders5[i].symbol] = 0;
			}
			for (var i in orders5){
				//console.log(orders5[i]);
				var diff3 = Math.abs(new Date() - new Date(orders5[i].timestamp));
				hours = ((diff3/1000)/60 / 60).toFixed(8);
				if (hours <= 1){
					counts[orders5[i].symbol]++;
				}
				if (counts[orders5[i].symbol] >= 3){
					if (!sList.includes(orders5[i].symbol)){
					sList.push(orders5[i].symbol);
					}
				}
				orders5[i].fee = (orders5[i].fee.cost * Math.pow(10,8))
				if (oCount <= 40){
				oCount++;
				orders4.push(orders5[i]);
				}
						
			}
			console.log(sList);
					////console.log('btc: ' +( balances.BTC.free + btc) );
					console.log('btc');
					console.log(balances.BTC);
					btc = (balances.BTC.free + btc).toFixed(8);
					percent =  (100 * (-1 * (1 - (btc / startBtc)))).toFixed(4);
					diff2 = Math.abs(new Date() - startDate);
					minutes = Math.floor((diff2/1000)/60);
					hours = ((diff2/1000)/60 / 60).toFixed(8);
					percentHr = (percent / hours).toFixed(4);
					dorefresh = true;
					//console.log('percent ' + percent + '%');
					////console.log('minutes ' + minutes);
					////console.log('hours ' + hours);
					//console.log('% / hr ' + percentHr + '%');

    } catch (err) {
        //console.log('138000');
        console.log(err);
		heroku();
    }
}
var godoxyz = true;
async function doxyz(qryptos) {
	for (var go in gobuy){
	gobuy[go] = true;
	}
	if (true){
    try {
		godoxyz = false;
        var pairs = [];
        let balances
        let response
        try {


            response = await qryptos.loadMarkets()
            for (var d in response) {
                // ////console.log(d);
                if ((response[d].info.volume_24h * response[d].info.last_traded_price) > btc24VolThreshold) {
				if (response[d].quote == "BTC"){
						console.log(response[d].symbol);
						console.log(response[d].info.volume_24h);
				}
                    if (response[d].quote == "BTC" && (response[d].base == "ETH" ||
                            response[d].base == "NEO" ||
                            response[d].base == "BCH" ||
                            response[d].base == "FSN" ||
                            response[d].base == "QTUM" ||
                            response[d].base == "ENJ" ||
                            response[d].base == "STX" ||
                            response[d].base == "TPAY" ||
                            response[d].base == "IPSX" ||
                            response[d].base == "FLIXX")) {
                        //////console.log(d);
                        //////console.log(response[d].info.volume_24h* response[d].info.last_traded_price);
                        //////////console.log(d);
                        // ////////console.log((response[d].info.volume_24h * response[d].info.last_traded_price));
                        var minimum;
                        var which;
                        if (response[d].base == "ETH") {
                            minimum = 0.01;
                            which = "ETH"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "NEO") {
                            minimum = 0.1;
                            which = "NEO"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "BCH") {
                            minimum = 0.01;
                            which = "BCH"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "FSN") {
                            minimum = 1;
                            which = "FSN"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "QTUM") {
                            minimum = 0.1;
                            which = "QTUM"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "ENJ") {
                            minimum = 100;
                            which = "ENJ"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "FLIXX") {
                            minimum = 90;
                            which = "FLIXX"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "TPAY") {
                            minimum = 1.5;
                            which = "TPAY"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "STX") {
                            minimum = 230;
                            which = "STX"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                        if (response[d].base == "IPSX") {
                            minimum = 1300;
                            which = "IPSX"
                            pairs.push({
                                'which': which,
                                'minimum': minimum,
                                'precision': response[d].precision.price,
                                'pair': d,
                                'quote': response[d]['quote'],
                                'base': response[d]['base'],
                                'info': response[d]['info']
                            })
                        }
                    }
                }
            }
            ////console.log('pairlength');
            ////console.log(pairs.length);
            var lpairs = []
            dodatthing(qryptos, lpairs, pairs, balances, 0);
            //hardwire btc/eth
        } catch (err) {
            //console.log('138000');
            console.error('error', err)
		heroku();
        }



        /*
	
    ////////console.log (qryptos.id,    await qryptos.fetchOrderBook (qryptos.symbols[0]))
    ////////console.log (qryptos.id,  await qryptos.fetchTicker ('BTC/USD'))
    ////////console.log (qryptos.id,     await qryptos.fetchTrades ('BTC/USD'))
 
    ////////console.log (qryptos.id, await qryptos.fetchBalance ())
	*/
        // sell 1 BTC/USD for market price, sell a bitcoin for dollars immediately
        //////////console.log (okcoinusd.id, await okcoinusd.createMarketSellOrder ('BTC/USD', 1))

        // buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
        //////////console.log (okcoinusd.id, await okcoinusd.createLimitBuyOrder ('BTC/USD', 1, 2500.00))

        // pass/redefine custom exchange-specific order params: type, amount, price or whatever
        // use a custom order type
        /// bitfinex.createLimitSellOrder ('BTC/USD', 1, 10, { 'type': 'trailing-stop' })

    } catch (err) {
        //console.log('138000');
        console.log(err);
		heroku();
    }
	}
}
(async function() {
    let qryptos = new ccxt.qryptos({
        apiKey: '616620',
        secret: process.env.apikey,
        timeout: 120000
    })
    //MongoClient.connect("mongodb://localhost/qryptos6", function(err) {
    //    var dbo = db.db('qryptos6')
    doxyz(qryptos);
	

    //});
})();

var xyz = 0;

function doOrders2(pairs, lp, p, qryptos, balances, orders2, total) {
    ////////console.log('doOrders');
    //////console.log(balances);
    try {
        ////console.log('length: ' + total);
        ////console.log(lp.pair);
        var orders = []
        orders[p] = []
        var goyaya = true;
        var goforit = true;
        var bought = 0;
        var sold = 0;
        ////////console.log(doc);
        for (var i in orders2) {
            if (orders2[i].status == 'open') {
                //////console.log(orders2[i]);
                orders[p][i] = orders2[i];
                if (orders2[i].side == "buy") {
                    bought++;
                }
                if (orders2[i].side == "sell") {
                    sold++;
                }
            }
        }
        try {
            if (goyaya == true) {
                goyaya = false;
                var bidrate = (1 + lp.ticker.spread / 100 / 3.15);
                var askrate = (1 - lp.ticker.spread / 100 / 3.15);
				for (var o in orders[p]) {
						var d = new Date();
						var d2 = new Date(orders[p][o].timestamp);
						var diff = Math.abs(d - d2);
						var minutes = Math.floor((diff/1000)/60)
						console.log('minutes: ' + minutes);
						if((minutes > 25)){
							////console.log('old sell order');
							 setTimeout(function() {
                                cancel(orders[p][o], o, qryptos, function(data) {

								});
							 },Math.random() * mult * pairs.length * 2 * 40);
						}
				}
				console.log(lp.pair);
				console.log(balances[lp.which].free);
				console.log('bidrate: ' + bidrate);
				console.log('askrate: ' + askrate);
				console.log('bid price: ' + lp.ob.bid.price * bidrate);
				console.log('ask price: ' + lp.ob.ask.price * askrate);
                if (true){//lp.recentTrade.price <= lp.ticker.ask && lp.recentTrade.price >= lp.ticker.bid) {
                    ////console.log('go!');
                    //createOrder (symbol, type, side, amount, price = undefined, params = {}) 
                    price = lp.ob.ask.price * askrate;

                    for (var o in orders[p]) {
						
                        //////console.log(orders[p][o][abc]);
                        //////console.log(orders[p][o].side);
                        //////console.log(orders[p][o].price);
                        //////console.log(lp.ob.ask.price);
						
								if (sList.includes(lp.pair)){
									  if (orders[p][o].side == 'sell' && orders[p][o].price != lp.ob.ask.price) {
                            ////console.log('cancelling sell');
                            setTimeout(function() {
                                cancel(orders[p][o], o, qryptos, function(data) {

                                   //console.log('selling 3');
                            ////console.log(lp.ob.ask.price * askrate);
                            try {
                                setTimeout(function() {
                                    doOrders(lp, 'sell', orders[p], lp.precision, lp.ob.ask.price *askrate, qryptos, balances[lp.which].free, balances['BTC'].free, function(data) {

                                        //////console.log(data);
                                    });
                                }, 200);
								
                            } catch (err) {
                                console.log(err);
                            }
                                });
                            }, Math.random() * mult * pairs.length * 2 * 40);
                        }
								}
                        if (orders[p][o].side == 'sell' && orders[p][o].price != lp.ob.ask.price) {
                            ////console.log('cancelling sell');
                            setTimeout(function() {
                                cancel(orders[p][o], o, qryptos, function(data) {

                                   //console.log('selling 3');
                            ////console.log(lp.ob.ask.price * askrate);
                            try {
                                setTimeout(function() {
                                    doOrders(lp, 'sell', orders[p], lp.precision, lp.ob.ask.price * askrate, qryptos, balances[lp.which].free, balances['BTC'].free, function(data) {

                                        //////console.log(data);
                                    });
                                }, 200);
								
                            } catch (err) {
                                console.log(err);
                            }
                                });
                            }, Math.random() * mult * pairs.length * 2 * 40);
                        }else { 
						////console.log('not cancelling sell'); 
						}
                    }
                    /*
                    							if (balances[lp.which].free > lp.minimum){//hardwire btc/eth
                    							////console.log(balances[lp.which].free);
                    							////console.log(balances[lp.which]);
                    							//console.log('selling 2');
                                                setTimeout(function() {
                                                    doOrders(lp, 'sell', orders[p],  lp.precision, price, qryptos, balances[lp.which].free,  function(data) {

                                                        ////console.log(data);
                                                    });
                                                }, Math.random() * mult * pairs.length * 2 * 40);
                    							
                                            }*/
                    price = lp.ob.bid.price * bidrate;
					
                    for (var o in orders[p]) {
                        ////console.log(orders[p][o]);
						
						
								if (sList.includes(lp.pair)){
									 if (orders[p][o].side == 'buy' && orders[p][o].price != lp.ob.bid2.price) {
                           // //console.log('cancelling buy');
                            setTimeout(function() {

                                cancel(orders[p][o], o, qryptos, function(data) {
//console.log('buying 3');
                            ////console.log(lp.ob.bid.price * bidrate);
                            try {
                                setTimeout(function() {
                                    doOrders(lp, 'buy', orders[p], lp.precision, lp.ob.bid2.price * bidrate* bidrate, qryptos, (balances.BTC.free / price).toFixed(8),  balances['BTC'].free,function(data) {

                                        //////console.log(data);
                                    });
                                }, Math.random() *  200);
                            } catch (err) {
                                console.log(err);
                            }
                                });
                            }, Math.random() * mult * pairs.length * 2 * 75);
                        } 
								}
								else if (orders[p][o].side == 'buy' && orders[p][o].price != lp.ob.bid.price) {
                           // //console.log('cancelling buy');
                            setTimeout(function() {

                                cancel(orders[p][o], o, qryptos, function(data) {
//console.log('buying 3');
                            ////console.log(lp.ob.bid.price * bidrate);
                            try {
                                setTimeout(function() {
                                    doOrders(lp, 'buy', orders[p], lp.precision, lp.ob.bid.price * bidrate, qryptos, (balances.BTC.free / price).toFixed(8), balances['BTC'].free, function(data) {

                                        //////console.log(data);
                                    });
                                }, Math.random() *  200);
                            } catch (err) {
                                console.log(err);
                            }
                                });
                            }, Math.random() * mult * pairs.length * 2 * 75);
                        } else {
                            if (orders[p][o].side == 'buy') {
                              //  //console.log('not cancel buy');
                                ////console.log(orders[p][o].price);
                                ////console.log(lp.ob.bid.price);
                            }
                        }
                    }
                    /*
							if (balances.BTC.free /  price > lp.minimum){ //hardwire btc/eth
							//console.log('buying 2');
                            setTimeout(function() {
                                doOrders(lp, 'buy', orders[p],  lp.precision, price, qryptos, balances.BTC.free / price, function(data) {

                                    ////console.log(data);
                                });
                            }, Math.random() * mult * pairs.length * 2 * 60);
							}
							*/
                    var price = lp.ob.ask.price * askrate;

                    if (sold == 0) {
                        ////console.log('no orders...');
                        //////console.log(balances[lp.which].free);
						
								if (sList.includes(lp.pair)){
									if (balances[lp.which].free >= lp.minimum) { //hardwire btc/eth
                            //console.log('selling 1');
                            ////console.log(lp.ob.ask.price * askrate);
                            try {
                                setTimeout(function() {
                                    doOrders(lp, 'sell', orders[p], lp.precision, lp.ob.ask.price *askrate, qryptos, balances[lp.which].free, balances['BTC'].free, function(data) {

                                        //////console.log(data);
                                    });
                                }, Math.random() * mult * pairs.length * 2 * 10);
                            } catch (err) {
                                console.log(err);
                            }
                        }
								}
								else {
                        if (balances[lp.which].free >= lp.minimum && sold == 0) { //hardwire btc/eth
                            //console.log('selling 1');
                            ////console.log(lp.ob.ask.price * askrate);
                            try {
                                setTimeout(function() {
                                    doOrders(lp, 'sell', orders[p], lp.precision, lp.ob.ask.price * askrate, qryptos, balances[lp.which].free, balances['BTC'].free, function(data) {

                                        //////console.log(data);
                                    });
                                }, Math.random() * mult * pairs.length * 2 * 10);
                            } catch (err) {
                                console.log(err);
                            }
                        }
								}
                    }
					console.log(gobuy[lp.pair]);
                    if (bought <= 0 && sold <= 1 && gobuy[lp.pair] == true) {
						console.log('buy!')
						gobuy[lp.pair] = false;
								if (sList.includes(lp.pair)){
									price = lp.ob.bid2.price * bidrate;
									if ((balances.BTC.free / price > lp.minimum && balances[lp.which].free <= lp.minimum)) { // && (balances[lp.which].free <= lp.minimum)){//hardwire btc/eth
									////console.log('buying 1');
									////console.log(lp.ob.bid.price * bidrate);
									try {
										setTimeout(function() {
											doOrders(lp, 'buy', orders[p], lp.precision, lp.ob.bid2.price * bidrate* bidrate, qryptos, (balances.BTC.free / price).toFixed(8),  balances['BTC'].free,function(data) {

												//////console.log(data);
											});
										}, Math.random() * mult * pairs.length * 2 * 20);
									} catch (err) {
										console.log(err);
									}
								}
								}
								else {
                        price = lp.ob.bid.price * bidrate;
                        if ((balances.BTC.free / price > lp.minimum && balances[lp.which].free <= lp.minimum && bought <= 0 && sold <= 1)) {

							// && (balances[lp.which].free <= lp.minimum)){//hardwire btc/eth
                            ////console.log('buying 1');
                            ////console.log(lp.ob.bid.price * bidrate);
                            try {
                                setTimeout(function() {
                                    doOrders(lp, 'buy', orders[p], lp.precision, lp.ob.bid.price * bidrate, qryptos, (balances.BTC.free / price).toFixed(8),  balances['BTC'].free,function(data) {

                                        //////console.log(data);
                                    });
                                }, Math.random() * mult * pairs.length * 2 * 20);
                            } catch (err) {
                                console.log(err);
                            }
                        }
						}
                    }
                } else {
                    ////console.log('recentTrade outside spread');
                    ////console.log(lp.recentTrade.price);
                    for (var o in orders[p]) {
                        if (orders[p][o].side == 'sell' && orders[p][o].price != lp.ob.ask.price) {
                           // //console.log('cancelling sell');
                            setTimeout(function() {
                                cancel(orders[p][o], o, qryptos, function(data) {

                                    //////console.log(data);
                                });
                            }, Math.random() * mult * pairs.length * 2 * 40);
                        }
                        if (orders[p][o].side == 'buy' && orders[p][o].price != lp.ob.bid.price) {
                          // //console.log('cancelling buy');
                            setTimeout(function() {
                                cancel(orders[p][o], o, qryptos, function(data) {

                                    //////console.log(data);
                                });
                            }, Math.random() * mult * pairs.length * 2 * 40);
                        }
                    }
                }
                if (lp.pair == "ETH/BTC") {
                   //	 //console.log('settimeout');
                    setTimeout(function() {
                        doxyz(qryptos)
                    }, 60000);
                }
            }
        } catch (err) {
            //console.log('138000');
			
            console.log(err);
		heroku();
        }

    } catch (err) {
        //console.log('138000');
        console.log(err);
		heroku();
    }
}
