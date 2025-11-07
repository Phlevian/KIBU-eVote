// confirmation.js

// Wait until page loads fully
document.addEventListener("DOMContentLoaded", () => {
    // 1. Copy Transaction ID
    const copyBtn = document.getElementById("copyBtn");
    const transactionId = document.getElementById("transactionId");

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(transactionId.textContent).then(() => {
            alert("Transaction ID copied to clipboard!");
        }).catch(() => {
            alert("Failed to copy Transaction ID.");
        });
    });

    // 2. Download PDF Receipt (placeholder)
    const downloadBtn = document.querySelector(".download-btn");
    downloadBtn.addEventListener("click", () => {
        alert("PDF Receipt will be downloaded (feature coming soon).");
    });

    // 3. Email Receipt (placeholder)
    const emailBtn = document.querySelector(".email-btn");
    emailBtn.addEventListener("click", () => {
        alert("Receipt will be emailed to your registered address (feature coming soon).");
    });

    // 4. Verify on Blockchain
    const verifyBtn = document.querySelector(".verify-btn");
    verifyBtn.addEventListener("click", () => {
        const explorerURL = "https://kibu-blockchain-explorer.com/tx/" + transactionId.textContent;
        window.open(explorerURL, "_blank");
    });

    // 5. Open Blockchain Explorer (from instructions card)
    const explorerBtn = document.querySelector(".explorer-btn");
    explorerBtn.addEventListener("click", () => {
        const explorerURL = "https://kibu-blockchain-explorer.com/tx/" + transactionId.textContent;
        window.open(explorerURL, "_blank");
    });

    // 6. Report a problem
    const reportLink = document.querySelector(".report");
    reportLink.addEventListener("click", () => {
        alert("Report submitted. Our team will review it shortly.");
    });
});
