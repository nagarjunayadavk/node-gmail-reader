// Author = Nagarjuna Yadav K.
// Mail = nagarjunayadavk@gmail.com.

var Imap = require('imap');
var fs = require('fs');
var buffer = '';
var order_details = [];

function openInbox(cb) {
    // imap.openBox('Boxbe Waiting List', true, cb);
    imap.openBox('INBOX', true, cb);
}
// read mail function..
exports.readEmail =function(imap){
    imap.once('ready', function() {
        openInbox(function(err, box) {
            if (err) throw err;
            imap.search(['ALL', ["FROM", 'auto-confirm@amazon.in']], function(err, results) {
                if (err) throw err;
                console.log(results.length);
                var f = imap.fetch(results, { bodies: '1', markSeen: true });
    
                f.on('message', function(msg, seqno) {
                    console.log('Message #%d' + seqno);
                    var prefix = '(#' + seqno + ') ';
                    msg.on('body', function(stream, info) {
    
                        stream.on('data', function(chunk) {
                            buffer = chunk.toString('utf8');
                            var order_num = buffer.match(/#[0-9]{3}-[0-9]{7}-[0-9]{7}/g);
                            var order_date = buffer.match(/Placed on \w+, \w+ \d+, \d+/g);
                            // console.log(buffer , order_num);
                            if (order_num !== null) {
                                var newObj = {
                                    'order_num': order_num !== null ? order_num[0] : null,
                                    'order_date': order_date !== null ? order_date[0] : null
                                }
                                let findOrderInOrderDeatils = order_details.filter(obj => obj.order_num === newObj.order_num);
                                if (findOrderInOrderDeatils.length === 0) {
                                  //==== If new record push to order details
                                  order_details.push(newObj);
                                }else{//==== If old record update order details
                                  order_details.splice(order_details.indexOf(findOrderInOrderDeatils[0]),1)
                                  order_details.push(newObj);
                                }
                            }
                        });
    
                        stream.once('end', function() {
                            if (info.which === '1') {
                                // console.log("BUFFER" + buffer)
                            }
                        });
                        stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                    });
                    msg.once('attributes', function(attrs) {
                        // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    });
                    msg.once('end', function() {
                        // console.log(prefix + 'Finished');
                    });
                });
                f.once('error', function(err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function() {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', function(err) {
        console.log(err);
    });
    
    imap.once('end', function() {
        console.log('Connection ended');
        console.log(order_details);
    });
}

exports.imapIntialize = function(mail,password){
    return new Imap({
        user: mail.toString(), //'xxxxxx@gmail.com'
        password: password.toString(),//'xxxxxx'
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });
    
}
exports.mailConnect = function(mail,password){
    console.log(mail, password)
    imap = module.exports.imapIntialize(mail,password);
    module.exports.readEmail(imap);
    console.log("mailConnect");
    imap.connect();
    // return order_details;
}
