"use strict"

window.onbeforeunload = confirmExit;
function confirmExit()
{
	return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
}

var flipListTable = document.getElementById("flipListTable");
var flipListBody = document.getElementById("flipListBody");
var flipHashTable = {"Length": 0};
var uniqueItemNames = [];

function FormatNumber(number) {
	return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function UnFormatNumber(formattedNumber) {
	let unformattedNumber = formattedNumber.toString().replace("gp", "");
	return Number(unformattedNumber.replace(/,/g, ""));
}

function AddFlipListing(amount) {
	for (let i = 0; i < amount; i++) {
		let tr = document.createElement("tr");
		flipListBody.appendChild(tr);

		for (let x = 0; x < 7; x++) {
			let td = tr.insertCell(x);

			switch (x) {
				case 0:
					let input1 = document.createElement("input");
					input1.type = "text";
					input1.placeholder = "Item name";
					input1.onchange = function () { UpperCaseWords(this); UpdateFlipListing(this); };
					td.appendChild(input1);
					input1.select();
					break;
				case 1:
					let input2 = document.createElement("input");
					input2.type = "text";
					input2.oninput = function () { UpdateFlipListing(this); };
					input2.placeholder = "Buy price";
					td.appendChild(input2);
					break;
				case 2:
					let input3 = document.createElement("input");
					input3.type = "text";
					input3.oninput = function () { UpdateFlipListing(this); };
					input3.placeholder = "Sell price";
					td.appendChild(input3);
					break;
				case 3:
					let input4 = document.createElement("input");
					input4.type = "text";
					input4.oninput = function () { UpdateFlipListing(this) };
					input4.placeholder = "Amount";
					td.appendChild(input4);
					break;
				case 4:
					td.innerHTML = "-";
					td.classList.add("horizontalAlignRight");
					break;
				case 5:
					let button1 = document.createElement("button");
					button1.onclick = function () { DuplicateFlipListing(this); };
					button1.title = "Duplicate this flip listing";
					button1.innerHTML = "+";
					button1.tabIndex = "-1";
					td.classList.add("horizontalAlignMiddle");
					td.appendChild(button1);
					break;
				case 6:
					let button2 = document.createElement("button");
					button2.onclick = function () { RemoveFlipListing(this); };
					button2.title = "Remove this flip listing";
					button2.innerHTML = "-";
					button2.tabIndex = "-1";
					td.classList.add("horizontalAlignMiddle");
					td.appendChild(button2);
					break;
			}
		}
	}
	
	TableStyling(flipListTable);
	// Scrolling down to the bottom of the fliplisting body
	flipListTable.scrollTop = flipListTable.scrollHeight;
}

function DuplicateFlipListing(element) {
	let currentTableRow = element.parentNode.parentNode;
	let currentTableIndex = element.parentNode.parentNode.rowIndex;
	let duplicateRow = currentTableRow;

	// Inserting a new table row after the copied table row
	flipListTable.insertRow(currentTableIndex + 1);
	// Inserting the contents from the copied table row into this table row
	flipListBody.children[currentTableIndex].innerHTML = duplicateRow.innerHTML;
	// Inserting eventlisteners. (these won't be copied along)
	flipListBody.rows[currentTableIndex].cells[0].children[0].onchange = function () { UpperCaseWords(this); UpdateFlipListing(this); };
	flipListBody.rows[currentTableIndex].cells[1].children[0].oninput = function () { UpdateFlipListing(this); };
	flipListBody.rows[currentTableIndex].cells[2].children[0].oninput = function () { UpdateFlipListing(this); };
	flipListBody.rows[currentTableIndex].cells[3].children[0].oninput = function () { UpdateFlipListing(this); };
	flipListBody.rows[currentTableIndex].cells[5].children[0].onclick = function () { DuplicateFlipListing(this); };
	flipListBody.rows[currentTableIndex].cells[6].children[0].onclick = function () { RemoveFlipListing(this); };
	// Inserting and modifying data compared to the original table row
	flipListBody.rows[currentTableIndex].cells[0].children[0].value = duplicateRow.cells[0].children[0].value;
	flipListBody.rows[currentTableIndex].cells[1].children[0].value = duplicateRow.cells[1].children[0].value;
	flipListBody.rows[currentTableIndex].cells[2].children[0].value = duplicateRow.cells[2].children[0].value;
	flipListBody.rows[currentTableIndex].cells[4].innerHTML = "-";
	// Select the first cell of the duplicated fliplisting
	flipListBody.rows[currentTableIndex].cells[3].children[0].select();

	TableStyling(flipListTable);
	// Scrolling down the height of a fliplisting.
	flipListTable.scrollTop = (flipListTable.scrollTop + flipListBody.rows[0].scrollHeight);
}

function RemoveFlipListing(element) {
	if (flipListBody.rows.length > 1) {
		let rowNumber = element.parentNode.parentNode.rowIndex;
		flipListTable.deleteRow(rowNumber);
	} else {
		flipListBody.rows[0].cells[0].children[0].value = "";
		flipListBody.rows[0].cells[1].children[0].value = "";
		flipListBody.rows[0].cells[2].children[0].value = "";
		flipListBody.rows[0].cells[3].children[0].value = "";
		UpdateFlipListing(element);
	}
	
	UpdateJSONObject();
	UpdateBuyLimits();
	UpdateStatistics();
	TableStyling(flipListTable);
}

function UpdateFlipListing(element) {
	let buyPrice = element.parentNode.parentNode.children[1].children[0];
	let sellPrice = element.parentNode.parentNode.children[2].children[0];
	let amount = element.parentNode.parentNode.children[3].children[0];
	let totalProfitThisItem = element.parentNode.parentNode.children[4];
	
	buyPrice.value = `${buyPrice.value.replace("m", "000000")}`;
	buyPrice.value = `${buyPrice.value.replace("M", "000000")}`;
	buyPrice.value = `${buyPrice.value.replace("k", "000")}`;
	buyPrice.value = `${buyPrice.value.replace("K", "000")}`;
	sellPrice.value = `${sellPrice.value.replace("m", "000000")}`;
	sellPrice.value = `${sellPrice.value.replace("M", "000000")}`;
	sellPrice.value = `${sellPrice.value.replace("k", "000")}`;
	sellPrice.value = `${sellPrice.value.replace("K", "000")}`;
	amount.value = `${amount.value.replace("m", "000000")}`;
	amount.value = `${amount.value.replace("M", "000000")}`;
	amount.value = `${amount.value.replace("k", "000")}`;
	amount.value = `${amount.value.replace("K", "000")}`;
	
	buyPrice.value = (Number(buyPrice.value) ? buyPrice.value : "");
	sellPrice.value = (Number(sellPrice.value) ? sellPrice.value : "");
	amount.value = (Number(amount.value) ? amount.value : "");
	
	totalProfitThisItem.innerHTML = `${FormatNumber(((sellPrice.value - buyPrice.value) * amount.value))}gp`;

	if (totalProfitThisItem.innerHTML == "NaN" || totalProfitThisItem.innerHTML == 0) {
		totalProfitThisItem.innerHTML = "-";
		totalProfits.innerHTML = "-";
	}
	
	UpdateJSONObject();
	UpdateBuyLimits();
	UpdateStatistics();
}

function UpperCaseWords(stringOfWords) {
	let input = stringOfWords.value.trim();
	let output = "";
	let nextCharInCaps = true;
	
	for (let i = 0; i < input.length; i++) {
		if (nextCharInCaps) {
			if (input[i] != " ") {
				output = output.concat(input[i].toUpperCase());
				nextCharInCaps = false;
				// Uppercase the letter of a word
			} else {
				// Double spaces will be ignored here
			}
		} else {
			if (input[i] != " ") {
				output = output.concat(input[i].toLowerCase());
				// Lowercase letter of a word
			} else {
				output = output.concat(input[i].toLowerCase());
				nextCharInCaps = true;
				// Spacebar detected, next character is queued for a capital letter
			}
		}
	}
	
	stringOfWords.value = output;
}

function TableStyling(element) {
	let tableHeaderRow = element.children[0].children[0];
	let tableBody = element.children[1];
	
	//*/ Tablerow alternating background colors
	for (let i = 0; i < tableBody.rows.length; i++) {
		tableBody.rows[i].style.backgroundColor = (i % 2 == 1 ? "#DDF" : "#BBD");
	}
	//*/

	//*/ Table header cell seperators
	for (let i = 0; i < tableHeaderRow.cells.length - 1; i++) {
		tableHeaderRow.cells[i].style.borderRight = "1px solid #559";
	}
	//*/
}

function UpdateJSONObject() {
	flipHashTable = {"Length": 0};
	uniqueItemNames = [];

	//*/ Creating a JSON Object, containing the data from all flips
	for (let i = 0; i < flipListBody.rows.length; i++) {
		if (flipListBody.rows[i].cells[0].children[0].value != "") {
			let itemName = flipListBody.rows[i].cells[0].children[0].value;

			if (flipHashTable[flipListBody.rows[i].cells[0].children[0].value]) {
				flipHashTable[itemName].buyPrice += parseInt(flipListBody.rows[i].cells[1].children[0].value);
				flipHashTable[itemName].sellPrice += parseInt(flipListBody.rows[i].cells[2].children[0].value);
				flipHashTable[itemName].amount += parseInt(flipListBody.rows[i].cells[3].children[0].value);
				flipHashTable[itemName].totalProfits += UnFormatNumber(flipListBody.rows[i].cells[4].innerHTML);
				flipHashTable[itemName].itemMerges++;
			} else {
				flipHashTable[itemName] = {
					"buyPrice": parseInt(flipListBody.rows[i].cells[1].children[0].value),
					"sellPrice": parseInt(flipListBody.rows[i].cells[2].children[0].value),
					"amount": parseInt(flipListBody.rows[i].cells[3].children[0].value),
					"totalProfits": UnFormatNumber(flipListBody.rows[i].cells[4].innerHTML),
					"itemMerges": 1
				};

				flipHashTable.Length++;
				uniqueItemNames.push(itemName);
			}
		}
	}
	//*/
}

function UpdateBuyLimits() {
	buyLimitsBody.innerHTML = "";

	for (let i = 0; i < flipHashTable.Length; i++) {
		let tr = document.createElement("tr");
		buyLimitsBody.appendChild(tr);

		for (let x = 0; x < 2; x++) {
			let td = tr.insertCell(x);

			switch (x) {
				case 0:
					td.classList.add("horizontalAlignMiddle");
					td.innerHTML = uniqueItemNames[i];
					break;
				case 1:
					td.classList.add("horizontalAlignRight");
					td.innerHTML = (Number.isInteger(flipHashTable[uniqueItemNames[i]].amount) ? flipHashTable[uniqueItemNames[i]].amount : 0);
					break;
			}
		}
	}

	TableStyling(buyLimitsTable);

	if (flipHashTable.Length <= 0) {
		buyLimitsGroup.style.display = "none";
	} else {
		buyLimitsGroup.style.display = "block";
	}
}

function UpdateStatistics() {
	let checkTotalProfits = 0;
	let checkAmountOfUniqueItemsFlipped = 0;
	let checkingTotalAmountOfFlips = 0;
	let checkingTotalAmountOfItemsFlipped = 0;
	let checkingMostProfitingItemItemId = -1;
	let checkingMostProfitingItemProfitsCombined = 0;
	let checkingHighestAverageFlipMarginItemId = -1;
	let checkingHighestAverageFlipMarginAverageProfitEachItem = 0;


	//*/ Looping through the JSON Object, containing the data from all flips
	for (let i = 0; i < flipHashTable.Length; i++) {
		// Checking total profits
		checkTotalProfits += flipHashTable[uniqueItemNames[i]].totalProfits;
		// Checking total amount of unique items flipped
		checkAmountOfUniqueItemsFlipped++;
		// Checking total amount of flips
		checkingTotalAmountOfFlips += flipHashTable[uniqueItemNames[i]].itemMerges;
		// Checking total amount of items flipped
		checkingTotalAmountOfItemsFlipped += flipHashTable[uniqueItemNames[i]].amount;

		// Checking which is the most profitable item
		if (flipHashTable[uniqueItemNames[i]].totalProfits >= checkingMostProfitingItemProfitsCombined) {
			checkingMostProfitingItemItemId = i;
			checkingMostProfitingItemProfitsCombined = flipHashTable[uniqueItemNames[i]].totalProfits;
		}

		// Checking which item has the highest average flip margin
		if (((flipHashTable[uniqueItemNames[i]].sellPrice - flipHashTable[uniqueItemNames[i]].buyPrice) / flipHashTable[uniqueItemNames[i]].itemMerges) >= checkingHighestAverageFlipMarginAverageProfitEachItem) {
			checkingHighestAverageFlipMarginItemId = i;
			checkingHighestAverageFlipMarginAverageProfitEachItem = ((flipHashTable[uniqueItemNames[i]].sellPrice - flipHashTable[uniqueItemNames[i]].buyPrice) / flipHashTable[uniqueItemNames[i]].itemMerges);
		}
	}
	//*/


	// Setting of Totals
	totalProfits.innerHTML = `${FormatNumber(checkTotalProfits)}gp`;
	amountOfUniqueItemsFlipped.innerHTML = checkAmountOfUniqueItemsFlipped;
	totalAmountOfFlips.innerHTML = checkingTotalAmountOfFlips;
	totalAmountOfItemsFlipped.innerHTML = checkingTotalAmountOfItemsFlipped;

	// Setting of Most profiting item
	if (checkingMostProfitingItemItemId != -1) {
		mostProfitingItemItemName.innerHTML = uniqueItemNames[checkingMostProfitingItemItemId];
		mostProfitingItemAverageProfitEachItem.innerHTML = `${FormatNumber((flipHashTable[uniqueItemNames[checkingMostProfitingItemItemId]].sellPrice - flipHashTable[uniqueItemNames[checkingMostProfitingItemItemId]].buyPrice) / flipHashTable[uniqueItemNames[checkingMostProfitingItemItemId]].itemMerges)}gp`;
		mostProfitingItemAverageBuyPrice.innerHTML = `${FormatNumber(flipHashTable[uniqueItemNames[checkingMostProfitingItemItemId]].buyPrice / flipHashTable[uniqueItemNames[checkingMostProfitingItemItemId]].itemMerges)}gp`;
		mostProfitingItemAverageSellPrice.innerHTML = `${FormatNumber(flipHashTable[uniqueItemNames[checkingMostProfitingItemItemId]].sellPrice / flipHashTable[uniqueItemNames[checkingMostProfitingItemItemId]].itemMerges)}gp`;
		mostProfitingItemProfitsCombined.innerHTML = `${FormatNumber(checkingMostProfitingItemProfitsCombined)}gp`;
	} else {
		mostProfitingItemItemName.innerHTML = "-";
		mostProfitingItemAverageProfitEachItem.innerHTML = "-";
		mostProfitingItemAverageBuyPrice .innerHTML = "-";
		mostProfitingItemAverageSellPrice .innerHTML = "-";
		mostProfitingItemProfitsCombined .innerHTML = "-";
	}
	
	// Setting of Highest average flip margin
	if (checkingHighestAverageFlipMarginItemId != -1) {
		highestAverageFlipMarginItemName.innerHTML = uniqueItemNames[checkingHighestAverageFlipMarginItemId];
		highestAverageFlipMarginAverageProfitEachItem.innerHTML = `${FormatNumber(checkingHighestAverageFlipMarginAverageProfitEachItem)}gp`;
		highestAverageFlipMarginAverageBuyPrice.innerHTML = `${FormatNumber(flipHashTable[uniqueItemNames[checkingHighestAverageFlipMarginItemId]].buyPrice / flipHashTable[uniqueItemNames[checkingHighestAverageFlipMarginItemId]].itemMerges)}gp`;
		highestAverageFlipMarginAverageSellPrice.innerHTML = `${FormatNumber(flipHashTable[uniqueItemNames[checkingHighestAverageFlipMarginItemId]].sellPrice / flipHashTable[uniqueItemNames[checkingHighestAverageFlipMarginItemId]].itemMerges)}gp`;
		highestAverageFlipMarginProfitsCombined.innerHTML = `${FormatNumber(flipHashTable[uniqueItemNames[checkingHighestAverageFlipMarginItemId]].totalProfits)}gp`;
	} else {
		highestAverageFlipMarginItemName.innerHTML = "-";
		highestAverageFlipMarginAverageProfitEachItem.innerHTML = "-";
		highestAverageFlipMarginAverageBuyPrice.innerHTML = "-";
		highestAverageFlipMarginAverageSellPrice.innerHTML = "-";
		highestAverageFlipMarginProfitsCombined.innerHTML = "-";
	}
}

AddFlipListing(3);
UpdateBuyLimits();
TableStyling(statistics1Table);
TableStyling(statistics2Table);
TableStyling(statistics3Table);
// Select the first cell from the first fliplisting
flipListBody.rows[0].cells[0].children[0].select();