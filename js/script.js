// A 2-dimensional array for each state and corresponding shipping zones.
// Only states are assumed. D.C., Virgin Islands, and Puerto Rico are not included.
const STATEZONES = [
    ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"],
    [3, 6, 5, 4, 4, 4, 1, 1, 3, 3, 6, 5, 3, 2, 3, 4, 2, 4, 1, 2, 1, 3, 3, 3, 3, 5, 4, 5, 1, 1, 5, 1, 2, 4, 2, 4, 5, 2, 1, 2, 4, 3, 5, 5, 1, 2, 5, 2, 3, 5]
]

const ZONESHIPPING = [0.00, 20.00, 30.00, 35.00, 45.00, 50.00]

const ITEMPRICES = {
    "chair": 25.50,
    "recliner": 37.75,
    "table": 49.95,
    "umbrella": 24.89
}

function capitalize(stringToCapitalize) {
    return stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.slice(1);
}

function buyNow() {
    let userCanceledTransaction = false;
    let itemsToPurchase = {};
    let shippingState = "";

    while (true) {
        let item = prompt("What item would you like to buy today: Chair, Recliner, Table, or Umbrella?");
    
        if (item === null) break; // If nothing is entered assume the user no longer wants to shop.
        
        item = item.toLowerCase(); // Converts to lowercase for proper validation.

        if (item in ITEMPRICES) { // Does the item exist in our ITEMPRICES table?
            let itemQuantity = 1;
            
            // Ask tue user how many of that item they want to buy. We also do some sanity checks
            // for non-numerical values by attempting to force the string into a Number type and,
            // if NaN, inform the user of an invalid entry. Hitting cancel is null and assumes a zero value.
            while (true) {
                itemQuantity = Number(prompt(`How many ${item}(s) would you like to buy?`));
                if (isNaN(itemQuantity)) {
                    alert("Invalid entry. Please enter an integer.");
                } else {
                    itemQuantity = Math.trunc(itemQuantity); // Forces an integer value. Can't have fractions of chairs.
                    break;
                }
            }
            
            // Adds our purchased items and desired quantity to a dictionary.
            if (itemQuantity > 0) {
                if (item in itemsToPurchase) {
                    itemsToPurchase[item] += itemQuantity;
                } else {
                    itemsToPurchase[item] = itemQuantity;
                }
            }
    
            let continueShopping = prompt("Continue shopping? y/n")
            if (continueShopping.toLowerCase() !== "y") {
                break; // Anything but 'y' will exit.
            }

        } else {
            alert(`Item "${item}" does not exist or is unavailable for purchase.`);
        }        
    }

    // Get the state the user wants to ship to.
    // If they hit cancel on the prompt we'll assume they do not wish to continue.
    while (true) {
        shippingState = prompt("Please enter the two letter state abbreviation.");
        if (typeof(shippingState) === "string") {
            shippingState = shippingState.toUpperCase();
            if (STATEZONES[0].includes(shippingState)) {
                break;
            }
        }

        if (shippingState === null) {
            userCanceledTransaction = true;
            break;
        }
    }

    // Only if the user did not cancel the transaction in the last step do we continue with calculations.
    if (!userCanceledTransaction) {
        let itemTotal = 0;
        let itemInvoiceTable = "<table><tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Price</th></tr>"; // Start building the table to display the invoice.
        
        for (let item in itemsToPurchase) {
            let quantityTotal = itemsToPurchase[item] * ITEMPRICES[item]
            itemTotal += quantityTotal;
            itemInvoiceTable +=
            `<tr>
                <td>${capitalize(item)}</td>
                <td>${itemsToPurchase[item]}</td>
                <td>$${ITEMPRICES[item].toFixed(2)}</td>
                <td class="price">$${quantityTotal.toFixed(2)}</td>
            </tr>`
        }

        itemInvoiceTable += "</table>";

        // Oh my god this is hideous.
        let shippingPrice = itemTotal > 100.00 ? 0.00 : ZONESHIPPING[STATEZONES[1][STATEZONES[0].indexOf(shippingState)] - 1];
        let subTotal = itemTotal + shippingPrice;
        let tax = subTotal * 0.15;
        let invoiceTotal = subTotal + tax;

        let itemInvoiceTotals =
        `
        <table>
            <tr>
                <td>Item Total:</td>
                <td class="price">$${itemTotal.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Shipping to ${shippingState}:</td>
                <td class="price">$${shippingPrice.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Subtotal:</td>
                <td class="price">$${subTotal.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Tax:</td>
                <td class="price">$${tax.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Invoice Total:</td>
                <td class="price">$${invoiceTotal.toFixed(2)}</td>
            </tr>
        </table>
        `;

        document.getElementById("invoicetable").innerHTML = itemInvoiceTable;
        document.getElementById("totals").innerHTML = itemInvoiceTotals;
        document.getElementById("invoicediv").style.display = "block";
    }
}


function shopAgain() {
    document.getElementById("invoicediv").style.display = "none";
}