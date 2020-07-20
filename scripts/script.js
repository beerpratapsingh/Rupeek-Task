//jshint esversion:6
const url = 'https://training.rupeek.com/getcustomerinfo';
const lodeMoreBtn = document.getElementById('lodeMoreBtn');
let userId;
let pageNo = 1;

(async () => {
  const getCustomerInfo = await fetch(url).then(res => res.json());// JSON data parsed by res.json()
  userId = getCustomerInfo.toUserId;  
  document.getElementById('customerName').innerText = getCustomerInfo.name;
  await getTxnInfo(userId, pageNo);
})();

async function getTxnInfo(userId, pageNo){
  const url = `https://training.rupeek.com/gettxninfo/${userId}/${pageNo}`;  
  let txnContainer = document.getElementsByClassName('txn-container')[0];  
  let getTxn = await fetch(url)
    .then(res => res.json())
    .catch( err => err);
  // getTxn.result = [];  
  if(getTxn.status !== 200 && getTxn.ErrorMsg){
    alert(getTxn.ErrorMsg);
    return false;
  }  
  if (getTxn.result && getTxn.result.length === 0){
    lodeMoreBtn.classList.add("disabled");
  }        
  getTxn.result.map( detail => {
    let date = getTxnDate(detail.createdAt);
    let templateData = getTxnTemplate(
      { bankName: detail.bank, accountNo: detail.account_no, status: detail.transactionStatusId, date, amount: detail.amount});    
    txnContainer.appendChild(templateData);
  });
}

function getTxnTemplate(bankDetails) {
  const div = document.createElement('div');
  div.classList.add('card-block', 'd-flex', 'justify-content-between', 'align-items-center', 'py-4');

  let template = `        
          <div class="card-content d-flex flex-grow-1 align-items-center">
            <div class="icon mr-3">
              <img src="./images/icon.svg" class="img-responsive" />
            </div>
            <div class="card-text flex-grow-1">
              <p>${bankDetails.bankName} | ${bankDetails.accountNo}</p>
              <p>Status: ${bankDetails.status === 1 ? 'Transaction success' : 'Transaction Failure'}</p>
              <p class="sub-date">${bankDetails.date}</p>
            </div>
          </div>
          <div class="amount">
            <h4><span>₹</span>${bankDetails.amount}</h4>
          </div>        
      `
      div.innerHTML = template;
      return div;
}

function getTxnDate(date) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const txnDate = new Date(date);
  return `${txnDate.getDate()} ${monthNames[txnDate.getMonth()]} ${txnDate.getFullYear()}`
}

lodeMoreBtn.addEventListener('click', function () {
  pageNo+=1;
  if(!userId){
    alert('Not found user id');
    return false;
  }
  getTxnInfo(userId, pageNo);
});


