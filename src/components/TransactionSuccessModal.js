import React from "react";

const TransactionSuccessModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrintReceipt = () => {
    const receiptWindow = window.open("", "_blank");

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Transaction Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            .receipt-container { width: 300px; margin: auto; padding: 20px; border: 1px solid black; }
            h2 { margin-bottom: 5px; }
            hr { border: 0.5px solid black; }
            .details { text-align: left; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <h2>RCS TOPUP & BILLING ENTITY</h2>
            <p>22 BELLE PLAINE WAKENAAM</p>
            <p>662-7987 / 649-1514</p>
            <hr />
            <p><strong>Receipt Number:</strong> ${transaction.receiptNumber}</p>
            <p><strong>Date:</strong> ${new Date(transaction.date).toLocaleString()}</p>
            <p><strong>Investor:</strong> ${transaction.investorName}</p>
            <p><strong>Transaction:</strong> ${transaction.transactionType}</p>
            <p><strong>Amount:</strong> $${parseFloat(transaction.amount).toFixed(2)}</p>
            <p><strong>Account Balance:</strong> $${parseFloat(transaction.accountBalance).toFixed(2)}</p>
            <hr />
            <p>Thank you for your business!</p>
            <button onclick="window.print()">🖨 Print Receipt</button>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  return (
    <div className="success-modal">
      <div className="modal-content">
        <h2>✅ Transaction Successful!</h2>
        <p>Your transaction has been processed.</p>
        <button onClick={handlePrintReceipt}>🖨 Print Receipt</button>
        <button onClick={onClose}>❌ Close</button>
      </div>
    </div>
  );
};

export default TransactionSuccessModal;
