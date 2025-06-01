// Variables
const stripeloginForm = document.querySelector("#stripe-login");
let Mazane, Wight, Sood;


// Add Event Listeners
stripeloginForm.addEventListener('submit', SubmitForm);


document.querySelector('#Mazane').addEventListener('keyup', function(event) {
    const value = event.target.value.replace(/,/g, ''); // Remove existing commas
    const number = Number(value);
  
    if (!isNaN(number)) {
      const formattedValue = number.toLocaleString('en-US');
      event.target.value = formattedValue;
  
      // Optional: Adjust cursor position (see explanation below)
    } else {
      event.target.value = ''; // Clear non-numeric input
    }
  });


// Functions
// function isValidDecimal(decimalValue) {
//     const regex = /^-?\d+(\.\d+)?$/;
//       if (typeof decimalValue !== 'string') {
//       return false;
//     }
//     return regex.test(decimalValue);
// }
function isValidDecimal(decimalValue) {
    // Regex to validate the format
    const regex = /^\d{1,3}(,\d{3})*(\.\d+)?$/;

    // Ensure the input is a string
    if (typeof decimalValue !== 'string') {
        // let str = decimalValue.toString();
        // return regex.test(str);
        return false;
    }
    // Test the value against the regex
    return regex.test(decimalValue);
}


function SubmitForm(e) {
    e.preventDefault();
    // Get Value Of Form    
    Mazane = document.querySelector('#Mazane').value.replace(/,/g, '');
    Wight = document.querySelector('#Wight').value;
    Sood = document.querySelector('#Sood').value;
    console.log(`Mazane: ${Mazane}, Wight: ${Wight}, Sood: ${Sood}`); 
    // Validate 
    if (ValidateFields(Sood, Wight, Mazane)) {
        const totalPrice = formatNumberWithSlashes(roundToString(productTotalPrice(Wight, Sood, Mazane)));
        const SoodGram = calculateSood(Wight, Sood);
        const SoodGramPrice = formatNumberWithSlashes(calculatePrice(Mazane, calculateSood(Wight, Sood)));
        const NetPrice = formatNumberWithSlashes(calculatePrice(Mazane, Wight));
        // console.log(`Total Price: ${totalPrice}`);
        swal({
            title: "نتیجه محاسبات",
            text: `خالص طلا : ${NetPrice} \n
                   درصد سود به گرم : ${SoodGram} \n
                   قیمت سود : ${SoodGramPrice} \n 
                   جمع کل : ${totalPrice}`,
            confirmButtonColor: "rgb(223, 190, 46)",
            confirmButtonText: "متوجه شدم"
        });
    }
}

function ValidateFields(Sood, Wight, Mazane) {
    console.log(isValidDecimal(Mazane));
    if (!isValidDecimal(Sood)) 
        {
            swal({
                title: "خطا",
                text: "مقدار سود را درست وارد کنید",
                confirmButtonColor: "rgb(247, 0, 0)",
                confirmButtonText: "متوجه شدم"
            });
            return false;
        }
    
        if (!isValidDecimal(Wight)) 
        {
                swal({
                    title: "خطا",
                    text: "مقدار وزن را درست وارد کنید",
                    confirmButtonColor: "rgb(247, 0, 0)",
                    confirmButtonText: "متوجه شدم"
                });
                return false;
        }
        if (isValidDecimal(Mazane)) 
        {
            swal({
                title: "خطا",
                text: "مقدار مظنه را درست وارد کنید",
                confirmButtonColor: "rgb(247, 0, 0)",
                confirmButtonText: "متوجه شدم"
            });
            return false;
        }

        return true;
}



function productTotalPrice(weight, percent, mazane) {
    const Decimal = window.Decimal; // For browser environment
    // const { Decimal } = require('decimal.js'); // Uncomment for Node.js
  
    const soodGram = new Decimal(weight).dividedBy(100).times(percent);
    const threeDigit = soodGram.toDecimalPlaces(3); // Keep 3 decimal places
    const priceGram = new Decimal(mazane).dividedBy(4.3318).times(threeDigit);
    const goldNetPrice = new Decimal(mazane).dividedBy(4.3318).times(weight);
    const totalPrice = priceGram.plus(goldNetPrice);
  
    return totalPrice.toNumber(); // Convert back to a regular number if needed
  }

  function roundToString(dl) {
    // Ensure dl is a Decimal instance
    if (!(dl instanceof Decimal)) {
        dl = new Decimal(dl); // Convert to Decimal if it's not already
    }
    const result = (dl.dividedBy(1000).times(1000)).toFixed(0);
    return result; // Format to string without decimals
}


// Function to calculate "sood" based on weight and percent
function calculateSood(weight, percent) {
    const result = new Decimal(weight).dividedBy(100).times(percent);
    return result.toFixed(3); // Format to string with 3 decimal places
}

function formatNumberWithSlashes(number) {
    const numStr = number.toString();
    let formattedNumber = '';
  
    for (let i = numStr.length - 1, count = 0; i >= 0; i--, count++) {
      formattedNumber = numStr[i] + formattedNumber;
      if (count % 3 === 2 && i !== 0) {
        formattedNumber = '/' + formattedNumber;
      }
    }
  
    return formattedNumber;
  }
  
  // Function to calculate price based on mazane and weight
  function calculatePrice(mazane, weight) {
    const result = new Decimal(mazane).dividedBy(4.3318).times(weight);
    return roundToString(result); // Use roundToString to format the result
  }