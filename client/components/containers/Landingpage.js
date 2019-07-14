import React, { Component } from 'react';
import { RequestManager } from '../helpers/';
import { Link } from 'react-router-dom';
import CSVReader from 'react-csv-reader';
import { Error, Success } from '../presentation/';
import Picker from 'react-month-picker'
import { CSVLink, CSVDownload } from 'react-csv';

class Landingpage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			object: '',
			consignments: '',
			//prices for invoices within a certain period
			prices: '',
			finalRevenues: [],
			consignmentObjects: [],
			consignmentData: [],
			convertSuccess: '',
			generateSuccess: '',
			error: '',
			mvalue: {year: new Date().getUTCFullYear(), month: new Date().getMonth() + 1},
			startDate: '',
			endDate: '',
			csvTitle: ['Invoice period', 'Invoice date', 'Production Company','Job Name', 'Item Name & Quantity','Location', 'Invoice Number', 'Total', 'Your Total', 'Habibi Total'],
			csvs: '',
			setup: ''
		};
	}

	componentDidMount() {
		RequestManager.getConsignments()
			.then((res) => {
				this.setState({
					consignmentData: res.data.list_name.list_values,
					setup: 'Pulled information from database'
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	stringNumSplit(string) {
		let placement;
		let number = '';
		let company;
		let flag = false;
		for(let i=0; i< string.length; i++) {
			if(parseInt(string[i]) >=0 || string[i] === '.') {
				if(flag === false) {
					flag = true;
					placement = i;
				}
				number +=string[i];
			}
		}
		company = string.slice(0,placement-1);
		return {
			company,
			number
		}
	}

	setupInvoices(year, month) {
		for(let i =0; i < this.state.consignments.length; i++) {
			let elem = this.state.consignments[i];
		}
		let pricesToAdd = {};
		RequestManager.getInvoices(year, month)
			.then((res) => {
				let invoices = res.data.invoices;
				if(invoices.length === 0) {
					this.setState({
						error: 'No reports found for the month selected'
					});
				}
				else {
					for(let p = 0; p < invoices.length; p++) {
						//to make sure this does not include voided status
						if(invoices[p].status_name !== 'Voided') {
							let items = invoices[p].invoice_items;
							let subject = invoices[p].subject;
							let location = invoices[p].destination.address.city;
							for(let k=0; k < items.length; k++) {
								let obj = {};
								if(items[k].charge_total > 0) {
									if(items[k].invoice_item_type_name !== 'Group') {
										if(items[k].invoiceable && items[k].invoiceable.item_id !== null)
											obj.invoiceable_id = items[k].invoiceable.item_id;
										else
											obj.invoiceable_id = items[k].invoiceable_id;
										obj.charge_total = items[k].charge_total;
										obj.id = items[k].id;
										obj.name = items[k].name;
										obj.invoice_id = items[k].invoice_id;
										obj.id = items[k].id;
										obj.invoiceable_name = items[k].invoiceable_name + ' (' + items[k].quantity + ')';
										obj.charge_starts_at = items[k].charge_starts_at;
										obj.charge_ends_at = items[k].charge_ends_at;
										obj.location = location;
										obj.invoice_date = items[k].created_at;
										obj.subject = subject;
										pricesToAdd[items[k].id] = obj;										 
									}
								}
							}
						}
					}
					this.setState({
						prices: pricesToAdd,
						setup: ''
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async pullConsignmentInformation() {
		if(this.state.prices) {
			let prices = this.state.prices;
			let keys = Object.keys(this.state.prices);
			let consignments =[];
			for(let i =0; i< keys.length; i++) {
				let obj = {};
				try {
					let res = await RequestManager.getSpecificConsignments(this.state.prices[keys[i]].invoiceable_id);
					let consignmentList = res.data.stock_levels;
					if(consignmentList.length > 0) {
						for(let p=0; p<consignmentList.length; p++) {
							if(consignmentList[p].custom_fields.consignment_allocation_asset){
								prices[keys[i]].consignment_allocation_asset = consignmentList[p].custom_fields.consignment_allocation_asset;
								break;
							}
						}
					} else {
						console.log(this.state.prices[keys[i]]);
						console.log(res.data);
						console.log('hit2');
						//prices[keys[i]].consignment_allocation_asset = [1000021];
					}
					await setTimeout(() => {

					}, 350);
				} catch (err) {
					console.log(err);
				}
			}

			this.setState({
				convertSuccess: 'Pulled consignment information',
				error: '',
				generateSuccess: '',
				setup: ''
			});
		} else {
			this.setState({
				error: 'Please select a month before reading data'
			});
		}
	}

	generateConsignmentReport() {
		let prices = this.state.prices;
		let finalRevenues = {};
		let parts = Object.keys(prices);
		let consignmentData = this.state.consignmentData;

		for(let i=0; i< parts.length; i++) {
			if(!prices[parts[i]].consignment_allocation_asset)
				console.log(prices[parts[i]].name);
		}

		// for(let i =0; i< parts.length; i++) {
		// 	let lines = [];
		// 	let consignment_assets = prices[parts[i]].consignment_allocation_asset;
		// 	for(let p =0; p< consignment_assets.length; p++) {
		// 		let tempObj;
		// 		for(let k=0; k<consignmentData.length; k++) {
		// 			if(consignmentData[k].id === consignment_assets[p]) {
		// 				let data = this.stringNumSplit(consignmentData[k].name);
		// 				//format should be: id, companyName, percentage
		// 				let smallerLine = [];
		// 				//if its a purchase, the part will not have charge_starts_at value filled in
		// 				//invoice, invoiceDate, production, location, invoiceId, total, split
		// 				if(prices[parts[i]].charge_starts_at) {
		// 					smallerLine.push(prices[parts[i]].charge_starts_at.slice(0,10) + ' to ' + prices[parts[i]].charge_ends_at.slice(0,10));
		// 				} else {
		// 					smallerLine.push('Purchased at ' + prices[parts[i]].invoice_date.slice(0,10));
		// 				}
		// 				smallerLine.push(prices[parts[i]].invoice_date.slice(0, 10));
		// 				smallerLine.push(data.company);
		// 				smallerLine.push(prices[parts[i]].subject);
		// 				smallerLine.push(prices[parts[i]].invoiceable_name);
		// 				smallerLine.push(prices[parts[i]].location);
		// 				smallerLine.push(prices[parts[i]].invoice_id);
		// 				smallerLine.push(parseFloat(prices[parts[i]].charge_total));
		// 				smallerLine.push(prices[parts[i]].charge_total * data.number/100);
		// 				smallerLine.push(prices[parts[i]].charge_total - prices[parts[i]].charge_total * data.number/100);
		// 				smallerLine.push(data.company);
		// 				let innerObj = {};

		// 				if(finalRevenues[data.company]) {
		// 					innerObj = finalRevenues[data.company];
		// 				}
		// 				innerObj[prices[parts[i]].subject + '-' + prices[parts[i]].id] = smallerLine;
		// 				finalRevenues[data.company] = innerObj;
		// 				lines.push(smallerLine);
		// 			}
		// 		}
		// 	}
		// }

		// let keys = Object.keys(finalRevenues);
		// let csvs = [];


		// for(let i=0; i< keys.length; i++) {
		// 	let companyValues = Object.values(finalRevenues[keys[i]]);
		// 	//will include subtotals and spaces
		// 	let newValues = [];
		// 	let subTotal = 0;
		// 	for(let p = 0; p < companyValues.length; p++) {
		// 		if(p < companyValues.length -1 && companyValues[p][3] !== companyValues[p+1][3]) {
		// 			subTotal += companyValues[p][8];
		// 			newValues.push(companyValues[p]);
		// 			newValues.push(['', '', '', '','', '','', 'Invoice Total:', subTotal, ''])
		// 			newValues.push(['', '', '', '','', '','']);
		// 			//reset subTotal
		// 			subTotal = 0;
		// 		} else if(p < companyValues.length -1 && companyValues[p][3] === companyValues[p+1][3]) {
		// 			subTotal += companyValues[p][8];
		// 			newValues.push(companyValues[p]);
		// 		} else if(p === companyValues.length -1) {
		// 			subTotal += companyValues[p][8];
		// 			newValues.push(companyValues[p]);
		// 			newValues.push(['', '', '', '','', '','', 'Invoice Total:', subTotal, ''])
		// 			newValues.push(['', '', '', '','', '','']);
		// 		}
		// 	}
		// 	let aLine = [this.state.csvTitle, ...newValues];
		// 	csvs.push(aLine);
		// }

		// //calculating overall total
		// for(let p =0; p<csvs.length; p++) {
		// 	let total = 0;
		// 	let split = 0;
		// 	let subTotal = 0;
		// 	for(let k=0; k< csvs[p].length; k++) {
		// 		if(csvs[p][k].length === 11) {
		// 			csvs[p][k].pop();
		// 			total += csvs[p][k][7];
		// 			split += csvs[p][k][8];
		// 		}
		// 	}
		// 	csvs[p].push(['', '', '', '','', '','', 'total: ' +total, 'split: ' + split, 'Habibi Total: ' + (total - split)]);
		// }

		this.setState({
			finalRevenues,
			generateSuccess: 'generated consignment report!',
			error: '',
			convertSuccess: '',
			csvs
		});
	}

	onCsvLoad(e) {
		this.setState({
			consignments: e
		});
	}

	onError(e) {
		this.setState({
			error: e
		});
	}

	//used for Picker import
	handleClickMonthBox(e) {
		this.refs.pickAMonth.show()
	}

	handleAMonthChange(year, month) {
		//when selecting the month; it will set the end time to be midnight of the next month
		let startDate = new Date(year + '/' + month).getTime();
		let endDate = new Date(year + '/' + (month + 1)).getTime();

		this.setupInvoices(year, month);
		let mvalue = {
			month,
			year
		};
		this.setState({
			startDate,
			endDate,
			error: '',
			mvalue
		});
	}

	handleAMonthDismiss(value) {
		this.setState({
			mvalue: value
		});
	}

	render() {
		let pickerLang = {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            , from: 'From', to: 'To'
        }
        , mvalue = {year: new Date().getUTCFullYear(), month: new Date().getMonth() + 1}
        , mrange = {from: {year: 2017, month: 1}, to: {year: 2021, month: 12}};

    let makeText = m => {
        if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
        return '?'
    }
		return(
			<div className='container landing-form'>
				<h1 style={{textAlign: 'center'}}>Habibi Consignment report generator</h1>
				<div className="login-form">
					<label><b>Pick A Month</b><span>(Available years: 2017-2021)</span></label>
					{
						this.state.setup ?
							<Success message={this.state.setup} />
						:	null
					}
					{
						this.state.error ?
							<Error message={this.state.error} />
						:	null
					}
					<div className="edit">
						<Picker
							ref="pickAMonth"
							years={[2017, 2018, 2019, 2020, 2021]}
							value={this.state.mvalue}
							lang={pickerLang.months}
							onChange={(e, text) => this.handleAMonthChange(e, text)}
							onDismiss={(e) => this.handleAMonthDismiss(e)}>
							<div className="box" onClick={(e)=>this.handleClickMonthBox(e)}>
								<label>{makeText(this.state.mvalue)}</label>
							</div>
						</Picker>
					</div>
					{
						this.state.prices ? 
							<button className="btn" onClick={(e)=>this.pullConsignmentInformation()}>Get Consignment info</button>
						:	<button className="btn" disabled={true} onClick={(e)=>this.pullConsignmentInformation()}>Get Consignment info</button>
					}
					{
						this.state.convertSuccess ?
							<Success message={this.state.convertSuccess}/>
						:	null
					}
					<button className="btn btn-last" onClick={(e) => this.generateConsignmentReport()}>Consignment Report</button>
					{
						this.state.generateSuccess ?
							<Success message={this.state.generateSuccess}/>
						:	null
					}
					{
						this.state.csvs.length > 0 ?
							<div className="report-container" style={{display: 'flex', flexDirection: 'column'}}>
								{
									this.state.csvs.map((csv, index) => {
										let startTime = new Date(this.state.mvalue.year + '-' + this.state.mvalue.month).toDateString();
										let endTime = new Date(this.state.mvalue.year + '-' + this.state.mvalue.month + '-' + new Date(this.state.mvalue.year, this.state.mvalue.month, 0).getDate()).toDateString();
										let TitleLine = 'HABIBI SERVICES INC. Income Statement ' + startTime + ' to ' + endTime;
										return <CSVLink className="btn" key={index} filename={TitleLine + ' - ' + csv[1][2] + '.csv'} data={csv}>{csv[1][2]}</CSVLink>;
									})
								}
							</div>
						:	null
					}
				</div>
			</div>
		);
	}
}

export default Landingpage;