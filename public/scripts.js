document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
  
    // Get the file input element
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please select a file.");
      return;
    }
  
    // Show spinner
    document.querySelector(".spinner-border-container").style.display = "block";
  
    // Create FormData object and append the file
    const formData = new FormData();
    formData.append("file", file);
  
    // Send a POST request to server (Replace with your server endpoint)
    fetch("/extractText", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide spinner
        document.querySelector(".spinner-border-container").style.display = "none";
  
        // Display extracted text on the page
        document.getElementById("outputText").textContent = JSON.stringify(data, null, 2);
        document.getElementById("outputContainer").style.display = "block";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
        // Hide spinner in case of error
        document.querySelector(".spinner-border-container").style.display = "none";
      });
  });
  
 