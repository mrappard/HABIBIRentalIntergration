import { request } from 'graphql-request';
import axios from 'axios';
import config from '../../../config';

const server_url = "http://localhost:3000/graphql";

const apikey = config.apikey;
const subdomain = 'habibi';
const apiUrl ='https://api.current-rms.com/api/v1/';

exports.getInvoices = function(year, month) {
    let aPromise = new Promise((resolve, reject) => {
        axios.get(apiUrl + '/invoices?apikey=' + apikey + '&subdomain=' + subdomain + '&filtermode=inactive&include[]=invoice_items&include[]=destination&per_page=100&q[invoiced_at_gt]=' + year + '-' + month + '-01&q[invoiced_at_lteq]=' + year + '-' + month + '-' + new Date(year, month, 0).getDate())
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
        axios.get(apiUrl + '/products/' + id + '/stock_levels?apikey=' + apikey + '&subdomain=' + subdomain)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
    return aPromise;
}