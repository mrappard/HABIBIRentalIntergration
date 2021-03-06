import { request } from 'graphql-request';
import axios from 'axios';
import config from '../../../config';

const server_url = "http://localhost:3000/graphql";

const apikey = config.apikey;
const subdomain = 'habibi';
const apiUrl ='https://api.current-rms.com/api/v1';

exports.getInvoices = function(year, month) {
    let aPromise = new Promise((resolve, reject) => {
        axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
        console.log(apiUrl + '/invoices?apikey=' + apikey + '&subdomain=' + subdomain + '&filtermode=inactive&include[]=invoice_items&include[]=destination&per_page=500&q[invoiced_at_gt]=' + year + '-' + month + '-01&q[invoiced_at_lteq]=' + year + '-' + month +'-31');
        axios.get(apiUrl + '/invoices?apikey=' + apikey + '&subdomain=' + subdomain + '&filtermode=inactive&include[]=invoice_items&include[]=destination&per_page=500&q[invoiced_at_gt]=' + year + '-' + month + '-01&q[invoiced_at_lteq]=' + year + '-' + month +'-31')
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
    return aPromise;
}


exports.getOpportunity = function(opportunityId) {
    let aPromise = new Promise((resolve, reject) => {
        axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
        axios.get(apiUrl + '/opportunities/'+opportunityId+'?apikey=' + apikey + '&subdomain=' + subdomain + '&include[]=item_assets')
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
    return aPromise;
}

exports.getConsignments = function() {
    let aPromise = new Promise((resolve, reject) => {
        axios.get(apiUrl + '/list_names/1000001?apikey=' + apikey + '&subdomain=' + subdomain)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
    return aPromise;
}

exports.getSpecificConsignments = function(id) {
    let aPromise = new Promise((resolve, reject) => {
        axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
        axios.get(apiUrl + '/products/' + id + '/stock_levels?apikey=' + apikey + '&per_page=100&subdomain=' + subdomain)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
    return aPromise;
}